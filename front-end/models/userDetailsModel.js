import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, default: function () { return this._id; }, unique: true }, // ✅ Automatically set userId
  username: { type: String, required: true, unique: true }, // Username of the user
  name: { type: String, required: true }, // Full name of the user
  bio: { type: String, default: "" }, // User bio
  location: { type: String, default: "" }, // User location
  birthday: { type: Date, default: null }, // User birthday
  website: { type: String, default: "" }, // User website URL
  profileImage: { type: String, default: "/images/avatar.jpg" }, // Default profile image
  coverImage: { type: String, default: "/images/coffee-banner.jpg" }, // Default cover image
  stats: {
    posts: { type: Number, default: 0 }, // Number of posts
    followers: { type: Number, default: 0 }, // Number of followers
    following: { type: Number, default: 0 }, // Number of following
  },
  createdAt: { type: Date, default: Date.now }, // User creation date
  updatedAt: { type: Date, default: Date.now }, // Auto-update modification date
});

// Auto-update `updatedAt` field on every save
userDetailsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.UserDetails || mongoose.model("UserDetails", userDetailsSchema);
