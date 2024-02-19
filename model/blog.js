import mongoose from "mongoose";
const { Schema, model } = mongoose

const blogSchema = new Schema({
    title: String,
    slug: String,
    published: Boolean
})

const Blog = model("Blog", blogSchema) 
export default Blog