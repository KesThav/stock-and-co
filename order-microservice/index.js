import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";

export const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

const db_url =
  "mongodb://root:password@mongo-order-microservice:9002/orders?authSource=admin";

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

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8083;

app.listen(port, () =>
  console.log(`Order-microservice listening at http://localhost:${port}`)
);
