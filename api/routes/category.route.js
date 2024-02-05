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
  .post(authGuard, adminGuard, createCategory)
  .get(getAllCategories);

router
  .route("/:categoryId")
  .put(authGuard, adminGuard, updateCategory)
  .delete(authGuard, adminGuard, deleteCategory);

export default router;
