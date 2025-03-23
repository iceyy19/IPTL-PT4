import mongoose from "mongoose";

const userLoginSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
  sessionId: { type: String, required: true }, // Unique session ID
  expiresAt: { type: Date, required: true }, // Expiration time for the token
  createdAt: { type: Date, default: Date.now },
});

const UserLogin = mongoose.models.UserLogin || mongoose.model("UserLogin", userLoginSchema);

export default UserLogin;