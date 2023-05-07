const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      min: 5,
      max: 20,
    },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: Number,
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    underReview: {
      type: Boolean,
      default: false,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
      required: true,
    },
    postName: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 30,
    },
    postBody: {
      type: String,
      required: true,
      minLength: 1,
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Posts", PostSchema);
