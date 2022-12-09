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
        `ID Payment with point | Order ${orderid} | Step 1 | Listening to User ${order.userid}`
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
          `ID Payment with point | Order ${orderid} | Step 1 | User ${oneUser._id} has enough point.`,
          {
            user: order.userid,
          }
        );
        await taskService.complete(task, localVariable);
      } else {
        localVariable.set("enough_point", false);
        logs.log(
          "info",
          `ID Payment with point | Order ${orderid} | Step 1 | User ${oneUser._id} don't have enough point. Process ends.`,
          { user: order.userid }
        );
        await taskService.complete(task, localVariable);
      }
    } catch (err) {
      logs.log("error", `Payment with point | ${err}`);
    }
  });

  //update balance
  client.subscribe("with_card", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `ID Payment with card | Order ${orderid} | Step 1 | Listening to User ${order.userid}`
      );
      logs.log(
        "info",
        `ID Payment with card | Order ${orderid} | Step 1 | User ${order.userid} payment is complete.`
      );
      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `Payment with card | ${err}`);
    }
  });

  client.subscribe("collect_payment", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      const ptype = task.variables.get("ptype");
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `ID Collect payment | Order ${orderid} | Step 2 | Listening to User ${order.userid}`
      );
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser && ptype == "Point") {
        oneUser.points -= task.variables.get("total");
        await oneUser.save();
        logs.log(
          "info",
          `ID Collect payment | Order ${orderid} | Step 2 | Payment of User ${oneUser._id} collected.`
        );
      }

      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `Collect payment | ${err}`);
    }
  });

  client.subscribe("update_point", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      const orderid = task.variables.get("orderid");
      logs.log(
        "info",
        `ID Update points | Order ${orderid} | Step 4 | listening to User ${order.userid}`
      );
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser) {
        const newPoints = Math.floor(order.total / 100);
        oneUser.points += newPoints;
        await oneUser.save();
        logs.log(
          "info",
          `ID Update points | Order ${orderid} | Step 4 | User ${oneUser._id} has gained by ${newPoints} points.`
        );
      }
      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `Update points | ${err}`);
    }
  });
};
