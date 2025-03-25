"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EyeOff, Eye, Heart, MessageSquare, Share2, Globe, Users, Lock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Define the Story and Post interfaces
interface Story {
  id: string
  title: string
  media: string
  date: string
  hidden: boolean
  privacy: string
}

interface Post {
  id: string
  content: string
  image?: string // Make image optional with the ? modifier
  likes: number
  comments: Array<{
    id: string
    name: string
    username: string
    content: string
    timestamp: string
  }>
  date: string
  hidden: boolean
  saved: boolean
  privacy: string
  edited?: boolean
}

interface HiddenContentProps {
  stories: Story[]
  setStories: React.Dispatch<React.SetStateAction<Story[]>>
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  userProfile: {
    name: string
    username: string
    profileImage: string
  }
}

export function HiddenContent({ stories, setStories, posts, setPosts, userProfile }: HiddenContentProps) {
  // Toggle hide story
  const toggleHideStory = (id: string) => {
    setStories((prevStories: Story[]) =>
      prevStories.map((story: Story) => (story.id === id ? { ...story, hidden: !story.hidden } : story)),
    )
    toast({
      title: "Story visibility updated",
      description: "Your story's visibility has been updated successfully.",
    })
  }

  // Toggle hide post
  const toggleHidePost = (id: string) => {
    setPosts((prevPosts: Post[]) =>
      prevPosts.map((post: Post) => (post.id === id ? { ...post, hidden: !post.hidden } : post)),
    )
    toast({
      title: "Post visibility updated",
      description: "Your post's visibility has been updated successfully.",
    })
  }

  // Get privacy icon
  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return <Globe className="h-3 w-3" />
      case "friends":
        return <Users className="h-3 w-3" />
      case "private":
        return <Lock className="h-3 w-3" />
      default:
        return <Globe className="h-3 w-3" />
    }
  }

  const hiddenStories = stories.filter((story) => story.hidden)
  const hiddenPosts = posts.filter((post) => post.hidden)

  return (
    <div className="space-y-6">
      {/* Hidden Stories Section */}
      {hiddenStories.length > 0 && (
        <div className="bg-[#1a1a1a] border-[#2a2a2a] rounded-lg overflow-hidden p-4 mb-6">
          <h3 className="text-lg font-medium text-white mb-4">Hidden Stories</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {hiddenStories.map((story) => (
              <div key={story.id} className="flex-shrink-0 w-32">
                <div className="relative h-32 w-32 rounded-xl overflow-hidden mb-2">
                  <img
                    src={story.media || "/placeholder.svg"}
                    alt={story.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-black/40 text-white hover:bg-black/60"
                      onClick={() => toggleHideStory(story.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="bg-black/50 rounded-full p-0.5">{getPrivacyIcon(story.privacy)}</div>
                      <p className="text-white text-sm font-medium truncate">{story.title}</p>
                    </div>
                    <p className="text-white/70 text-xs">{story.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden Posts Section */}
      <div className="space-y-6">
        {hiddenPosts.length > 0 ? (
          <>
            <h3 className="text-lg font-medium text-white mb-4">Hidden Posts</h3>
            {hiddenPosts.map((post) => (
              <Card key={post.id} className="bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={userProfile.profileImage} alt={userProfile.name} />
                          <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{userProfile.name}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-gray-400">
                              {userProfile.username} • {post.date}
                            </p>
                            <div className="bg-[#2a2a2a] rounded-full p-0.5">{getPrivacyIcon(post.privacy)}</div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
                        onClick={() => toggleHidePost(post.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Unhide
                      </Button>
                    </div>
                    <p className="text-white mb-4">{post.content}</p>
                  </div>

                  {post.image && (
                    <div className="w-full h-[300px] bg-[#2a2a2a]">
                      <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-4 flex items-center gap-6 border-t border-[#2a2a2a]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-400 hover:text-white"
                    >
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-400 hover:text-white"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments.length}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 text-gray-400 hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <div className="text-center py-12 bg-[#1a1a1a] border-[#2a2a2a] rounded-lg">
            <EyeOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Hidden Content</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Content you hide will appear here. You can hide stories and posts from your profile tabs.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

