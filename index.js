const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const categoryRoute = require("./routes/categoryRoute");
const topicRoute = require("./routes/topicRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");

const port = process.env.PORT || 8800;

app.use(cors());
dotenv.config();

mongoose.connect(
  process.env.MONGODB_ATLAS_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
// mongoose.set("useFindAndModify", false);

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/category", categoryRoute);
app.use("/api/topic", topicRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

app.listen(port, () => {
  console.log("Backend server is running at " + port);
});
