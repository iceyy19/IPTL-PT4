"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageSquare, Share2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

// Mock data for blog posts
const initialPosts = [
  {
    id: "1",
    name: "Emma Wilson",
    username: "@emma_coffee",
    content: "Just discovered this amazing coffee shop downtown. Their pour-over is absolutely divine! ☕️ #CoffeeLover",
    image: "/images/coffee-post-1.jpg",
    likes: 24,
    comments: 5,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    name: "James Rodriguez",
    username: "@coffee_james",
    content:
      "Morning ritual: freshly ground beans, my favorite mug, and a moment of peace before the day begins. What's your coffee routine?",
    image: "/images/coffee-post-2.jpg",
    likes: 18,
    comments: 7,
    timestamp: "5 hours ago",
  },
]

export function BlogSection() {
  const [posts, setPosts] = useState(initialPosts)
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [username, setUsername] = useState("@coffeelover")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePostSubmit = () => {
    if (!content.trim()) return

    const newPost = {
      id: uuidv4(),
      name: name.trim() || "Anonymous",
      username: username.trim() || "@anonymous",
      content,
      image,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
    }

    setPosts([newPost, ...posts])
    setName("")
    setUsername("")
    setContent("")
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Coffee Stories</h2>

      {/* Create Post Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Share Your Coffee Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="@username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Story</Label>
            <Textarea
              id="content"
              placeholder="Write about your special coffee moment..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Add an Image</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                Choose Image
              </Button>
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {image && <span className="text-sm text-muted-foreground">Image selected</span>}
            </div>

            {image && (
              <div className="mt-2 relative rounded-md overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-auto max-h-[200px] object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImage(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          <Button onClick={handlePostSubmit} disabled={!content.trim()} className="w-full sm:w-auto">
            Post Story
          </Button>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No posts yet. Be the first to share your coffee story!
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback>{post.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.username} • {post.timestamp}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4">{post.content}</p>
                </div>

                {post.image && (
                  <div className="w-full h-[300px] bg-muted">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={`Post by ${post.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4 flex items-center gap-6 border-t">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  )
}

