import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import User from "../model/user.model.js";
import logs from "./logger.js";

export const subscriptions = (client) => {
  //verify balance
  client.subscribe("verify_balance", async function ({ task, taskService }) {
    try {
      let order = task.variables.get("order");
      logs.log("info", `listening to verify_balance of User ${order.userid}`);
      let oneUser = await User.findOne({ _id: order.userid });
      const localVariable = new Variables();
      if (oneUser.balance >= order.total) {
        localVariable.set("enough_balance", true);
        logs.log("info", `User ${oneUser._id} has enough balance.`, {
          user: order.userid,
        });
        await taskService.complete(task, localVariable);
      } else {
        localVariable.set("enough_balance", false);
        logs.log(
          "info",
          `User ${oneUser._id} don't have enough balance. Need to update`,
          { user: order.userid }
        );
        await taskService.complete(task, localVariable);
      }
    } catch (err) {
      logs.log("error", `Verify_balance : ${err}`);
    }
  });

  //update balance
  client.subscribe("update_balance", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      logs.log("info", `listening to update_balance of User ${order.userid}`);
      const oneUser = await User.findOne({ _id: order.userid });
      oneUser.balance += task.variables.get("balance");
      await oneUser.save();
      logs.log("info", `User ${oneUser._id} balance has been updated.`);
      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `update_balance : ${err}`);
    }
  });

  client.subscribe("collect_payment", async function ({ task, taskService }) {
    try {
      const order = task.variables.get("order");
      logs.log("info", `listening to collect_payment of User ${order.userid}`);
      const oneUser = await User.findOne({ _id: order.userid });
      if (oneUser) {
        oneUser.balance -= order.total;
        await oneUser.save();
        logs.log("info", `Payment of User ${oneUser._id} has been collected.`);
      }

      await taskService.complete(task);
    } catch (err) {
      logs.log("error", `collect_payment : ${err}`);
    }
  });
};
