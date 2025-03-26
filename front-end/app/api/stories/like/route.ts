import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { UserStory } from "@/models/userStoryModel";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { storyId, userId, name, username, avatar } = await req.json(); // ✅ Ensure 'name' is included

    if (!storyId || !userId || !name || !username || !avatar) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Find the story using `id` (UUID), NOT `_id`
    const story = await UserStory.findOne({ id: storyId });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // ✅ Check if user already liked the story
    const alreadyLiked = story.likers.some((liker: any) => liker.id === userId);

    if (!alreadyLiked) {
      // **LIKE: Add user to likers & increment likes count**
      story.likers.push({ id: userId, name, username, avatar }); // ✅ Correct 'name' usage
      story.likes += 1;
    } else {
      // **UNLIKE: Remove user from likers & decrement likes count**
      story.likers = story.likers.filter((liker: any) => liker.id !== userId);
      story.likes -= 1;
    }

    await story.save();

    return NextResponse.json({
      likes: story.likes,
      likers: story.likers,
      liked: !alreadyLiked, // Send if user liked or unliked
    }, { status: 200 });

  } catch (error) {
    console.error("Error liking story:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
