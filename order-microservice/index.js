import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";
import load_orders from "./load_orders.js";
import { graphqlHTTP } from "express-graphql";
import schema from "./schema/schema.js";
import { subscriptions } from "./functions/subcriptions.js";
import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;

export const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

const db_url =
  //"mongodb://root:password@mongo-order-microservice:9002/orders?authSource=admin";
  "mongodb+srv://kesigan:kesi1996@cluster0.hycty.gcp.mongodb.net/stock-and-co-orders";

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
  baseUrl: "http://127.0.0.1:8080/engine-rest",
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

const port = process.env.PORT || 8083;

app.listen(port, async () => {
  console.log(`Order-microservice listening at http://localhost:${port}`);
  //load_orders();
});
