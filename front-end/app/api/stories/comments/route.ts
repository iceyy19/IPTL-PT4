import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { UserStory, Comment } from "@/models/userStoryModel";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { storyId, id, username, text } = await req.json();
    const time = new Date().toISOString();

    if (!storyId || !id || !username || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Find story using `id` (UUID), NOT `_id`
    const story = await UserStory.findOne({ id: storyId });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // ✅ Create a new comment with `storyId` as a string (UUID)
    const newComment = new Comment({
      storyId, // UUID, NOT ObjectId
      id,
      username,
      text,
      time,
    });

    await newComment.save();

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDB();

    // Extract `storyId` from query params
    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get("storyId");

    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });
    }

    // ✅ Find comments for this story (using UUID, NOT `_id`)
    const comments = await Comment.find({ storyId });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    return NextResponse.json({ error: "Failed to retrieve comments" }, { status: 500 });
  }
}
