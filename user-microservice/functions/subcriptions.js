import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import User from "../model/user.model.js";
import logs from "./logger.js";

export const subscriptions = (client) => {
  //verify balance
  client.subscribe("with_point", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `Payment with point | ${orderid} | Step 1 | Reading User ${order.userid} points.`
      );
      let oneUser = await User.findOne({ _id: order.userid });
      const localVariable = new Variables();
      let amount = order.products.reduce(
        (total, prod) => total + prod.price * prod.quantity,
        0
      );
      if (oneUser.points >= amount) {
        localVariable.set("enough_point", true);
        localVariable.set("total", amount);
        logs.log(
          "info",
          `Payment with point | ${orderid} | Step 1 | User ${oneUser._id} has enough point.`,
          {
            user: order.userid,
          }
        );
        await taskService.complete(task, localVariable);
      } else {
        localVariable.set("enough_point", false);
        logs.log(
          "info",
          `Payment with point | ${orderid} | Step 1 | User ${oneUser._id} don't have enough point. Process ends.`,
          { user: order.userid }
        );
        await taskService.complete(task, localVariable);
      }
    } catch (err) {
      console.log("error", `Payment with point | ${err}`);
    }
  });

  //update balance
  client.subscribe("with_card", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `Payment with card | ${orderid} | Step 1 | Reading User ${order.userid} card.`
      );
      logs.log(
        "info",
        `Payment with card | ${orderid} | Step 1 | User ${order.userid} card is accepted.`
      );
      await taskService.complete(task);
    } catch (err) {
      console.log("error", `Payment with card | ${err}`);
    }
  });

  client.subscribe("collect_payment", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      const ptype = task.variables.get("ptype");
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `Collect payment | ${orderid} | Step 2 | Validating payment of User ${order.userid}.`
      );
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser && ptype == "Point") {
        oneUser.points -= task.variables.get("total");
        await oneUser.save();
        logs.log(
          "info",
          `Collect payment | ${orderid} | Step 2 | Payment of User ${oneUser._id} collected.`
        );
      }

      await taskService.complete(task);
    } catch (err) {
      console.log("error", `Collect payment | ${err}`);
    }
  });

  client.subscribe("update_point", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `Update points | ${orderid} | Step 4 | Updating User ${order.userid} points.`
      );
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser) {
        const newPoints = Math.floor(order.total / 100);
        oneUser.points += newPoints;
        await oneUser.save();
        logs.log(
          "info",
          `Update points | ${orderid} | Step 4 | User ${oneUser._id} has gained by ${newPoints} points.`
        );
      }
      await taskService.complete(task);
    } catch (err) {
      console.log("error", `Update points | ${err}`);
    }
  });
};
