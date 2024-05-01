import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateJwtToken } from "../utils/generateToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Blog } from "../models/blog.model.js";
import { mongoose } from "mongoose";

async function signUpUser(req, res) {
  try {
    const { username, email, password, followers, following } = JSON.parse(
      req.body.json
    );
    const profilePic = req.file;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ status: false, message: "User already exists" });
    }
    if (!profilePic)
      return res.send({ status: false, message: "Profile pic not found" });

    const result = await uploadOnCloudinary(profilePic.path);
    if (result == null) {
      return res.send({
        status: false,
        message: "Not able to upload profile pic on server",
      });
    }
    if (password.length < 6) {
      return res.send({
        status: false,
        message: "Password should be at least 6 characters long",
      });
    }
    const user = await User.create({
      username: username,
      email: email,
      password: password,
      followers: followers,
      following: following,
      profilePic: result.url,
      bookmarks: [],
    });
    return res.status(201).send({
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
      bookmarks: user.bookmarks,
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

async function getUserModel(req, res){
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.send({
        status: false,
        message: "User does not exist",
      });
    }
    return res.send({ status: true, user: user });
  } catch (error) {
    return res.send({ status: false, message: error });
  }
}

async function getAllBlogsBySpecificUser(req, res) {
  try {
    const userId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(userId);
    const blogs = await Blog.find({ createdBy: objectId }).populate(
      "createdBy"
    );
    if (!blogs) {
      return res.send({
        status: false,
        message: "No blogs found for this user",
      });
    }
    return res.send({ status: true, blogs: blogs });
  } catch (error) {
    return res.send({ status: false, message: error });
  }
}

async function getAllBookmarkBlogs(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("bookmarks");
    for (const blog of user.bookmarks) {
      await blog.populate("createdBy");
    }
    if (!user) {
      return res.send({
        status: false,
        message: "No bookmarks found",
      });
    }

    return res.send({ status: true, bookmarks: user.bookmarks });
  } catch (error) {
    return res.send({
      status: false,
      message: error,
    });
  }
}

export {
  signUpUser,
  loginUser,
  getAllBlogsBySpecificUser,
  getAllBookmarkBlogs,
  getUserModel
};
