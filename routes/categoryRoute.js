const router = require("express").Router();
const Category = require("../models/CategoryModel");
const Topic = require("../models/TopicModel");

// get all categories
// does not require authorization
router.get("/", async (req, res) => {
  const categories = await Category.find();
  try {
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one category
// does not require authorization
router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  try {
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all topics in category
// does not require authorization
router.get("/:id/topics", async (req, res) => {
  const categoryTopic = await Topic.find({
    categoryId: req.params.id,
  });
  try {
    res.status(200).json(categoryTopic);
  } catch (err) {
    res.status(500).json(err);
  }
});

// add new category
// requires admin role for authorization
router.post("/", async (req, res) => {
  const newCategory = new Category(req.body);
  if (req.body.role === "admin") {
    try {
      const savedCategory = await newCategory.save();
      res.status(200).json(savedCategory);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("You are not authenticated");
  }
});

// edit category
// requires admin role for authorization
router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, {
    categoryName: req.body.categoryName,
    categoryDescription: req.body.categoryDescription,
  });

  if (req.body.role != "admin") {
    res.status(500).send("You are not authenticated");
  } else {
    try {
      await category.save();
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// delete category
// requires admin role for authorization
router.delete("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (req.body.role === "admin") {
    try {
      await category.deleteOne();
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("You are not authenticated");
  }
});

// delete all topics in category
// requires admin role for authorization
router.delete("/:id/topics", async (req, res) => {
  if (req.body.role === "admin") {
    try {
      await Topic.deleteMany({ categoryId: req.params.id });
      res.status(200).json("All topics in category successfully deleted.");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(500).json("Only the admin may delete this post");
  }
});

module.exports = router;
