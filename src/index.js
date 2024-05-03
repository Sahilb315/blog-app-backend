import express from "express";
import { userRouter } from "./routers/user.router.js";
import { connectDB } from "./db/connect.db.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { blogRouter } from "./routers/blog.router.js";

const app = express();
dotenv.config();

cloudinary.config({
  cloud_name: "sahil9181",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at http://localhost:3000");
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});
