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

    // Delete the session from the userLogin collection
    const result = await UserLogin.deleteOne({ sessionId });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "Session not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Logged out successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}