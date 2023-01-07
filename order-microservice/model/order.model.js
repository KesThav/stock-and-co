import Mongoose from "mongoose";

const orderSchema = new Mongoose.Schema(
  {
    orderid: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    products: [
      {
        productid: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    type: {
      type: String,
      require: true,
    },
    total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default Mongoose.model("Order", orderSchema);
