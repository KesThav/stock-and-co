import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import Order from "../model/order.model.js";
import { createOrder } from "./functions.js";
import logs from "./logger.js";

export const subscriptions = (client) => {
  //create order
  client.subscribe("create_order", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      logs.log("info", `listening to create_order of User ${order.userid}`);
      order.status = "Paid";
      order.type = task.variables.get("ptype");
      const newOrder = await createOrder(order);
      const localVariable = new Variables();
      localVariable.set("order", newOrder);
      logs.log(
        "info",
        `User ${newOrder.userid} order has been created with id ${newOrder._id} and status Paid.`
      );
      await taskService.complete(task, localVariable);
    } catch (err) {
      logs.log("error", `create_order : ${err}`);
    }
  });

  //update order
  client.subscribe("update_order", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      logs.log(
        "info",
        `listening to update_order of User ${order.userid} for Order ${order._id}`
      );

      let oneOrder = await Order.findOne({
        _id: order._id,
      });
      if (oneOrder) {
        oneOrder.status = "Closed";
        await oneOrder.save();
        logs.log(
          "info",
          `User ${oneOrder.userid} order ${oneOrder._id} has been updated with status Closed`
        );
        await taskService.complete(task);
      }
    } catch (err) {
      logs.log("error", `update_order : ${err}`);
    }
  });
};
