import Mongoose from "mongoose";

const productSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    productsBought: [
      {
        _id: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

export default Mongoose.model("Product", productSchema);
