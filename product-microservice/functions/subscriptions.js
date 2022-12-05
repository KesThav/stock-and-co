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
          `Update product quantity | Listening to update_product_quantity`
        );
        for (let i = 0; i < order.products.length; i++) {
          let oneProduct = await Product.findOne({
            _id: order.products[i].productid,
          });
          if (oneProduct) {
            oneProduct.quantity -= order.products[i].quantity;
            await oneProduct.save();
          }
        }
        logs.log("info", `Update product quantity | Update ends.`);
        await taskService.complete(task);
      } catch (err) {
        logs.logs("error", `Update product quantity | ${err}`);
      }
    }
  );
};
