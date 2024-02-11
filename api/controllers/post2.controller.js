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
      tags: JSON.parse(req.body.tags),
      photo: req.body.photo,
      user: req.user._id,
      published: req.body.published,
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
          title: req.body.title ? req.body.title : post.title,
          caption: req.body.caption ? req.body.caption : post.caption,
          categories: req.body.categories
            ? JSON.parse(req.body.categories)
            : post.categories,
          photo: req.body.photo ? req.body.photo : post.photo,
          tags: req.body.tags ? JSON.parse(req.body.tags) : post.tags,
          body: req.body.body ? JSON.parse(req.body.body) : post.body,
          published: req.body.published ? req.body.published : post.published,
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
        path: "tags",
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
      ...{ published: true },
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
          path: "tags",
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
    const tagQuery = req.query.tag ? { tags: req.query.tag } : {};
    const posts = await Post2.find({
      ...categoryQuery,
      ...tagQuery,
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
        {
          path: "tags",
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

const getAllPostFront = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const categoryQuery = req.query.category
      ? { categories: req.query.category }
      : {};
    const tagQuery = req.query.tag ? { tags: req.query.tag } : {};
    const posts = await Post2.find({
      ...categoryQuery,
      ...tagQuery,
      ...{ published: true },
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
        {
          path: "tags",
          select: ["title"],
        },
      ]);

    // Check if there is a next page
    const nextPagePosts = await Post2.find({
      ...{ published: true },
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

export const likePost = async (req, res, next) => {
  try {
    const post = await Post2.findById(req.params.postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    const userIndex = post.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      post.numberOfLikes += 1;
      post.likes.push(req.user.id);
    } else {
      post.numberOfLikes -= 1;
      post.likes.splice(userIndex, 1);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const viewPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post2.findById(postId);

    // Check if the user is logged in
    // Extract timestamp for comparison
    const currentTimestamp = new Date();
    if (req.user) {
      if (req?.user?._id == "65abd134d93917379a2c5b0a") {
        return;
      }
      const existingViewer = post.views.find(
        (view) =>
          view?.viewerId?.toString() === req.user._id.toString() &&
          view?.timestamp?.toDateString() === currentTimestamp.toDateString()
      );

      if (!existingViewer) {
        // Add logged-in user as viewer with current timestamp
        post.views.push({
          viewerId: req.user._id,
          timestamp: currentTimestamp,
        });
      } else {
        // Viewer already exists for the current day, do not push again
        console.log("Viewer already exists for the current day");
      }
    } else {
      // Add guest as viewer
      post.views.push({ viewerId: null });
    }

    // Increment views
    // post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPost,
  getAllPostFront,
  viewPost,
};
