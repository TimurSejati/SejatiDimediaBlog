import Post2 from "../models/post2.model.js";
import { v4 as uuidv4 } from "uuid";

const createPost = async (req, res, next) => {
  try {
    console.log(req.body.body);
    const post = new Post2({
      title: req.body.title,
      caption: req.body.caption,
      slug: uuidv4(),
      body: JSON.parse(req.body.body),
      // body: {
      //   type: "doc",
      //   content: [],
      // },
      photo: req.body.photo,
      user: req.user._id,
    });

    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post2.findOne({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post was not found");
      next(error);
      return;
    }

    const updated = await Post2.findByIdAndUpdate(
      post._id,
      {
        $set: {
          title: req.body.title,
          caption: req.body.caption,
          categories: req.body.categories,
          photo: req.body.photo,
          tags: req.body.tags,
          body: JSON.parse(req.body.body),
        },
      },
      { new: true }
    );

    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post2.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    // delete comments

    return res.json({
      message: "Post is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post2.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["profilePicture", "username"],
      },
    ]);

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
};

const getAllPost = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post2.find({
      ...(req.query.userId && { user: req.query.userId }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate([
        {
          path: "user",
          select: ["profilePicture", "username"],
        },
      ]);

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export { createPost, updatePost, deletePost, getPost, getAllPost };
