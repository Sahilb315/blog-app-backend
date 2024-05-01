import express from "express";
import { signUpUser, loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllBlogsBySpecificUser, getAllBookmarkBlogs, getUserModel } from "../controllers/user.controller.js";
import { bookmarkBlog } from "../controllers/blog.controller.js";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send({ message: "User router" });
});

userRouter.post("/register", upload.single("profilePic"), signUpUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile/:id", getAllBlogsBySpecificUser);
userRouter.get("/:id", getUserModel);
userRouter.get("/bookmarks/:id", getAllBookmarkBlogs);
userRouter.patch("/profile", bookmarkBlog);

export { userRouter };
