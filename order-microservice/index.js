import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";
import { load_orders, validate_orders } from "./load_orders.js";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema.js";
import { subscriptions } from "./functions/subcriptions.js";
import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
import { getProductOrders, getAllOrders } from "./functions/functions.js";

export const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

const db_url =
  "mongodb://root:password@mongo-order-microservice:9002/orders?authSource=admin";
//process.env.order_db_url;

Mongoose.connect(
  db_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to mongo-order-microservice !")
);

app.get("/", (req, res) => {
  res.send("Welcome from order !");
});

//camund config
const config = {
  baseUrl: "http://camunda:8080/engine-rest",
  use: logger,
  asyncResponseTimeout: 10000,
};

const client = new Client(config);

//all listeners are in this function
subscriptions(client);

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

app.get(`/orders/products/:productid`, async (req, res) => {
  const orders = await getProductOrders(req.params.productid);
  res.send(orders);
});

app.get("/orders", async (req, res) => {
  const orders = await getAllOrders();
  res.send(orders);
});

const port = process.env.ORDER_PORT;

app.listen(port, async () => {
  console.log(`Order-microservice listening at http://localhost:${port}`);
  load_orders();
});
