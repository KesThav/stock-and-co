import "./functions/winston-workaround.js";
import express, { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";
import schema from "./schema/schema.js";
import { graphqlHTTP } from "express-graphql";
import data from "./data/fake_data.js";
import { getLogs, register } from "./functions/functions.js";
import { subscriptions } from "./functions/subcriptions.js";
import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
import { getAllUsers, getUser } from "./functions/functions.js";

export const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

const db_url =
  "mongodb://root:password@mongo-user-microservice:9000/users?authSource=admin";
//process.env.user_db_url;

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
  baseUrl: "http://camunda:8080/engine-rest",
  use: logger,
  asyncResponseTimeout: 10000,
};

const client = new Client(config);

subscriptions(client);

app.get("/userrelated", async (req, res) => {
  const rep = await getUserTasksAndRelatedOrder();
  res.send(rep);
});

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

app.get("/users", async (req, res) => {
  const rep = await getAllUsers();
  res.send(rep);
});

app.get(`/users/:userid`, async (req, res) => {
  const rep = await getUser(req.params.userid);
  res.send(rep);
});

const port = process.env.USER_PORT;

app.listen(port, async () => {
  console.log(`User-microservice listening at http://localhost:${port}`);
  await load_users();
});
