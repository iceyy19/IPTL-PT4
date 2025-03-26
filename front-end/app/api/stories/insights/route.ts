import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { UserStory } from "@/models/userStoryModel";

export async function GET(req: Request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const storyId = searchParams.get("storyId");

    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });
    }

    // ✅ Find story using `id` (UUID), NOT `_id`
    const story = await UserStory.findOne({ id: storyId });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({
      viewers: story.viewers,
      likers: story.likers,
      views: story.views,
      likes: story.likes,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching insights:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
