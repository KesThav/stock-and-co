import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import bodyParser from "body-parser";
import schema from "./schema/schema.js";
import {
  sequential_getUsers_REST,
  sequential_createProduct_REST,
  sequential_getProductBoughtByUser_REST,
  getProductBoughtByUser_REST,
} from "./functions/sequentialBenchmark.js";
import {
  concurrent_getUsers_REST,
  concurrent_createProduct_REST,
  concurrent_getProductBoughtByUser_REST,
} from "./functions/concurrentBenchmark.js";
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

app.get("/benchmarks/sequential/users", async (req, res) => {
  const users = await sequential_getUsers_REST();
  res.send(users);
});

app.post("/benchmarks/sequential/product", async (req, res) => {
  const product = await sequential_createProduct_REST();
  res.send(product);
});

app.get("/benchmarks/sequential/products-users", async (req, res) => {
  const products = await sequential_getProductBoughtByUser_REST();
  res.send(products);
});

app.get("/products-users", async (req, res) => {
  const productBoughtByUser = await getProductBoughtByUser_REST();
  res.send(productBoughtByUser);
});

app.get("/benchmarks/concurrent/users", async (req, res) => {
  const users = await concurrent_getUsers_REST();
  res.send(users);
});

app.get("/benchmarks/concurrrent/products-users", async (req, res) => {
  const productBoughtByUser = await concurrent_getProductBoughtByUser_REST();
  res.send(productBoughtByUser);
});

app.post("/benchmarks/concurrent/product", async (req, res) => {
  const product = await concurrent_createProduct_REST();
  res.send(product);
});

const port = 10000;
app.listen(port, async () => {
  console.log(`Benchmark listening at http://localhost:${port}`);
});
