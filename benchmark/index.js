import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import bodyParser from "body-parser";
import schema from "./schema/schema.js";
import {
  b_getUsers_REST,
  b_createProduct_REST,
  b_getProductBoughtByUser_REST,
} from "./functions/sequentialBenchmark.js";
import * as console from "console";
import fs from "fs";

const myLogger = new console.Console({
  stdout: fs.createWriteStream("normalStdout.txt"),
  stderr: fs.createWriteStream("errStdErr.txt"),
});

export const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.get("/benchmarks/users", async (req, res) => {
  const users = await b_getUsers_REST();
  res.send(users);
});

app.post("/benchmarks/product", async (req, res) => {
  const product = await b_createProduct_REST();
  res.send(product);
});

app.get("/benchmarks/products-users", async (req, res) => {
  const products = await b_getProductBoughtByUser_REST();
  res.send(products);
});

const port = 10000;
app.listen(port, async () => {
  console.log(`Benchmark listening at http://localhost:${port}`);
  //await prepareOrders();
});
