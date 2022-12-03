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
    points: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default Mongoose.model("User", userSchema);
