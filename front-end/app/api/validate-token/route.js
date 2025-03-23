import { connectToDB } from "@/lib/mongodb";
import UserLogin from "@/models/userLoginModel";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Connect to the database
    await connectToDB();

    // Find the token in the userLogin collection
    const tokenDoc = await UserLogin.findOne({ token });

    if (!tokenDoc) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    // Check if the token has expired
    if (new Date() > tokenDoc.expiresAt) {
      return new Response(JSON.stringify({ error: "Token expired" }), { status: 401 });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

    return new Response(JSON.stringify({ success: true, user: decoded }), { status: 200 });
  } catch (error) {
    console.error("Token validation error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}