import express from "express";
import { signUpUser, loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllBlogsBySpecificUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send({ message: "User router" });
});

userRouter.post("/register", upload.single("profilePic"), signUpUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile/:id", getAllBlogsBySpecificUser);

export { userRouter };
