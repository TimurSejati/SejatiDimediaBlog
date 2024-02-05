import Post2 from "../models/post2.model.js";
import { v4 as uuidv4 } from "uuid";

const createPost = async (req, res, next) => {
  try {
    const post = new Post2({
      title: req.body.title,
      caption: req.body.caption,
      slug: uuidv4(),
      body: JSON.parse(req.body.body),
      // body: {
      //   type: "doc",
      //   content: [],
      // },
      categories: JSON.parse(req.body.categories),
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
          categories: JSON.parse(req.body.categories),
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
        path: "categories",
        select: ["title"],
      },
      {
        path: "user",
        select: ["profilePicture", "username"],
      },
    ]);

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    // Find related posts by categories
    const relatedPosts = await Post2.find({
      categories: { $in: post.categories.map((category) => category._id) },
      _id: { $ne: post._id }, // Exclude the current post
    })
      .limit(3)
      .populate([
        {
          path: "categories",
          select: ["title"],
        },
        {
          path: "user",
          select: ["profilePicture", "username"],
        },
      ]);

    // return res.json(post);
    return res.json({ post, relatedPosts });
  } catch (error) {
    next(error);
  }
};

const getAllPost = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const categoryQuery = req.query.category
      ? { categories: req.query.category }
      : {};
    const posts = await Post2.find({
      ...categoryQuery,
      ...(req.query.userId && { user: req.query.userId }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate([
        {
          path: "user",
          select: ["profilePicture", "username"],
        },
        {
          path: "categories",
          select: ["title"],
        },
      ]);

    // Check if there is a next page
    const nextPagePosts = await Post2.find({
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
      .skip(startIndex + limit)
      .limit(1); // Fetch one additional post to check if there is a next page

    const hasNextPage = nextPagePosts.length > 0;

    // res.json(posts);
    res.json({ posts, hasNextPage });
  } catch (error) {
    next(error);
  }
};

export { createPost, updatePost, deletePost, getPost, getAllPost };
