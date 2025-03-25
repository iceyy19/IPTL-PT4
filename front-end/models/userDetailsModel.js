const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  username: { type: String, ref: "User", required: true, unique: true }, // Username of the user
  name: { type: String }, // Full name of the user
  bio: { type: String, default: "" }, // User bio
  location: { type: String, default: "" }, // User location
  birthday: { type: Date, default: null }, // User birthday
  website: { type: String, default: "" }, // User website URL
  joinedDate: { type: Date, default: Date.now }, // Metadata creation date
  modifiedAt: { type: Date, default: null }, // Metadata modification date
  profileImage: { type: String, default: "/images/avatar.jpg" }, // Default profile image
  coverImage: { type: String, default: "/images/coffee-banner.jpg" }, // Default cover image
  stats: {
    posts: { type: Number, default: 0 }, // Number of posts
    followers: { type: Number, default: 0 }, // Number of followers
    following: { type: Number, default: 0 }, // Number of following
  },
});

module.exports = mongoose.models.UserDetails || mongoose.model("UserDetails", userDetailsSchema);