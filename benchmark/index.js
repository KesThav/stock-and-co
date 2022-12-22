import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import bodyParser from "body-parser";
import schema from "./schema/schema.js";
import { prepareOrders } from "./functions/data_prepare.js";

export const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
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

const port = 10000;
app.listen(port, async () => {
  console.log(`Benchmark listening at http://localhost:${port}`);
  await prepareOrders();
});
