import express from "express";
import { signUpUser, loginUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send({ message: "User router" });
});

userRouter.post("/register", signUpUser);
userRouter.post("/login", loginUser);

export { userRouter };
