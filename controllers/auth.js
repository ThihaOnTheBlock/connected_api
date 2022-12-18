import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User doesn't exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentails" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const copyUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      email: user.email,
      password: user.password,
      picturePath: user.picturePath,
      friends: user.friends,
      viewedProfile: user.viewedProfile,
      impressions: user.impressions,
    };

    delete copyUser.password;

    res.status(200).json({ token, user: copyUser });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
