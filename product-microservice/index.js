import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";
import data from "./data/fake_data.js";
import Product from "./model/product.model.js";
import schema from "./schema/schema.js";
import { graphqlHTTP } from "express-graphql";
import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
import logs from "./functions/logger.js";
import { subscriptions } from "./functions/subscriptions.js";

export const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

const db_url =
  "mongodb://root:password@mongo-product-microservice:9004/products?authSource=admin";
//process.env.product_db_url;

Mongoose.connect(
  db_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to mongo-product-microservice !")
);

app.get("/", (req, res) => {
  res.send("Welcome from product !");
});

const load_database = async () => {
  console.log("Loading data...");
  for (let i = 0; i < data.length; i++) {
    const newProduct = new Product({
      ...data[i],
      quantity: Math.floor(Math.random() * 100) + 1,
    });

    await newProduct.save();
  }
  console.log("Data loaded !");
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

const config = {
  baseUrl: "http://camunda:8080/engine-rest",
  use: logger,
  asyncResponseTimeout: 10000,
};

const client = new Client(config);

subscriptions(client);

const port = process.env.PRODUCT_PORT;

app.listen(port, async () => {
  console.log(`Product-microservice listening at http://localhost:${port}`);
  await load_database();
});
