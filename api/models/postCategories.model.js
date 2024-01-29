import { Schema, model } from "mongoose";

const PostCategoriesSchema = new Schema(
  {
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = model("Post", PostCategoriesSchema);
export default Post;
