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
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `Create order | ${orderid} | Step 3 | Creating User ${order.userid} order.`
      );
      order.status = "Paid";
      order.type = task.variables.get("ptype");
      const newOrder = await createOrder(order);
      const localVariable = new Variables();
      localVariable.set("order", newOrder);
      logs.log(
        "info",
        `Create order | ${orderid} | Step 3 | User ${newOrder.userid} order created with id ${newOrder._id} and status Paid.`
      );
      await taskService.complete(task, localVariable);
    } catch (err) {
      console.log("error", `Create order | Order ${orderid} | ${err}`);
    }
  });

  //update order
  client.subscribe("update_order", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `Update order | ${orderid} | Step 5 | Updating User ${order.userid} order ${order.orderid} status.`
      );

      let oneOrder = await Order.findOne({
        _id: order._id,
      });
      if (oneOrder) {
        oneOrder.status = "Closed";
        await oneOrder.save();
        logs.log(
          "info",
          `Update order | ${orderid} | Step 5 | User ${oneOrder.userid} order ${oneOrder.orderid} updated with status Closed.`
        );
        await taskService.complete(task);
      }
    } catch (err) {
      console.log("error", `Update order | Order ${orderid} | ${err}`);
    }
  });
};
