import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUser = async (_id) => {
  const oneUser = await User.findOne({ _id });
  return oneUser;
};

export const getAllUsers = async () => {
  const allUsers = await User.find();
  return allUsers;
};

const generate_token = (data) => {
  const token = jwt.sign(
    {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    },
    process.env.jwt_secret
  );

  return { token: token };
};

export const register = async (data) => {
  const { name, email, password, role, balance } = data;
  if (!email || !password) throw new Error("Invalid credentials !");

  const emailExist = await User.find({ email });

  if (emailExist && emailExist.length !== 0)
    throw new Error("Email already exist !");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    let newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      balance,
    });

    await newUser.save();

    const token = generate_token(newUser);

    return token;
  } catch (err) {
    throw new Error(err);
  }
};

export const login = async (data) => {
  const { email, password } = data;
  const currentUser = await User.findOne({ email });

  if (!currentUser) {
    throw new Error("User not found !");
  }

  if (currentUser && currentUser.length !== 0) {
    const validPass = bcrypt.compare(password, currentUser.password);
    if (!validPass) {
      throw new Error("Wrong credentials !");
    } else {
      const token = generate_token(currentUser);

      return token;
    }
  }
};
