import { Blog } from "../models/blog.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.find({}).populate("createdBy");
    if (!blogs) {
      return res.send({ status: false, message: "Couldn't fetch blogs" });
    }
    console.log(blogs);

    return res.send({ status: true, blogs: blogs });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
}

async function addNewBlog(req, res) {
  try {
    const { createdBy, title, content, links } = JSON.parse(req.body.json);
    const thumbnail = req.file;

    if (!thumbnail) {
      return res.send({ status: false, message: "Please provide a thumbnail" });
    }
    const result = await uploadOnCloudinary(thumbnail.path);
    if (result == null) {
      return res.send({
        status: false,
        message: "Not able to upload thumbnail on server",
      });
    }

    const blog = await Blog.create({
      createdBy: createdBy,
      title: title,
      content: content,
      thumbnail: result.url,
      links: links,
    });
    const populatedBlog = await blog.populate("createdBy");
    return res.status(201).send({ status: true, blog: populatedBlog });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
}

async function getBlogById(req, res) {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.send({ status: false, message: "Blog does not exist" });
    }
    const user = await blog.populate("createdBy");

    return res.send({ status: true, blog: blog });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
}

async function deleteBlogById(req, res) {
  try {
    const blogId = req.params.id;
    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.send({ status: false, message: "Blog does not exist" });
    }
    const populateBlog = await deletedBlog.populate("createdBy");

    return res.send({ status: true, blog: populateBlog });
  } catch (error) {
    return res.send({ status: false, message: error });
  }
}

export { getAllBlogs, getBlogById, addNewBlog, deleteBlogById };
