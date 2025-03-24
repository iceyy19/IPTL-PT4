import { connectToDB } from "@/lib/mongodb";
import UserLogin from "@/models/userLoginModel";

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDB();

    // Find the session in the userLogin collection
    const session = await UserLogin.findOne({ sessionId });

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 401 }
      );
    }

    // Check if the session has expired
    if (new Date() > session.expiresAt) {
      return new Response(
        JSON.stringify({ error: "Session expired" }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Session is valid" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Session validation error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}