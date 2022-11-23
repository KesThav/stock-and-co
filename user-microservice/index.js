import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";
import schema from "./schema/schema.js";
import { graphqlHTTP } from "express-graphql";
import data from "./data/fake_data.js";
import { register } from "./functions/functions.js";
import dotenv from "dotenv";
import { subscriptions } from "./functions/subcriptions.js";
import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;

dotenv.config();

export const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

const db_url =
  //"mongodb://root:password@mongo-user-microservice:9000/users?authSource=admin";
  "mongodb+srv://kesigan:kesi1996@cluster0.hycty.gcp.mongodb.net/stock-and-co-users";
Mongoose.connect(
  db_url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Connected to mongo-user-microservice")
);

app.get("/", (req, res) => {
  res.send("Welcome from user !");
});

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
  baseUrl: "http://127.0.0.1:8080/engine-rest",
  use: logger,
  asyncResponseTimeout: 10000,
};

const client = new Client(config);

subscriptions(client);

const load_users = async () => {
  console.log("Loading users...");
  for (let i = 0; i < data.length; i++) {
    try {
      await register(data[i]);
    } catch (err) {
      throw new Error(err);
    }
  }
  console.log("User loaded !");
};
const port = process.env.PORT || 8082;

app.listen(port, async () => {
  console.log(`User-microservice listening at http://localhost:${port}`);
  //await load_users();
});
