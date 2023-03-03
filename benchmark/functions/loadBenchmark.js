import autocannon from "autocannon";
import axios from "axios";
import fs from "fs";
import {
  getUser_GraphQL,
  getOrders_GraphQL,
  getProducts_GraphQL,
  createProduct_GraphQL,
  getProductBoughtByUser_GraphQL,
  getProductBoughtByUser_GraphQL_2,
} from "./benchmark_functions.js";

const nConnections = [1, 10, 100, 1000, 10000];

export const getUsersBenchmark = async () => {
  const results = {};
  const getUserQuery = getUser_GraphQL();

  for (let i = 0; i < nConnections.length; i++) {
    for (let j = 0; j < 10; j++) {
      console.log("Round " + j + " - " + nConnections[i] + " connections");
      const instance = await autocannon({
        url: getUserQuery.url,
        connections: nConnections[i],
        pipelining: 1,
        duration: 100,
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(getUserQuery.data),
      });
      if (!results[nConnections[i]]) {
        results[nConnections[i]] = [instance];
      } else {
        results[nConnections[i]].push(instance);
      }
    }
  }
  try {
    await fs.writeFile(
      "./results/load_getUsers_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("load_getUsers_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const createProductBenchmark = async () => {
  const results = {};
  const createProductMutation = createProduct_GraphQL();

  for (let i = 0; i < nConnections.length; i++) {
    for (let j = 0; j < 10; j++) {
      console.log("Round " + j + " - " + nConnections[i] + " connections");
      const instance = await autocannon({
        url: createProductMutation.url,
        connections: nConnections[i],
        pipelining: 1,
        duration: 100,
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(createProductMutation.data),
      });
      if (!results[nConnections[i]]) {
        results[nConnections[i]] = [instance];
      } else {
        results[nConnections[i]].push(instance);
      }
    }
  }
  try {
    await fs.writeFile(
      "./results/load_createProduct_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("load_createProduct_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// export const getProductBoughtByUserBenchmark = async () => {
//   const results = {};
//   const getProductBoughtByUserQuery = getProductBoughtByUser_GraphQL();

//   for (let i = 0; i < nConnections.length; i++) {
//     for (let j = 0; j < 10; j++) {
//       console.log("Round " + j + " - " + nConnections[i] + " connections");
//       const instance = await autocannon({
//         url: getProductBoughtByUserQuery.url,
//         connections: nConnections[i],
//         pipelining: 1,
//         duration: 100,
//         method: "POST",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify(getProductBoughtByUserQuery.data),
//       });
//       if (!results[nConnections[i]]) {
//         results[nConnections[i]] = [instance];
//       } else {
//         results[nConnections[i]].push(instance);
//       }
//     }
//   }
//   try {
//     await fs.writeFile(
//       "./results/load_getProductBoughtByUser_GraphQL.json",
//       JSON.stringify(results),
//       (err) => {
//         if (err) throw err;
//         console.log("load_getProductBoughtByUser_GraphQL saved to file");
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };

export const getProductBoughtByUser = async () => {
  try {
    const userQuery = getUser_GraphQL();
    const productQuery = getProducts_GraphQL();
    const orderQuery = getOrders_GraphQL();

    const usersResponse = await axios(userQuery);
    const users = usersResponse.data.data.users;

    const productsResponse = await axios(productQuery);
    const products = productsResponse.data.data.products;

    const ordersReponse = await axios(orderQuery);
    const orders = ordersReponse.data.data.orders;

    const productInfo = {};
    for (const order of orders) {
      for (const prod of order.products) {
        const product = products.find(
          (product) => product._id === prod.productid
        );
        const user = users.find((user) => user._id === order.userid);

        if (!productInfo[product._id]) {
          productInfo[product._id] = [product, []];
        }
        productInfo[product._id][1].push(user);
      }
    }
    return productInfo;
  } catch (error) {
    console.error(error);
  }
};

export const getProductBoughtByUserBenchmark = async () => {
  const results = {};
  const getProductBoughtByUserQuery = getProductBoughtByUser_GraphQL();
  try {
    for (let i = 0; i < nConnections.length; i++) {
      for (let j = 0; j < 10; j++) {
        console.log("Round " + j + " - " + nConnections[i] + " connections");
        const instance = await autocannon({
          url: getProductBoughtByUserQuery.url,
          connections: nConnections[i],
          pipelining: 1,
          duration: 100,
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(getProductBoughtByUserQuery.data),
        });
        if (!results[nConnections[i]]) {
          results[nConnections[i]] = [instance];
        } else {
          results[nConnections[i]].push(instance);
        }
      }
    }
    await fs.writeFile(
      "./results/load_getProductBoughtByUser_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("load_getProductBoughtByUser_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

//##################################################################### REST #######################################################################

export const load_getUsers_REST = async () => {
  const results = {};

  for (let i = 0; i < nConnections.length; i++) {
    for (let j = 0; j < 10; j++) {
      console.log("Round " + j + " - " + nConnections[i] + " connections");
      const instance = await autocannon({
        url: "http://localhost:8082/users",
        connections: nConnections[i],
        pipelining: 1,
        duration: 100,
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!results[nConnections[i]]) {
        results[nConnections[i]] = [instance];
      } else {
        results[nConnections[i]].push(instance);
      }
    }
  }
  try {
    await fs.writeFile(
      "./results/load_getUsers__REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("load_getUsers_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const load_createProduct_REST = async () => {
  const results = {};
  const product = createProduct_GraphQL();

  for (let i = 0; i < nConnections.length; i++) {
    for (let j = 0; j < 10; j++) {
      console.log("Round " + j + " - " + nConnections[i] + " connections");
      const instance = await autocannon({
        url: "http://localhost:8084/product",
        connections: nConnections[i],
        pipelining: 1,
        duration: 100,
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(product.data.variables),
      });
      if (!results[nConnections[i]]) {
        results[nConnections[i]] = [instance];
      } else {
        results[nConnections[i]].push(instance);
      }
    }
  }
  try {
    await fs.writeFile(
      "./results/load_createProduct_REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("load_createProduct_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const load_getProductBoughtByUser_REST = async () => {
  const results = {};

  for (let i = 0; i < nConnections.length; i++) {
    for (let j = 0; j < 10; j++) {
      console.log("Round " + j + " - " + nConnections[i] + " connections");
      const instance = await autocannon({
        url: "http://localhost:10000/products-users",
        connections: nConnections[i],
        pipelining: 1,
        duration: 100,
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });
      if (!results[nConnections[i]]) {
        results[nConnections[i]] = [instance];
      } else {
        results[nConnections[i]].push(instance);
      }
    }
  }
  try {
    await fs.writeFile(
      "./results/load_getProductBoughtByUser_REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("load_getProductBoughtByUser_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};
