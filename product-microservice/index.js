import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Mongoose from "mongoose";
import data from "./data/fake_data.js";
import Product from "./model/product.model.js";
import schema from "./schema/schema.js";
import { graphqlHTTP } from "express-graphql";

export const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

const db_url =
  //"mongodb://root:password@mongo-product-microservice:9004/products?authSource=admin";
  "mongodb+srv://kesigan:kesi1996@cluster0.hycty.gcp.mongodb.net/?retryWrites=true&w=majority";

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

const port = process.env.PORT || 8084;

app.listen(port, async () => {
  console.log(`Product-microservice listening at http://localhost:${port}`);
  //await load_database();
});
