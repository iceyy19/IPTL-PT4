const mongoose = require("mongoose");

// Schema for viewers of a story
const ViewerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String, required: true },
  time: { type: String, required: true },
});

// Schema for likers of a story
const LikerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  avatar: { type: String, required: true },
});

// Schema for comments on a story
const CommentSchema = new mongoose.Schema({
  storyId: { type: mongoose.Schema.Types.ObjectId, ref: "UserStory", required: true },
  id: { type: String, required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true },
});

// Main UserStory schema
const UserStorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  media: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
  username: { type: String, required: true },
  privacy: { type: String, enum: ["public", "private", "friends"], required: true },
  views: { type: Number, default: 0 },
  viewers: { type: [ViewerSchema], default: [] },
  likes: { type: Number, default: 0 },
  likers: { type: [LikerSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// Check if models already exist before defining them
const UserStory = mongoose.models.UserStory || mongoose.model("UserStory", UserStorySchema);
const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

module.exports = { UserStory, Comment };