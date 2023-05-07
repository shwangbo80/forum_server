const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TopicSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    topicName: {
      type: String,
      required: true,
      min: 5,
      max: 30,
    },
    topicDescription: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("Topics", TopicSchema);
