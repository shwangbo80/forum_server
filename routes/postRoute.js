const router = require("express").Router();
const Post = require("../models/PostModel");
const Comment = require("../models/CommentModel");
const ObjectId = require("mongoose").Types.ObjectId;

// get all posts
// does not require authorization
router.get("/", async (req, res) => {
  const posts = await Post.find();
  try {
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one post
// does not require authorization
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create post
// requires user ID for authorization
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    if (!req.body.userId) {
      res.status(500).send("You must be registered user");
    } else if (!ObjectId.isValid(req.body.topicId)) {
      res.status(500).send("Invalid ID");
    } else {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// edit post
// needs to be owner of a post for authorization
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (req.body.userId === post.userId || req.body.role === "admin") {
    const newPost = await Post.findByIdAndUpdate(req.params.id, {
      postName: req.body.postName,
      postBody: req.body.postBody,
      userId: req.body.userId,
      role: req.body.role,
    });
    try {
      await newPost.save();
      res.status(200).json(newPost);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).send("You must be registered user");
  }
});

// delete post
// needs to be owner of a post or admin for authorization
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!req.body.role === "admin") {
    res.status(500).json("Only the admin or post owner may delete this post");
  } else if (!req.body.userId === post.userId || null) {
    res.status(500).json("Only the admin or post owner may delete this post");
  } else {
    try {
      await post.deleteOne();
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// get all comments in post
// Does not require authorization
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single comment
// Does not require authorization
router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await post.comments.id(req.params.commentId);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// post new comment
// needs user ID for authorization
router.post("/:id/comments", async (req, res) => {
  if (req.body.userId) {
    try {
      const post = await Post.findById(req.params.id);
      const comment = await post.updateOne({
        $push: { comments: req.body },
      });
      res.status(200).json(`Comment successfully added`);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("You need to be registered user to post comments.");
  }
});

// edit a comment
// needs to be owner of a comment for authorization
router.put("/:id/comments/:commentId", async (req, res) => {
  const post = await Post.findById(req.params.id);
  const comment = await post.comments.id(req.params.commentId);
  if (req.body.userId === comment.userId)
    try {
      comment.comment = req.body.comment;
      await post.save();
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json(err);
    }
  else {
    res
      .status(500)
      .json("You need to be owner of the comment to edit comments.");
  }
});

// delete a comment
// needs to be owner of a comment or admin for authorization
router.delete("/:id/comments/:commentId", async (req, res) => {
  const post = await Post.findById(req.params.id);
  const comment = await post.comments.id(req.params.commentId);
  if (req.body.userId === comment.userId || req.body.role === "admin")
    try {
      await comment.remove();
      post.save();
      res.status(200).json("Comment deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  else {
    res
      .status(500)
      .json("You need to be owner of the comment or admin to delete comments.");
  }
});

// !!!!KEEP UNTIL TESTS FOR NEW COMMENT ROUTES PASSES!!!!
// Old routes (before embedding comments into post array)

// get all comments in post
// router.get("/:id/comments", async (req, res) => {
//   const postComment = await Comment.find({ postId: req.params.id });
//   try {
//     res.status(200).json(postComment);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// delete all comments in post
// router.delete("/:id/comments", async (req, res) => {
//   const post = await Post.findById(req.params.id);
//   try {
//     if (!req.body.role === "admin" || !req.body.userId === post.userId) {
//       res.status(500).json("Only the admin or post owner may delete this post");
//     } else {
//       try {
//         await Comment.deleteMany({ postId: req.params.id });
//         res.status(200).json(topic);
//       } catch (err) {
//         res.status(500).json(err);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
