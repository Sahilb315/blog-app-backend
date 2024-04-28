import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    links: [
      {
        type: String,
        required: false,
      },
    ],
  }, 
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export { Blog };
