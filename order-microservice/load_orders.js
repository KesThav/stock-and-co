import axios from "axios";
import mongoose from "mongoose";
import { createOrder } from "./functions/functions.js";
import { v4 as uuidv4 } from "uuid";
import { startInstance } from "./functions/camunda.js";
import fs from "fs";

async function sleep(milli_seconds = 1000) {
  return new Promise((done) => setTimeout(() => done(), milli_seconds));
}

const getProducts = async () => {
  let products = [];
  var productQuery = JSON.stringify({
    query: `query {
    products {
        _id,
        price
    }
}`,
    variables: {},
  });

  const productConfig = {
    method: "post",
    url: "http://product-microservice:8084/graphql",
    headers: {
      "Content-Type": "application/json",
    },
    data: productQuery,
  };

  try {
    const res = await axios(productConfig);
    if (res) {
      res.data.data.products.forEach((element) => {
        products.push(element);
      });
    }
    return products;
  } catch (err) {
    console.log(err);
  }
};

const getUsers = async () => {
  let users = [];
  var userQuery = JSON.stringify({
    query: `query {
      users {
          _id
      }
  }`,
    variables: {},
  });

  const userConfig = {
    method: "post",
    url: "http://user-microservice:8082/graphql",
    headers: {
      "Content-Type": "application/json",
    },
    data: userQuery,
  };

  try {
    const res = await axios(userConfig);
    if (res) {
      res.data.data.users.forEach((element) => {
        users.push(element);
      });
    }
    return users;
  } catch (err) {
    console.log(err);
  }
};

export const load_orders = async () => {
  console.log("Loading products and users...");
  const productData = await getProducts();
  const userData = await getUsers();
  const orderlist = [];

  //generate fake orders
  console.log("Loading orders...");
  let order = 1;
  //while (order < 300204) {
  try {
    for (let i = 0; i < userData.length; i++) {
      const loopSize = Math.floor(5 * Math.random() + 1);
      for (let j = 0; j < loopSize; j++) {
        const randomLength = Math.floor(10 * Math.random() + 1);
        const array = Array(randomLength)
          .fill()
          .map(() => Math.floor((productData.length - 1) * Math.random()));

        const filterProduct = productData
          .filter((prod, idx) => array.includes(idx))
          .map((prod) => ({
            productid: prod._id,
            price: prod.price,
            quantity: Math.floor(Math.random() * 10 + 1),
            _id: mongoose.Types.ObjectId(),
          }));

        let amount = filterProduct.reduce(
          (total, prod) => total + prod.price * prod.quantity,
          0
        );

        const myorder = {
          orderid: uuidv4(),
          userid: userData[i]._id,
          products: filterProduct,
          total: amount,
          status: "Closed",
          type: "Card",
          discount: 0,
        };

        const data_camunda = {
          userid: userData[i]._id,
          orderid: myorder.orderid,
          ptype: "Card",
          order: myorder,
          discount: 0,
        };

        //await createOrder(myorder);
        console.log("Order " + order + " loaded !");
        order++;
        await startInstance(data_camunda);
        await sleep(1000);
      }
    }

    console.log("Orders loaded !");
    validate_orders();
  } catch (err) {
    console.log(err);
  }
  //}
};

export const validate_orders = async () => {
  console.log("Validating orders...");
  const res = await axios.get("http://camunda:8080/engine-rest/task");

  console.log("Tasks retrieved !");
  const taskid = [];
  if (res) {
    console.log("Validating orders...");
    res.data.forEach((element) => {
      taskid.push(element.id);
    });
    for (let task of taskid) {
      await axios.post(
        `http://camunda:8080/engine-rest/task/${task}/complete`,
        {}
      );
      await sleep(1000);
    }
    console.log("Orders validated !");
  }
};
