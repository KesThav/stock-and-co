import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import User from "../model/user.model.js";
import logs from "./logger.js";

export const subscriptions = (client) => {
  //verify balance
  client.subscribe("with_point", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      logs.log("info", `listening to with_point of User ${order.userid}`);
      let oneUser = await User.findOne({ _id: order.userid });
      const localVariable = new Variables();
      if (oneUser.points >= order.total) {
        localVariable.set("enough_point", true);
        logs.log("info", `User ${oneUser._id} has enough point.`, {
          user: order.userid,
        });
        await taskService.complete(task, localVariable);
      } else {
        localVariable.set("enough_point", false);
        logs.log(
          "info",
          `User ${oneUser._id} don't have enough point. Process ends.`,
          { user: order.userid }
        );
        await taskService.complete(task, localVariable);
      }
    } catch (err) {
      logs.log("error", `with_point : ${err}`);
    }
  });

  //update balance
  client.subscribe("with_card", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      logs.log("info", `listening to with_card of User ${order.userid}`);
      logs.log("info", `with_card of User ${order.userid} is complete.`);
      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `with_card : ${err}`);
    }
  });

  client.subscribe("collect_payment", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      logs.log("info", `listening to collect_payment of User ${order.userid}`);
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser && order.type === "Point") {
        oneUser.points -= order.total;
        await oneUser.save();
        logs.log("info", `Payment of User ${oneUser._id} has been collected.`);
      }

      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `collect_payment : ${err}`);
    }
  });

  client.subscribe("update_point", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      logs.log("info", `listening to update_points of User ${order.userid}`);
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser) {
        const newPoints = Math.floor(order.total / 100);
        oneUser.points += newPoints;
        await oneUser.save();
        logs.log(
          "info",
          `Point of User ${oneUser._id} has been updated by ${newPoints}.`
        );
      }
      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `update_point ${err}`);
    }
  });
};
