const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
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
  {timestamps: true}
);

module.exports = mongoose.model("comment", CommentSchema);
