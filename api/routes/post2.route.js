import express from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getAllPostFront,
  getPost,
  likePost,
  updatePost,
} from "../controllers/post2.controller.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.route("/").post(authGuard, adminGuard, createPost).get(getAllPost);
router.route("/front").get(getAllPostFront);

router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

router.route("/likePost/:postId").put(authGuard, likePost);

export default router;
