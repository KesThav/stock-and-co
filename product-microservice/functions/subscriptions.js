import camundaPkg from "camunda-external-task-client-js";
const { Client, logger, Variables } = camundaPkg;
import Product from "../model/product.model.js";
import logs from "./logger.js";

export const subscriptions = (client) => {
  client.subscribe(
    "update_product_quantity",
    async function ({ task, taskService }) {
      try {
        let order = task.variables.get("order");
        logs.log(
          "info",
          `listening to update_product_quantity of User ${order.userid}`
        );
        for (let i = 0; i < order.products.length; i++) {
          console.log(order.products[i].productid);
          let oneProduct = await Product.findOne({
            _id: order.products[i].productid,
          });
          if (oneProduct) {
            oneProduct.quantity -= order.products[i].quantity;
            await oneProduct.save();
          }
        }
        console.log("done");
        await taskService.complete(task);
      } catch (err) {
        logs.logs("error", `update_product_quantity : ${err}`);
      }
    }
  );
};
