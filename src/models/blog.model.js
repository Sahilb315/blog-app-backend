import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    authorName:{
        type: String,
        required:true
    },
    title: {
        type: String,
        required: true
    }
}, { timestamps: true });
