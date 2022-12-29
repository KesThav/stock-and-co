import axios from "axios";
import fs from "fs";
import {
  getUser_GraphQL,
  createProduct_GraphQL,
  getProductBoughtByUser_GraphQL,
} from "./benchmark_functions.js";

const nIterations = [1, 10, 100, 1000, 10000];

export const b_getUsers_GraphQL = async () => {
  const getUserQuery = getUser_GraphQL();
  const results = {
    1: [],
    10: [],
    100: [],
    1000: [],
    10000: [],
    errors_1: [],
    errors_10: [],
    errors_100: [],
    errors_1000: [],
    errors_10000: [],
  };
  for (let z = 0; z < 5; z++) {
    for (let i = 0; i < nIterations.length; i++) {
      let errors = 0;
      let time = Date.now();
      for (let j = 0; j < nIterations[i]; j++) {
        console.log(
          `Iteration: ${z} - nIterations: ${nIterations[i]} - j: ${j}`
        );

        const response = await axios(getUserQuery);
        console.log(response.data);
        if (response.data.errors) {
          errors++;
        }
      }
      results[nIterations[i]].push(Date.now() - time);
      results[`errors_${nIterations[i]}`].push(errors);
    }
  }
  try {
    await fs.writeFile(
      "./results/sequential_getUsers_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("sequential_getUsers_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
  return "running benchmark sequential_getUsers_GraphQL";
};

export const b_createProduct_GraphQL = async () => {
  const createProductMutation = createProduct_GraphQL();
  console.log(createProductMutation);
  const results = {
    1: [],
    10: [],
    100: [],
    1000: [],
    10000: [],
    errors_1: [],
    errors_10: [],
    errors_100: [],
    errors_1000: [],
    errors_10000: [],
  };
  for (let z = 0; z < 50; z++) {
    for (let i = 0; i < nIterations.length; i++) {
      let errors = 0;
      let time = Date.now();
      for (let j = 0; j < nIterations[i]; j++) {
        console.log(
          `Iteration: ${z} - nIterations: ${nIterations[i]} - j: ${j}`
        );

        const response = await axios(createProductMutation);
        if (response.data.errors) {
          errors++;
        }
      }
      results[nIterations[i]].push(Date.now() - time);
      results[`errors_${nIterations[i]}`].push(errors);
    }
  }
  try {
    await fs.writeFile(
      "./results/sequential_createProduct_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("sequential_createProduct_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
  return "running benchmark sequential_createProduct_GraphQL";
};

//function that return the list and product bought by a user
export const b_getProductBoughtByUser_GraphQL = async () => {
  const getProductBoughtByUserQuery = getProductBoughtByUser_GraphQL();
  const results = {
    1: [],
    10: [],
    100: [],
    1000: [],
    10000: [],
    errors_1: [],
    errors_10: [],
    errors_100: [],
    errors_1000: [],
    errors_10000: [],
  };
  for (let z = 0; z < 3; z++) {
    for (let i = 0; i < nIterations.length; i++) {
      let errors = 0;
      let time = Date.now();
      for (let j = 0; j < nIterations[i]; j++) {
        console.log(
          `Iteration: ${z} - nIterations: ${nIterations[i]} - j: ${j}`
        );

        const response = await axios(getProductBoughtByUserQuery);
        if (response.data.errors) {
          errors++;
        }
      }
      results[nIterations[i]].push(Date.now() - time);
      results[`errors_${nIterations[i]}`].push(errors);
    }
  }
  try {
    await fs.writeFile(
      "./results/sequential_userThatBoughtProduct_GraphQL.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("sequential_userThatBoughtProduct_GraphQL saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
  return "running benchmark sequential_userThatBoughtProduct_GraphQL";
};
//################################################## REST ##################################################
export const sequential_getUsers_REST = async () => {
  const results = {
    1: [],
    10: [],
    100: [],
    1000: [],
    10000: [],
    errors_1: [],
    errors_10: [],
    errors_100: [],
    errors_1000: [],
    errors_10000: [],
  };
  for (let z = 0; z < 5; z++) {
    for (let i = 0; i < nIterations.length; i++) {
      let errors = 0;
      let time = Date.now();
      for (let j = 0; j < nIterations[i]; j++) {
        console.log(
          `Iteration: ${z} - nIterations: ${nIterations[i]} - j: ${j}`
        );
        const headers = {
          "content-type": "application/json",
        };
        try {
          const response = await axios({
            url: "http://localhost:8082/users",
            method: "get",
            headers: headers,
          });
        } catch (err) {
          errors++;
        }
      }
      results[nIterations[i]].push(Date.now() - time);
      results[`errors_${nIterations[i]}`].push(errors);
    }
  }
  try {
    await fs.writeFile(
      "./results/sequential_getUsers_REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("sequential_getUsers_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
  return "running benchmark sequential_getUsers_REST";
};

export const sequential_createProduct_REST = async () => {
  let product = {
    name: "V15 Gen 2",
    description: "'15.60 \", Intel Core i3-1115G4, 8 Go, 256 Go, CH'",
    type: "Ordinateur portable",
    averageRating: 4,
    price: 599,
    quantity: 10,
    images: [
      "https://static.digitecgalaxus.ch/Files/5/2/0/9/4/0/7/7/dfbcfa48-2952-4a94-a27f-0ed09c3312ea.jpg",
      "https://static.digitecgalaxus.ch/Files/5/2/0/9/4/0/7/8/95763f79-aa6e-426d-8f5e-fedb7fc31ba1.jpg",
      "https://static.digitecgalaxus.ch/Files/5/2/0/9/4/0/7/9/9e565b50-f254-44e8-b475-ab142c2c84f5.jpg",
      "https://static.digitecgalaxus.ch/Files/5/2/0/9/4/0/8/0/Lenovo_V15_G2_ITL_CT2_02.jpeg",
    ],
  };

  const results = {
    1: [],
    10: [],
    100: [],
    1000: [],
    10000: [],
    errors_1: [],
    errors_10: [],
    errors_100: [],
    errors_1000: [],
    errors_10000: [],
  };
  for (let z = 0; z < 50; z++) {
    for (let i = 0; i < nIterations.length; i++) {
      let errors = 0;
      let time = Date.now();
      for (let j = 0; j < nIterations[i]; j++) {
        console.log(
          `Iteration: ${z} - nIterations: ${nIterations[i]} - j: ${j}`
        );
        const headers = {
          "content-type": "application/json",
        };
        try {
          const response = await axios({
            url: "http://localhost:8084/product",
            method: "post",
            headers: headers,
            data: product,
          });
        } catch (err) {
          console.log(err);
          errors++;
        }
      }
      results[nIterations[i]].push(Date.now() - time);
      results[`errors_${nIterations[i]}`].push(errors);
    }
  }
  try {
    await fs.writeFile(
      "./results/sequential_createProduct_REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("sequential_createProduct_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
  return "running benchmark sequential_createProduct_REST";
};

export const getProductBoughtByUser_REST = async () => {
  try {
    const ordersResponse = await axios.get(`http://localhost:8083/orders`);
    const orders = ordersResponse.data;

    const productsResponse = await axios.get(`http://localhost:8084/products`);
    const products = productsResponse.data;

    const usersResponse = await axios.get(`http://localhost:8082/users`);
    const users = usersResponse.data;

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

export const sequential_getProductBoughtByUser_REST = async () => {
  const results = {
    1: [],
    10: [],
    100: [],
    1000: [],
    10000: [],
    errors_1: [],
    errors_10: [],
    errors_100: [],
    errors_1000: [],
    errors_10000: [],
  };
  for (let z = 0; z < 3; z++) {
    for (let i = 0; i < nIterations.length; i++) {
      let errors = 0;
      let time = Date.now();
      for (let j = 0; j < nIterations[i]; j++) {
        console.log(
          `Iteration: ${z} - nIterations: ${nIterations[i]} - j: ${j}`
        );
        const headers = {
          "content-type": "application/json",
        };
        try {
          const response = await getProductBoughtByUser_REST();
        } catch (err) {
          console.log(err);
          errors++;
        }
      }
      results[nIterations[i]].push(Date.now() - time);
      results[`errors_${nIterations[i]}`].push(errors);
    }
  }
  try {
    await fs.writeFile(
      "./results/sequential_userThatBoughtProduct_REST.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("sequential_userThatBoughtProduct_REST saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
  return "running benchmark sequential_userThatBoughtProduct_REST";
};
