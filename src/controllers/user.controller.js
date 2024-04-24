import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "../utils/generateToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

async function signUpUser(req, res) {
  try {
    const { username, email, password, followers, following } = JSON.parse(req.body.json);
    const profilePic = req.file;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ status: false, message: "User already exists" });
    }
    if(!profilePic) return res.send({status: false, message: "Profile pic not found"});
    console.log(profilePic);

    const result = await uploadOnCloudinary(req.file.path);
    if(result == null){
      return res.send({status: false, message: "Profile pic not uploaded to cloudinary"});
    }
    const user = await User.create({
      username: username,
      email: email,
      password: password,
      followers: followers,
      following: following,
      profilePic: result.url,
    });
    res.status(201).send({
      status: true,
      user: user,
    });
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.send({ status: false, message: "User not found" });

    /// Check if the passowrd is similar to the password in the database
    /// The user's password is sent & compared with the hashed password in the database
    const isMatch = await user.comparePassword(password);
    if (isMatch === false)
      return res.send({ status: false, message: "Invalid password" });

    let tokenData = {
      _id: user._id,
      profilePic: user.profilePic,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
    };

    var token = await generateJwtToken(
      tokenData,
      process.env.JWT_SECRET_KET,
      "30d"
    );

    res.status(200).send({
      status: true,
      token: token,
    });
  } catch (error) {
    console.log("Error while logging in", error);
  }
}

export { signUpUser, loginUser };
