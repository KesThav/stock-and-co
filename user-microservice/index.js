import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";
import User from "./model/user.model.js";
import schema from "./schema/schema.js";
import { graphqlHTTP } from "express-graphql";

export const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

const db_url =
  "mongodb://root:password@mongo-user-microservice:9000/users?authSource=admin";

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
const port = process.env.PORT || 8082;

app.listen(port, () =>
  console.log(`User-microservice listening at http://localhost:${port}`)
);
