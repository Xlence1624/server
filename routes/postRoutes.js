import express from "express";
import upload from "../middleware/upload.js";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controller/postController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/:id", getPost);

// Protected routes
router.post(
  "/",
  auth,
  upload.single("image"),
  createPost
);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

export default router;