import { connectToDB } from "@/lib/mongodb";
import UserDetails from "@/models/userDetailsModel";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Extract the username from the query parameters
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        { status: 400 }
      );
    }

    // Fetch user profile data from the UserDetails collection
    const userProfile = await UserDetails.findOne({ username });

    if (!userProfile) {
      return new Response(
        JSON.stringify({ error: "User profile not found" }),
        { status: 404 }
      );
    }

    // Return the user profile data
    return new Response(JSON.stringify({ profile: userProfile }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user profile" }),
      { status: 500 }
    );
  }
}