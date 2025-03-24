import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export const connectToDB = async () => {
  if (isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error("MONGODB_URI is not defined in the environment variables");
    }

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};