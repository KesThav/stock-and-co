import autocannon from "autocannon";
import fs from "fs";
import {
  getUser_GraphQL,
  createProduct_GraphQL,
  getProductBoughtByUser_GraphQL,
} from "./benchmark_functions.js";

const nConnections = [1, 10, 100, 1000, 10000];

export const getUsersBenchmark = async () => {
  const results = {};
  const getUserQuery = getUser_GraphQL();
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < nConnections.length; i++) {
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
      "./results/concurrent_getUsers_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("concurrent_getUsers_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const createProductBenchmark = async () => {
  const results = {};
  const createProductMutation = createProduct_GraphQL();
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < nConnections.length; i++) {
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
      "./results/concurrent_createProduct_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("concurrent_createProduct_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const getProductBoughtByUserBenchmark = async () => {
  const results = {};
  const getProductBoughtByUserQuery = getProductBoughtByUser_GraphQL();
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < nConnections.length; i++) {
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
  try {
    await fs.writeFile(
      "./results/concurrent_getProductBoughtByUser_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("concurrent_getProductBoughtByUser_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

//##################################################################### REST #######################################################################

export const concurrent_getUsers_REST = async () => {
  const results = {};
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < nConnections.length; i++) {
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
      "./results/concurrent_getUsers__REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("concurrent_getUsers_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const concurrent_createProduct_REST = async () => {
  const results = {};
  const product = createProduct_GraphQL();
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < nConnections.length; i++) {
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
      "./results/concurrent_createProduct_REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("concurrent_createProduct_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const concurrent_getProductBoughtByUser_REST = async () => {
  const results = {};
  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < nConnections.length; i++) {
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
      "./results/concurrent_getProductBoughtByUser_REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("concurrent_getProductBoughtByUser_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
};
