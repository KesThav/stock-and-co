import axios from "axios";
import mongoose from "mongoose";
import { createOrder } from "./functions/functions.js";
import { v4 as uuidv4 } from "uuid";

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
    url: "http://localhost:8084/graphql",
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
    url: "http://localhost:8082/graphql",
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

const load_orders = async () => {
  console.log("Loading products and users...");
  const productData = await getProducts();
  const userData = await getUsers();

  //generate fake orders
  console.log("Loading orders...");
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
        };

        await createOrder(myorder);
      }
    }
    console.log("Orders loaded !");
  } catch (err) {
    console.log(err);
  }
};

export default load_orders;
