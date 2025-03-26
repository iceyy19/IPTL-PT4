import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Post from "@/models/userPostModel"; // Ensure this matches your actual model path

// ✅ CREATE a new post
export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { id, name, username, content, image, privacy } = await req.json();

    if (!id || !name || !username || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPost = new Post({
      id,
      name,
      username,
      content,
      image,
      privacy: privacy || "public",
    });

    await newPost.save();
    return NextResponse.json({ message: "Post created successfully", post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// ✅ RETRIEVE all posts
export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const posts = await Post.find().sort({ timestamp: -1 }); // Sort by latest posts first
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
