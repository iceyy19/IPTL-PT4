import { connectToDB } from "@/lib/mongodb";
import UserDetails from "@/models/userDetailsModel";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectToDB();

    const { username, bio, location, birthday, website } = await req.json();

    // Generate a random username starting with "Username" followed by 10 random numbers
    let name;
    let isUnique = false;

    while (!isUnique) {
        const randomNumbers = Math.floor(1000000000 + Math.random() * 9000000000); // Generate 10 random digits
        name = `Username${randomNumbers}`;

        // Check if the generated username is unique
        const existingUser = await UserDetails.findOne({ name });
        if (!existingUser) {
        isUnique = true;
        }
    }

    // Create the userDetails document
    const userDetails = await UserDetails.create({
      username,
      name: name || "",
      bio: bio || "",
      location: location || "",
      birthday: birthday || null,
      website: website || "",
    });

    return new Response(JSON.stringify(userDetails), { status: 201 });
  } catch (error) {
    console.error("Error creating user details:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create user details" }),
      { status: 500 }
    );
  }
}