import axios from "axios";
import fs from "fs";

const nIterations = [1, 10, 100, 1000, 10000];

export const b_getUsers = async () => {
  const usersQuery = {
    query: `query {
      users {
        name
        email
        points
        _id
      }
    }`,
    variables: {},
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
        const response = await axios({
          url: "http://localhost:8082/graphql",
          method: "post",
          headers: headers,
          data: usersQuery,
        });
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
      "./results/b_getUsers.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("b_getUsers saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
  return "running benchmark b_getUsers";
};

export const b_createProduct = async () => {
  let createProductMutation = {
    query: `mutation addProduct($name:String!,$description:String!,$type:String!,$averageRating:Int, $quantity:Int!,$price:Float!,$images:[String]) {
    addProduct(name:$name,description:$description,type:$type,averageRating:$averageRating,quantity:$quantity,price:$price,images:$images) {
      name
      description
      type
      averageRating
      quantity
      price
      images {
        url
      }
    }
  }`,
    variables: {
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
    },
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
        const response = await axios({
          url: "http://localhost:8084/graphql",
          method: "post",
          headers: headers,
          data: createProductMutation,
        });
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
      "./results/b_createProduct.json",
      JSON.stringify(results),
      (err) => {
        if (err) throw err;
        console.log("b_createProduct saved to file");
      }
    );
  } catch (err) {
    console.log(err);
  }
  return "running benchmark b_createProduct";
};

export const b_startOrder = async () => {
}
