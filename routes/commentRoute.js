const router = require("express").Router();
const Comment = require("../models/CommentModel");

// create comment
router.post("/", async (req, res) => {
  const newComment = new Comment(req.body);
  if (!req.body.userId) {
    res.status(500).send("You must be registered user");
  } else {
    try {
      const savedComment = await newComment.save();
      res.status(200).json(savedComment);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// get all comments
router.get("/", async (req, res) => {
  const comment = await Comment.find();
  try {
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one comment
router.get("/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  try {
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// edit comment
router.put("/:id", async (req, res) => {
  const newComment = await Comment.findByIdAndUpdate(req.params.id, {
    userId: req.body.userId,
    postId: req.body.postId,
    comment: req.body.comment,
  });

  if (req.body.userId === newComment.userId || req.body.role === "admin") {
    try {
      await newComment.save();
      res.status(200).json(newComment);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).send("You are not authenticated");
  }
});

// delete comment
router.delete("/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (req.body.role === "admin" || req.body.userId === comment.userId) {
    try {
      await comment.deleteOne();
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res
      .status(500)
      .json("Only the admin or comment user may delete this comment");
  }
});

module.exports = router;
