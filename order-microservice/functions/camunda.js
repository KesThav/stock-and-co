import axios from "axios";
import logs from "../functions/logger.js";
import Order from "../model/order.model.js";

//all the functions to start camunda with axios
const escapeJSON = (obj) => {
  return JSON.stringify(obj)
    .replace(/[\\]/g, "")
    .replace(/[\"]/g, '"')
    .replace(/[\/]/g, "/")
    .replace(/[\b]/g, "\b")
    .replace(/[\f]/g, "\f")
    .replace(/[\n]/g, "\n")
    .replace(/[\r]/g, "\r")
    .replace(/[\t]/g, "\t");
};

export const startInstance = async (data) => {
  const { userid, order, ptype, orderid, discount } = data;

  if (!userid || !order || !ptype || !orderid || discount == null) {
    throw new Error("Missing data !");
  }

  try {
    if (ptype !== "Card" && ptype !== "Point") {
      throw new Error("Ptype must be either Card or Point !");
    }

    const variables = {
      variables: {
        orderid: {
          value: orderid,
        },
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
        discount: {
          value: discount,
        },
      },
    };

    const headers = {
      "content-type": "application/json",
    };

    const response = await axios.post(
      "http://camunda:8080/engine-rest/process-definition/key/order-process/start",
      variables,
      headers
    );
    logs.log("info", `Order instance started.`);
  } catch (err) {
    logs.log("error", `Error when starting order instance : ${err}`);
  }
  return "Process started !";
};

const mapTask = async (task) => {
  const taskid = await Promise.all(
    task.map(async (task) => {
      const { id } = task;
      const res = await axios.get(
        `http://camunda:8080/engine-rest/task/${id}/variables`
      );
      return { taskid: id, orderid: res.data.orderid.value };
    })
  );
  return taskid;
};

export const getUserTasksAndRelatedOrders = async () => {
  const response = await axios.get("http://camunda:8080/engine-rest/task");
  const result = await mapTask(response.data);
  for (let i = 0; i < result.length; i++) {
    const { orderid } = result[i];
    const order = await Order.findOne({ orderid: orderid });
    result[i].order = order;
  }
  return result;
};

export const completeTask = async (taskid) => {
  try {
    const response = await axios.post(
      `http://camunda:8080/engine-rest/task/${taskid}/complete`,
      {}
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
