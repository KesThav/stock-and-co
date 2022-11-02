import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import proxy from "express-http-proxy";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const bpmn = "./bpmn/";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const get_all_files = (path_) => {
  let tmp = [];
  fs.readdirSync(path.join(__dirname, path_)).forEach((file) => {
    tmp.push(path.join(__dirname, path_, file));
  });
  return tmp;
};

const read_file = async (files) => {
  const form = new FormData();
  for (let i = 0; i < files.length; i++) {
    form.append(i, fs.createReadStream(files[i]));
  }
  return form;
};

//delete all models deployed
const delete_bpmn_model = async () => {
  console.log("Getting all deployments...");
  try {
    const dep = await axios.get("http://camunda:8080/engine-rest/deployment");
    if (dep) {
      console.log("Deleting all current deployments...");
      for (let i = 0; i < dep.data.length; i++) {
        await axios.delete(
          `http://camunda:8080/engine-rest/deployment/${dep.data[i].id}?cascade=true`
        );
      }
      console.log("All deployments deleted !");
    }
  } catch (err) {
    console.log(err);
  }
};

//deploy bmnp model
const deploy_bpmn_model = async (path_) => {
  const data = get_all_files(path_);
  const form_data = await read_file(data);
  console.log("Loading models...");
  try {
    await axios.post(
      "http://camunda:8080/engine-rest/deployment/create",
      form_data,
      {
        headers: {
          "Content-Type": `multipart/form-data;boundary=${form_data._boundary}`,
        },
      }
    );
    console.log("Models loaded !");
  } catch (err) {
    console.log(err);
  }
};

const port = process.env.PORT || 8085;

app.listen(port, async () => {
  await delete_bpmn_model();
  await deploy_bpmn_model(bpmn);
  console.log(`Gateway listening at http://localhost:${port}`);
});
