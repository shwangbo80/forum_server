const router = require("express").Router();
const Topic = require("../models/TopicModel");
const Post = require("../models/PostModel");

// get all topics
// does not require authorization
router.get("/", async (req, res) => {
  const topics = await Topic.find();
  try {
    res.status(200).json(topics);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all posts in topics
// does not require authorization
router.get("/:id/posts", async (req, res) => {
  const topicPosts = await Post.find({ topicId: req.params.id });
  try {
    res.status(200).json(topicPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one topic
// does not require authorization
router.get("/:id", async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  try {
    res.status(200).json(topic);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create topic
// requires admin role for authorization
router.post("/", async (req, res) => {
  if (req.body.role != "admin") {
    res.status(500).send("You must be admin to create topics");
  } else {
    try {
      const newTopic = new Topic(req.body);
      const savedTopic = await newTopic.save();
      res.status(200).json(savedTopic);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// edit topic
// requires admin role for authorization
router.put("/:id", async (req, res) => {
  const topic = await Topic.findByIdAndUpdate(req.params.id, {
    categoryId: req.body.categoryId,
    topicName: req.body.topicName,
    topicDescription: req.body.topicDescription,
  });

  if (req.body.role != "admin") {
    res.status.send("You are must be admin to edit topics");
  } else {
    try {
      await topic.save();
      res.status(200).json(topic);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// delete topic
// requires admin role for authorization
router.delete("/:id", async (req, res) => {
  if (req.body.role === "admin") {
    const topic = await Topic.findById(req.params.id);
    try {
      await topic.deleteOne();
      res.status(200).json(topic);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("Only the admin may delete this post");
  }
});

//delete all posts in topic
// requires admin role for authorization
router.delete("/:id/topics", async (req, res) => {
  if (req.body.role === "admin") {
    try {
      await Post.deleteMany({ topicId: req.params.id });
      res.status(200).json("All posts in topic sucessfully deleated.");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("Only the admin may delete this post");
  }
});

module.exports = router;
