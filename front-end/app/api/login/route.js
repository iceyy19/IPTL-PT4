import { connectToDB } from "@/lib/mongodb";
import User from "@/models/userModels";
import UserLogin from "@/models/userLoginModel"; // Import the userLogin model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
    try {
      const { emailOrUsername, password } = await req.json();
  
      // Connect to the database and find the user
      await connectToDB();
      const user = await User.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      });
  
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Invalid email/username or password" }),
          { status: 401 }
        );
      }
  
      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return new Response(
          JSON.stringify({ error: "Invalid email/username or password" }),
          { status: 401 }
        );
      }
  
      // Generate a unique session ID
      const sessionId = uuidv4();
  
      // Create a session token (JWT) with the session ID
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, sessionId }, // Include sessionId
        process.env.NEXTAUTH_SECRET,
        { expiresIn: "1h" }
      );
  
      // Calculate the expiration time
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
  
      // Store the token in the userLogin collection
      await UserLogin.create({
        userId: user._id,
        token,
        sessionId, // Store the sessionId
        expiresAt,
      });
  
      // Return the token and user info
      return new Response(
        JSON.stringify({
          success: true,
          user: { id: user._id, name: user.name, email: user.email },
          token,
        }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Login error:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }