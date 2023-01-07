import Order from "../model/order.model.js";

export const getAllOrders = async () => {
  const allOrders = await Order.find({}).sort({
    createdAt: -1,
  });

  return allOrders;
};

export const getOrder = async (_id) => {
  console.log(_id);
  const oneOrder = await Order.findOne({ orderid: _id });

  if (!oneOrder) throw new Error("Order not found !");

  return oneOrder;
};

export const createOrder = async (data) => {
  if (data.products.length === 0)
    throw new Error("Product list can not be empty");

  let amount = data.products.reduce(
    (total, prod) => total + prod.price * prod.quantity,
    0
  );

  let newOrder = {};
  newOrder["orderid"] = data.orderid;
  newOrder["userid"] = data.userid;
  newOrder["total"] = amount;
  newOrder.products = Array.from(data.products);
  newOrder.status = data.status;
  newOrder.type = data.type;
  newOrder.discount = data.discount;

  newOrder = new Order(newOrder);

  await newOrder.save();

  return newOrder;
};

export const updateOrderStatus = async (_id, status) => {
  const oneOrder = Order.findOneAndUpdate(
    { _id: _id },
    { status: status },
    { new: true }
  );

  return oneOrder;
};

export const getUserOrders = async (userid) => {
  const userOrders = await Order.find({ userid: userid }).sort({
    createdAt: -1,
  });

  return userOrders;
};

export const getProductOrders = async (productid) => {
  const productOrders = await Order.find({
    products: { $elemMatch: { productid: productid } },
  });

  return productOrders;
};
