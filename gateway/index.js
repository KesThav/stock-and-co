import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import proxy from "express-http-proxy";

const app = express();

const corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/user", proxy("http://user-microservice:8082"));
app.use("/order", proxy("http://order-microservice:8083"));
app.use("/product", proxy("http://product-microservice:8084"));

const port = process.env.PORT || 8085;

app.listen(port, () =>
  console.log(`Gateway listening at http://localhost:${port}`)
);
