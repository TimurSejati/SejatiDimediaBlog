import express from "express";
import {
  createTag,
  deleteTag,
  getAllTags,
  updateTag,
} from "../controllers/tag.controller.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(authGuard, adminGuard, createTag).get(getAllTags);

router
  .route("/:tagId")
  .put(authGuard, adminGuard, updateTag)
  .delete(authGuard, adminGuard, deleteTag);

export default router;
