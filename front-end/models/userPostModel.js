import mongoose from "mongoose";

// Define the Comment Schema (nested inside Post)
const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Unique comment ID
  name: { type: String, required: true }, // Commenter's name
  username: { type: String, required: true }, // Commenter's username
  content: { type: String, required: true }, // Comment content
  timestamp: { type: Date, default: Date.now }, // Timestamp of comment
});

// Define the Post Schema
const PostSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Unique post ID
  name: { type: String, required: true }, // User's name
  username: { type: String, required: true }, // User's username
  content: { type: String, required: true }, // Post content
  image: { type: String, default: "" }, // Image URL (optional)
  likes: { type: Number, default: 0 }, // Number of likes
  comments: { type: [CommentSchema], default: [] }, // Nested array of comments
  timestamp: { type: Date, default: Date.now }, // Date of post creation
  savedBy: { type: [String], default: [] }, // ✅ Array of usernames who saved the post
  privacy: { type: String, enum: ["public", "friends", "private"], default: "public" }, // Privacy setting
  edited: { type: Boolean, default: false }, // If the post was edited
});

// Export the Post model
export default mongoose.models.Post || mongoose.model("Post", PostSchema);
