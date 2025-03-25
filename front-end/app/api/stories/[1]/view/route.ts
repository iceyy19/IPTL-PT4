import { connectToDB } from "@/lib/mongodb"
import { UserStory } from "@/models/userStoryModel"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const storyId = params.id

    // In a real app, you would get the user info from the session/auth
    const viewer = {
      id: "user123",
      name: "Current User",
      username: "@current_user",
      avatar: "/images/avatar-current.jpg",
      time: new Date().toISOString(),
    }

    // Find the story
    const story = await UserStory.findById(storyId)
    if (!story) {
      return new Response(JSON.stringify({ error: "Story not found" }), { status: 404 })
    }

    // Check if user already viewed the story
    const alreadyViewed = story.viewers.some((v: any) => v.id === viewer.id)

    if (!alreadyViewed) {
      // Add user to viewers and increment views count
      story.viewers.push(viewer)
      story.views += 1
      await story.save()
    }

    return new Response(JSON.stringify({ views: story.views, viewers: story.viewers }), { status: 200 })
  } catch (error) {
    console.error("Error updating view count:", error)
    return new Response(JSON.stringify({ error: "Failed to update view count" }), { status: 500 })
  }
}

