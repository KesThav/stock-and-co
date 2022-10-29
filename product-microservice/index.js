import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

export const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8084;

app.listen(port, () =>
  console.log(`Product-microservice listening at http://localhost:${port}`)
);
