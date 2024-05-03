import express from "express";
import {
  getAllBlogs,
  addNewBlog,
  getBlogById,
  deleteBlogById,
  bookmarkBlog
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const blogRouter = express.Router();

blogRouter
  .route("/")
  .get(getAllBlogs)
  .post(upload.single("thumbnail"), addNewBlog);

blogRouter
.route("/:id")
.patch(bookmarkBlog)
.delete(deleteBlogById)
.get(getBlogById);

export { blogRouter };
