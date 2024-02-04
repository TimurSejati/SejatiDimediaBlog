import express from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getPost,
  updatePost,
} from "../controllers/post2.controller.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(authGuard, adminGuard, createPost).get(getAllPost);

router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

export default router;
