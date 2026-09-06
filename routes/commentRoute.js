import express from "express";

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controller/commentsControl.js";

import auth from "../middleware/auth.js";

const router = express.Router();

// Get comments for a post
router.get("/posts/:postId/comments", getComments);

// Add a comment
router.post("/posts/:postId/comments", auth, createComment);

// Update a comment
router.put("/comments/:id", auth, updateComment);

// Delete a comment
router.delete("/comments/:id", auth, deleteComment);

export default router;