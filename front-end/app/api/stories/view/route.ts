import { connectToDB } from "@/lib/mongodb";
import { UserStory } from "@/models/userStoryModel";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { storyId, id, name, username, avatar } = await req.json();

    console.log("Received Data:", { storyId, id, name, username, avatar });

    if (!storyId || !id || !username || !name || !avatar) {
      console.error("❌ Missing required fields");
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Find the story
    const story = await UserStory.findOne({ id: storyId });
    console.log("Found Story:", story);

    if (!story) {
      console.error("❌ Story not found");
      return new Response(JSON.stringify({ error: "Story not found" }), { status: 404 });
    }

    // Check if user already viewed
    const alreadyViewed = story.viewers.some((viewer) => viewer.id === id);
    console.log("Already Viewed?", alreadyViewed);

    if (!alreadyViewed) {
      console.log("✅ Adding new viewer...");
      story.viewers.push({ id, name, username, avatar, time: new Date().toISOString() });
      story.views += 1;
      await story.save();
      console.log("✅ Updated Story:", story);
    } else {
      console.log("ℹ️ User already viewed this story.");
    }

    return new Response(JSON.stringify({ views: story.views, viewers: story.viewers }), { status: 200 });
  } catch (error) {
    console.error("🚨 Error updating view count:", error);
    return new Response(JSON.stringify({ error: "Failed to update view count" }), { status: 500 });
  }
}
