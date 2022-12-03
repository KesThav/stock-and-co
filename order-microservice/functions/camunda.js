import axios from "axios";
import logs from "../functions/logger.js";

//all the functions to start camunda with axios
const escapeJSON = (obj) => {
  return JSON.stringify(obj)
    .replace(/[\\]/g, "\\")
    .replace(/[\"]/g, '"')
    .replace(/[\/]/g, "/")
    .replace(/[\b]/g, "\b")
    .replace(/[\f]/g, "\f")
    .replace(/[\n]/g, "\n")
    .replace(/[\r]/g, "\r")
    .replace(/[\t]/g, "\t");
};

export const startInstance = async (data) => {
  const { userid, order, ptype } = data;

  try {
    if (ptype !== "Card" && ptype !== "Point") {
      throw new Error("Ptype must be either Card or Point !");
    }

    const variables = {
      variables: {
        userid: {
          value: userid,
        },
        ptype: {
          value: ptype,
        },
        order: {
          value: escapeJSON(order),
          type: "json",
        },
      },
    };

    const headers = {
      "content-type": "application/json",
    };

    console.log(variables);

    await axios.post(
      "http://localhost:8080/engine-rest/process-definition/key/order-process/start",
      variables
    );
    logs.log("info", `Order instance started.`);
  } catch (err) {
    logs.log("error", `Error when starting order instance : ${err}`);
  }
  return "Process started !";
};
