//contains function to prepare queries and data for benchmarking
import axios from "axios";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

//get users query
export const getUsersQuery = () => {
  return `query {
    users {
      name
      email
      points
    }
  }`;
};

//get products query
export const getProductsQuery = () => {
  return `query {
    products {
      name
      description
      price
      quantity
    }
  }`;
};

//this function get all products
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
    url: "http://localhost:4000/graphql",
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
    url: "http://localhost:4000/graphql",
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

//prepare orders
export const getOrderMutation = (userid, ptype, orderid, products) => {
  return `mutation startOrder($userid: String, $order:OrderInput,$ptype: String, $orderid:String){
    startOrder(userid:$userid,order:$order,ptype:$ptype,orderid:$orderid) {
      message
      __typename
    }
  }`;
};

export const prepareOrders = async () => {
  console.log("Loading products and users...");
  const productData = await getProducts();
  const userData = await getUsers();
  const orderlist = [];
  let orderCount = 0;
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

        const data_camunda = {
          userid: userData[i]._id,
          orderid: myorder.orderid,
          ptype: "Card",
          order: {
            products: myorder.products,
            userid: myorder.userid,
            orderid: myorder.orderid,
          },
        };

        orderlist.push(data_camunda);
        orderCount++;
        console.log(`order nbr ${orderCount} created`);
      }
    }
    console.log("Writing orders to file...");
    try {
      await fs.writeFile(
        "./data/orders.js",
        JSON.stringify(orderlist),
        (err) => {
          if (err) throw err;
          console.log("Orders saved to file");
        }
      );
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};
