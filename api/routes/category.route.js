import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router
  .route("/")
  .post(verifyToken, adminGuard, createCategory)
  .get(verifyToken, adminGuard, getAllCategories);

router
  .route("/:categoryId")
  .put(verifyToken, adminGuard, updateCategory)
  .delete(verifyToken, adminGuard, deleteCategory);

export default router;
