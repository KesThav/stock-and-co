import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import User from "../model/user.model.js";
import logs from "./logger.js";

export const subscriptions = (client) => {
  //verify balance
  client.subscribe("with_point", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      logs.log(
        "info",
        `Payment with point | Listening to User ${order.userid}`,
        {
          key: "Payment with point",
        }
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
          `Payment with point | User ${oneUser._id} has enough point.`,
          {
            user: order.userid,
          }
        );
        await taskService.complete(task, localVariable);
      } else {
        localVariable.set("enough_point", false);
        logs.log(
          "info",
          `Payment with point | User ${oneUser._id} don't have enough point. Process ends.`,
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
    console.log(task.variables.getAll());
    try {
      let order = task.variables.get("order");
      logs.log("info", `Payment with card | Listening to User ${order.userid}`);
      logs.log(
        "info",
        `Payment with card | User ${order.userid} payment is complete.`
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
      logs.log("info", `Collect payment | Listening to User ${order.userid}`);
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser && ptype == "Point") {
        oneUser.points -= task.variables.get("total");
        await oneUser.save();
        logs.log(
          "info",
          `Collect payment | Payment of User ${oneUser._id} collected.`
        );
      }

      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `Collect payment |  ${err}`);
    }
  });

  client.subscribe("update_point", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      logs.log("info", `Update points | listening to User ${order.userid}`);
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser) {
        const newPoints = Math.floor(order.total / 100);
        oneUser.points += newPoints;
        await oneUser.save();
        logs.log(
          "info",
          `Update points | User ${oneUser._id} has gained by ${newPoints} points.`
        );
      }
      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `Update points | ${err}`);
    }
  });
};
