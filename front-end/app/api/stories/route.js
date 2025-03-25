import { connectToDB } from "@/lib/mongodb";
import { UserStory, Comment } from "@/models/userStoryModel";

// Handle adding a new story
export async function POST(req) {
  try {
    await connectToDB();

    const { id, title, media, type, username, privacy } = await req.json();

    const newStory = new UserStory({
      id,
      title,
      media,
      type,
      username,
      privacy,
      views: 0,
      viewers: [],
      likes: 0,
      likers: [],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    await newStory.save();

    return new Response(JSON.stringify(newStory), { status: 201 });
  } catch (error) {
    console.error("Error adding story:", error);
    return new Response(JSON.stringify({ error: "Failed to add story" }), { status: 500 });
  }
}

export async function GET() {
    try {
      await connectToDB();
  
      // Get the current date and time
      const now = new Date();
  
      // Fetch all stories that have not expired
      const stories = await UserStory.find({ expiresAt: { $gt: now } }); // Use 'expiresAt' instead of 'expireAt'
  
      if (!stories.length) {
        return new Response(JSON.stringify({ message: "No active stories found" }), { status: 404 });
      }
  
      // Fetch comments for each story
      const storiesWithComments = await Promise.all(
        stories.map(async (story) => {
          const comments = await Comment.find({ storyId: story._id });
          return { ...story.toObject(), comments };
        })
      );
  
      return new Response(JSON.stringify(storiesWithComments), { status: 200 });
    } catch (error) {
      console.error("Error retrieving stories:", error);
      return new Response(JSON.stringify({ error: "Failed to retrieve stories" }), { status: 500 });
    }
  }
  