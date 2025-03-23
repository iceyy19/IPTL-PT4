import { connectToDB } from "@/lib/mongodb";
import UserLogin from "@/models/userLoginModel";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Connect to DB
    await connectToDB();

    // Remove token from userLogin collection
    await UserLogin.findOneAndDelete({ token });

    return new Response(JSON.stringify({ success: true, message: "Logged out successfully" }), { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
