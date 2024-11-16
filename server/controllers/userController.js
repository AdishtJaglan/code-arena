import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const Register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const check = await User.findOne({ username });

    if (check) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      password,
    });

    return res
      .status(201)
      .json({ message: "User created successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user.", error });
  }
};

export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }); 

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, "lolsecret", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const ProtectRoute = (req, res) => {
  res.json({
    message: `Hello, ${req.user.username}. This is protected data.`,
  });
};
