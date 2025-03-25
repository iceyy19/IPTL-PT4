import { connectToDB } from "@/lib/mongodb"
import { UserStory, Comment } from "@/models/userStoryModel"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const storyId = params.id
    const { id, username, text } = await req.json()

    // Find the story
    const story = await UserStory.findById(storyId)
    if (!story) {
      return new Response(JSON.stringify({ error: "Story not found" }), { status: 404 })
    }

    // Create a new comment
    const newComment = new Comment({
      storyId,
      id,
      username,
      text,
      time: new Date().toISOString(),
    })

    await newComment.save()

    return new Response(JSON.stringify(newComment), { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return new Response(JSON.stringify({ error: "Failed to add comment" }), { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB()

    const storyId = params.id

    // Find all comments for this story
    const comments = await Comment.find({ storyId })

    return new Response(JSON.stringify(comments), { status: 200 })
  } catch (error) {
    console.error("Error retrieving comments:", error)
    return new Response(JSON.stringify({ error: "Failed to retrieve comments" }), { status: 500 })
  }
}

