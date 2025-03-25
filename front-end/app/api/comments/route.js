import { connectToDB } from "@/lib/mongodb";
import { Comment } from "@/models/userStoryModel";

export async function POST(req) {
  try {
    await connectToDB();

    const { storyId, id, username, text, time } = await req.json();

    const newComment = new Comment({
      storyId,
      id,
      username,
      text,
      time,
    });

    await newComment.save();

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return new Response(JSON.stringify({ error: "Failed to add comment" }), { status: 500 });
  }
}