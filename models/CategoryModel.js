const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    categoryDescription: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
  );

module.exports = mongoose.model("categories", CategorySchema);
