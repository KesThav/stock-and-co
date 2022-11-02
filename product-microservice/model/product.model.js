import Mongoose from "mongoose";

const productSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
    },
    averageRating: {
      type: Number,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    images: [
      {
        url: {
          type: String,
        },
        height: {
          type: Number,
        },
        width: {
          type: Number,
        },
        __typename: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export default Mongoose.model("Product", productSchema);
