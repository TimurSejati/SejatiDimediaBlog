import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: Object, required: true },
    photo: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/sejati-dimedia-blog.appspot.com/o/1705760451945-post1.jpg?alt=media&token=33f4d739-9386-41cb-b7e7-af4e271ff3ac",
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String] },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

const Post2 = model("Post2", PostSchema);
export default Post2;
