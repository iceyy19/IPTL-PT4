import { connectToDB } from "@/lib/mongodb";
import User from "@/models/userModels";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, username, email, password } = await req.json();

    // Connect to the database
    await connectToDB();

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Email or username already exists" }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}