import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";

export const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

const db_url =
  "mongodb://root:password@mongo-product-microservice:9004/?authSource=admin";

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

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8084;

app.listen(port, () =>
  console.log(`Product-microservice listening at http://localhost:${port}`)
);
