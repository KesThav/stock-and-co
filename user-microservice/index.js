import "./functions/winston-workaround.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";
import schema from "./schema/schema.js";
import { graphqlHTTP } from "express-graphql";
import data from "./data/fake_data.js";
import { register } from "./functions/functions.js";
import { subscriptions } from "./functions/subcriptions.js";
import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
import logs from "./functions/logger.js";
import { mapLogs } from "./functions/functions.js";

export const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

const db_url =
  //"mongodb://root:password@mongo-user-microservice:9000/users?authSource=admin";
  process.env.user_db_url;

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

app.get("/logs", async (req, res) => {
  /*const mappedLogs = await new Promise((success, failure) => {
    const options = {
      order: "desc",
      fields: ["level", "message", "timestamp"],
    };

    logs.query(options, async function (err, results) {
      if (err) {
        failure(err);
      } else {
        const mappedLogs = mapLogs(results);
        success(mappedLogs);
      }
    });
  });
  res.send(mappedLogs);*/
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
const port = process.env.USER_PORT;

app.listen(port, async () => {
  console.log(`User-microservice listening at http://localhost:${port}`);
  //await load_users();
});
