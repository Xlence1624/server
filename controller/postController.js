import Post from "../model/post.js";
import cloudinary from "../config/cloudinary.js";
// @desc    Get all posts
// @route   GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};


// @desc    Get a single post
// @route   GET /api/posts/:id
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};


// @desc    Create a new post
// @route   POST /api/posts


// export const createPost = async (req, res) => {
//   try {
//     const {
//       title,
//       content,
//       category,
//       published,
//       readTime,
//     } = req.body;

//     if (!title || !content || !category) {
//       return res.status(400).json({
//         message: "Title, content and category are required",
//       });
//     }

//     let imageUrl = null;

//     if (req.file) {
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "my-blog/posts",
//           },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result);
//             }
//           }
//         );

//         uploadStream.end(req.file.buffer);
//       });

//       imageUrl = result.secure_url;
//     }

//     const post = await Post.create({
//       title,
//       content,
//       category,
//       published,
//       readTime,
//       image: imageUrl,
//       author: req.user.userId,
//     });

//     res.status(201).json({
//       message: "Post created successfully",
//       post,
//     });

//   } catch (error) {
//     console.error("Create post error:", error);

//     res.status(500).json({
//       message: "Failed to create post",
//       error: error.message,
//     });
//   }
// };


// @desc    Update a post
// @route   PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Only the author can update the post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this post",
      });
    }

    const { title, content, image, category, published } = req.body;

    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.image = image ?? post.image;
    post.category = category ?? post.category;
    post.published = published ?? post.published;

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};



// export const createPost = async (req, res) => {
//   try {
//     const {
//       title,
//       content,
//       category,
//       published,
//       readTime,
//       date,
//     } = req.body;

//     if (!req.file) {
//       return res.status(400).json({
//         message: "Please upload a post image",
//       });
//     }

//     // Upload image to Cloudinary
//     const cloudinaryResult = await uploadToCloudinary(
//       req.file.buffer
//     );

//     // Create post in MongoDB
//     // const post = await Post.create({
//     //   title,
//     //   content,
//     //   category,
//     //   published: published === "true",
//     //   readTime: Number(readTime),
//     //   date,

//     //   // Cloudinary information
//     //   image: cloudinaryResult.secure_url,
//     //   imagePublicId: cloudinaryResult.public_id,

//     //   // Keep your existing author field here
//     //   // author: req.user.userId,
//     // });

//     const post = await Post.create({
//   title,
//   content,
//   category,
//   published: published === "true",
//   readTime: Number(readTime),
//   date,

//   image: cloudinaryResult.secure_url,
//   imagePublicId: cloudinaryResult.public_id,

//   author: req.user.userId,
// });

//     res.status(201).json({
//       message: "Post created successfully",
//       post,
//     });

//   } catch (error) {
//     console.error("Create post error:", error);

//     res.status(500).json({
//       message: "Failed to create post",
//       error: error.message,
//     });
//   }
// };

export const createPost = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILE:", req.file);
    console.log("REQ.USER:", req.user);

    const {
      title,
      content,
      category,
      published,
      readTime,
      date,
    } = req.body;

    // Check image
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a post image",
      });
    }

    // Check logged-in user
    if (!req.user?.userId) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer
    );

    console.log("CLOUDINARY RESULT:", cloudinaryResult);

    // Create post in MongoDB
    const post = await Post.create({
      title,
      content,
      category,

      published:
        published === "true" || published === true,

      readTime: Number(readTime) || 0,

      date: date || undefined,

      image: cloudinaryResult.secure_url,

      imagePublicId: cloudinaryResult.public_id,

      author: req.user.userId,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    console.error("CREATE POST ERROR:", error);

    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};
// @desc    Delete a post
// @route   DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Only the author can delete the post
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};



const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "blog-posts",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};