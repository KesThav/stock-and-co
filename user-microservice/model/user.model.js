import Mongoose from "mongoose";

const userSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
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

export default Mongoose.model("User", userSchema);
