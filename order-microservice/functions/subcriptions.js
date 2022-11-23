import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import Order from "../model/order.model.js";

export const subscriptions = (client) => {
  client.subscribe("create_order", async function ({ task, taskService }) {
    console.log("listening to create_order");
    const order = task.variables.get("order");

    try {
      let newOrder = {};
      newOrder["userid"] = order.userid;
      newOrder["total"] = order.total;
      newOrder["status"] = "Paid";
      newOrder["products"] = order.products;

      newOrder = new Order(newOrder);
      await newOrder.save();
      const localVariable = new Variables();
      localVariable.set("orderid", newOrder._id);
    } catch (err) {
      console.log(err);
    }

    await taskService.complete(task);
  });

  client.subscribe("update_order", async function ({ task, taskService }) {
    console.log("listening to update_order");
    console.log(task.variables.getAll());

    let oneOrder = await Order.findOne({
      _id: task.variables.get("orderid"),
    });
    if (oneOrder) {
      oneOrder.status = "Closed";
      await oneOrder.save();
    }

    await taskService.complete(task);
  });
};
