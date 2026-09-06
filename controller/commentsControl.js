import Comment from "../model/comments.js";
import Post from "../model/post.js";

// @desc    Get all comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch comments",
      error: error.message,
    });
  }
};


// @desc    Create a comment
// @route   POST /api/posts/:postId/comments
// @access  Private
export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    // Validate comment
    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      content: content.trim(),
      post: postId,
      author: req.user.userId,
    });

    // Include author information in response
    const populatedComment = await comment.populate(
      "author",
      "name"
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create comment",
      error: error.message,
    });
  }
};


// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Only the comment author can update it
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this comment",
      });
    }

    comment.content = content.trim();

    const updatedComment = await comment.save();

    const populatedComment = await updatedComment.populate(
      "author",
      "name"
    );

    res.status(200).json({
      message: "Comment updated successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update comment",
      error: error.message,
    });
  }
};


// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Only the comment author can delete it
    if (comment.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      });
    }

    await comment.deleteOne();

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};