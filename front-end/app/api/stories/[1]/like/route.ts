import { connectToDB } from "@/lib/mongodb"
import { UserStory } from "@/models/userStoryModel"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const storyId = params.id

    // In a real app, you would get the user info from the session/auth
    const user = {
      id: "user123",
      name: "Current User",
      username: "@current_user",
      avatar: "/images/avatar-current.jpg",
    }

    // Find the story
    const story = await UserStory.findById(storyId)
    if (!story) {
      return new Response(JSON.stringify({ error: "Story not found" }), { status: 404 })
    }

    // Check if user already liked the story
    const alreadyLiked = story.likers.some((liker: any) => liker.id === user.id)

    if (!alreadyLiked) {
      // Add user to likers and increment likes count
      story.likers.push(user)
      story.likes += 1
      await story.save()
    }

    return new Response(JSON.stringify({ likes: story.likes, likers: story.likers }), { status: 200 })
  } catch (error) {
    console.error("Error liking story:", error)
    return new Response(JSON.stringify({ error: "Failed to like story" }), { status: 500 })
  }
}

