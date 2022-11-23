import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import User from "../model/user.model.js";

export const subscriptions = (client) => {
  //verify balance
  client.subscribe("verify_balance", async function ({ task, taskService }) {
    console.log("listening to verify_balance");
    let order = task.variables.get("order");
    let oneUser = await User.findOne({ _id: order.userid });
    const localVariable = new Variables();
    if (oneUser.balance >= order.total) {
      localVariable.set("enough_balance", true);
    } else {
      localVariable.set("enough_balance", false);
    }

    await taskService.complete(task, localVariable);
  });

  //update balance
  client.subscribe("update_balance", async function ({ task, taskService }) {
    console.log("listening to update_balance");
    const order = task.variables.get("order");
    const oneUser = await User.findOne({ _id: order.userid });
    oneUser.balance += task.variables.get("balance");
    await oneUser.save();
    await taskService.complete(task);
  });

  client.subscribe("collect_payment", async function ({ task, taskService }) {
    console.log("listening to collect_payment");
    const order = task.variables.get("order");
    const oneUser = await User.findOne({ _id: order.userid });
    if (oneUser) {
      oneUser.balance -= order.total;
      await oneUser.save();
    }

    await taskService.complete(task);
  });
};
