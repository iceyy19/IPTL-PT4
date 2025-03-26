"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Mail,
  Copy,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  MoreHorizontal,
  Edit,
  Trash2,
  Globe,
  Users,
  Lock,
  Loader2,
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useUser } from "../context/UserContext"
import { useUserProfile } from "@/hooks/useUserProfile"

// Define Post and Comment types
interface Comment {
  id: string
  name: string
  username: string
  content: string
  timestamp: string | Date
}

interface Post {
  id: string
  name: string
  username: string
  content: string
  image?: string | null
  likes: number
  comments: Comment[]
  timestamp: string | Date
  savedBy?: string[]
  privacy: "public" | "friends" | "private"
  edited: boolean
  _id?: string // MongoDB ID
}

export function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [currentSharingPost, setCurrentSharingPost] = useState<string | null>(null)
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [copySuccess, setCopySuccess] = useState(false)
  const [postPrivacy, setPostPrivacy] = useState<"public" | "friends" | "private">("public")
  const [isEditPostOpen, setIsEditPostOpen] = useState(false)
  const [currentEditingPost, setCurrentEditingPost] = useState<Post | null>(null)
  const [editedPostContent, setEditedPostContent] = useState("")
  const [editedPostPrivacy, setEditedPostPrivacy] = useState<"public" | "friends" | "private">("public")
  const [submitting, setSubmitting] = useState(false)
  const { username } = useUser()
  const { profile } = useUserProfile(username)
  const [userProfile, setUserProfile] = useState(
    profile || {
      name: "Guest",
      username: "guest",
      bio: "Welcome to my profile!",
      location: "Unknown",
      birthday: "N/A",
      website: "N/A",
      joinedDate: "N/A",
      profileImage: "/images/avatar.jpg",
      coverImage: "/images/coffee-banner.jpg",
      stats: {
        posts: 0,
        followers: 0,
        following: 0,
      },
    },
  )

  useEffect(() => {
    if (profile) {
      setUserProfile(profile) // Update userProfile when profile is fetched
    }
  }, [profile])

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/posts")

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`)
        }

        const data = await response.json()

        // Transform data to match our component's expected format
        const formattedPosts: Post[] = data.map((post: any) => ({
          id: post.id,
          _id: post._id,
          name: post.name,
          username: post.username,
          content: post.content,
          image: post.image || null,
          likes: post.likes || 0,
          comments: post.comments || [],
          timestamp: formatTimestamp(post.timestamp),
          privacy: post.privacy || "public",
          edited: post.edited || false,
          savedBy: post.savedBy || [],
        }))

        setPosts(formattedPosts)
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError(err instanceof Error ? err.message : "Failed to load posts")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Format timestamp helper
  const formatTimestamp = (timestamp: string | Date) => {
    if (!timestamp) return "Just now"

    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`

    return date.toLocaleDateString()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePostSubmit = async () => {
    if (!content.trim() || submitting) return

    try {
      setSubmitting(true)

      const newPost = {
        id: uuidv4(),
        name: userProfile.name, // Fixed user name
        username: username, // Fixed username
        content,
        image,
        privacy: postPrivacy,
      }

      // Send post to API
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      })

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.status}`)
      }

      const savedPost = await response.json()

      // Format the post for our UI
      const formattedPost: Post = {
        id: savedPost.post.id,
        _id: savedPost.post._id,
        name: savedPost.post.name,
        username: savedPost.post.username,
        content: savedPost.post.content,
        image: savedPost.post.image || null,
        likes: savedPost.post.likes || 0,
        comments: savedPost.post.comments || [],
        timestamp: formatTimestamp(savedPost.post.timestamp),
        privacy: savedPost.post.privacy || "public",
        edited: savedPost.post.edited || false,
      }

      // Add to local state
      setPosts([formattedPost, ...posts])

      // Reset form
      setContent("")
      setImage(null)
      setPostPrivacy("public")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast({
        title: "Post created",
        description: "Your post has been successfully created.",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleSavePost = (postId: string) => {
    // In a real app, you would call an API to save/unsave the post
    // For now, we'll just update the UI
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const isSaved = post.savedBy?.includes(username)
          return {
            ...post,
            savedBy: isSaved ? post.savedBy?.filter((u) => u !== username) || [] : [...(post.savedBy || []), username],
          }
        }
        return post
      }),
    )

    const post = posts.find((p) => p.id === postId)
    if (post) {
      const isSaved = post.savedBy?.includes(username)
      toast({
        title: isSaved ? "Post removed from saved" : "Post saved",
        description: isSaved
          ? "The post has been removed from your saved items."
          : "The post has been added to your saved items.",
      })
    }
  }

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const handleSharePost = (postId: string) => {
    setCurrentSharingPost(postId)
    setShareDialogOpen(true)
  }

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${currentSharingPost}`
    navigator.clipboard.writeText(postUrl)
    setCopySuccess(true)

    setTimeout(() => {
      setCopySuccess(false)
    }, 2000)

    toast({
      title: "Link copied",
      description: "Post link has been copied to clipboard.",
    })
  }

  const handleShareVia = (platform: string) => {
    const post = posts.find((p) => p.id === currentSharingPost)
    if (!post) return

    const postUrl = `${window.location.origin}/post/${currentSharingPost}`
    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}&url=${encodeURIComponent(postUrl)}`
        break
      case "email":
        shareUrl = `mailto:?subject=Check out this coffee post&body=${encodeURIComponent(post.content + "\n\n" + postUrl)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }

    setShareDialogOpen(false)
  }

  const handleAddComment = async (postId: string) => {
    if (!newComment[postId]?.trim()) return

    // In a real app, you would call an API to add the comment
    // For now, we'll just update the UI
    const comment = {
      id: uuidv4(),
      name: "Coffee Lover",
      username: "@coffeelover",
      content: newComment[postId],
      timestamp: "Just now",
    }

    setPosts(posts.map((post) => (post.id === postId ? { ...post, comments: [comment, ...post.comments] } : post)))

    setNewComment((prev) => ({
      ...prev,
      [postId]: "",
    }))
  }

  // Handle edit post
  const handleEditPost = (post: Post) => {
    setCurrentEditingPost(post)
    setEditedPostContent(post.content)
    setEditedPostPrivacy(post.privacy)
    setIsEditPostOpen(true)
  }

  // Save edited post
  const saveEditedPost = async () => {
    if (!currentEditingPost || submitting) return

    try {
      setSubmitting(true)

      // In a real app, you would call an API to update the post
      // For now, we'll just update the UI
      setPosts(
        posts.map((post) =>
          post.id === currentEditingPost.id
            ? {
                ...post,
                content: editedPostContent,
                privacy: editedPostPrivacy,
                edited: true,
              }
            : post,
        ),
      )

      setIsEditPostOpen(false)
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      })
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Delete post
  const deletePost = async (postId: string) => {
    try {
      // In a real app, you would call an API to delete the post
      // For now, we'll just update the UI
      setPosts(posts.filter((post) => post.id !== postId))
      toast({
        title: "Post deleted",
        description: "Your post has been permanently deleted.",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
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

  // Check if a post is saved by the current user
  const isPostSaved = (post: Post) => {
    return post.savedBy?.includes(username) || false
  }

  return (
    <section className="py-8 mx-auto" style={{ width: "75%" }}>
      <h2 className="text-2xl font-bold mb-6">Coffee Stories</h2>

      {/* Create Post Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Share Your Coffee Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src="/images/avatar.jpg" alt="Your Avatar" />
              <AvatarFallback>CL</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{userProfile.name}</p>
              <p className="text-xs text-muted-foreground">{"@" + username}</p>
            </div>
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
            <Label htmlFor="privacy">Privacy</Label>
            <Select
              value={postPrivacy}
              onValueChange={(value: "public" | "friends" | "private") => setPostPrivacy(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select privacy setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Friends Only</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
              <div className="w-full bg-muted">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-auto object-contain max-h-[400px]"
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

          <Button onClick={handlePostSubmit} disabled={!content.trim() || submitting} className="w-full sm:w-auto">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Story"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-6 text-center text-destructive">{error}</CardContent>
          </Card>
        ) : posts.length === 0 ? (
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
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{post.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.name}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-xs text-muted-foreground">
                            {post.username} •{" "}
                            {typeof post.timestamp === "string" ? post.timestamp : formatTimestamp(post.timestamp)}
                          </p>
                          <div className="bg-muted rounded-full p-0.5">{getPrivacyIcon(post.privacy)}</div>
                          {post.edited && <span className="text-xs text-muted-foreground">(edited)</span>}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {post.username === username && (
                          <>
                            <DropdownMenuItem onClick={() => handleEditPost(post)} className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Post
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deletePost(post.id)}
                              className="cursor-pointer text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Post
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem className="flex items-center justify-between cursor-default" disabled>
                          <span className="text-sm text-muted-foreground">Privacy:</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPosts(posts.map((p) => (p.id === post.id ? { ...p, privacy: "public" } : p)))
                          }}
                          className="cursor-pointer"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Public
                          {post.privacy === "public" && <Check className="h-4 w-4 ml-2" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPosts(posts.map((p) => (p.id === post.id ? { ...p, privacy: "friends" } : p)))
                          }}
                          className="cursor-pointer"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Friends Only
                          {post.privacy === "friends" && <Check className="h-4 w-4 ml-2" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setPosts(posts.map((p) => (p.id === post.id ? { ...p, privacy: "private" } : p)))
                          }}
                          className="cursor-pointer"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Private
                          {post.privacy === "private" && <Check className="h-4 w-4 ml-2" />}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="mb-4">{post.content}</p>
                </div>

                {post.image && (
                  <div className="w-full bg-muted">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={`Post by ${post.name}`}
                      className="w-full h-auto object-contain max-h-[500px]"
                    />
                  </div>
                )}

                <div className="p-4 flex items-center gap-6 border-t">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments.length}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleSharePost(post.id)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 ml-auto ${isPostSaved(post) ? "text-primary" : ""}`}
                    onClick={() => toggleSavePost(post.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${isPostSaved(post) ? "fill-current" : ""}`} />
                    <span>{isPostSaved(post) ? "Saved" : "Save"}</span>
                  </Button>
                </div>

                {/* Comments Section */}
                <div className="px-4 pb-4">
                  {/* Comment Input */}
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/images/avatar.jpg" alt="Your Avatar" />
                      <AvatarFallback>CL</AvatarFallback>
                    </Avatar>
                    <Input
                      placeholder="Add a comment..."
                      className="flex-1"
                      value={newComment[post.id] || ""}
                      onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(post.id)
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                    >
                      Post
                    </Button>
                  </div>

                  {/* Comments Preview */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3">
                      {/* Show either all comments or just the first two */}
                      {(expandedComments[post.id] ? post.comments : post.comments.slice(0, 2)).map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted p-2 rounded-lg">
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-sm">{comment.name}</span>
                                <span className="text-xs text-muted-foreground">{comment.username}</span>
                              </div>
                              <p className="text-sm mt-1">{comment.content}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {typeof comment.timestamp === "string"
                                ? comment.timestamp
                                : formatTimestamp(comment.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Show/Hide Comments Button */}
                      {post.comments.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary/90 hover:bg-primary/10 w-full mt-2"
                          onClick={() => toggleComments(post.id)}
                        >
                          {expandedComments[post.id] ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              View all {post.comments.length} comments
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="flex justify-start items-center gap-3"
                onClick={() => handleShareVia("facebook")}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span>Share on Facebook</span>
              </Button>

              <Button
                variant="outline"
                className="flex justify-start items-center gap-3"
                onClick={() => handleShareVia("twitter")}
              >
                <Twitter className="h-5 w-5 text-sky-500" />
                <span>Share on Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="flex justify-start items-center gap-3"
                onClick={() => handleShareVia("email")}
              >
                <Mail className="h-5 w-5 text-gray-500" />
                <span>Share via Email</span>
              </Button>

              <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or copy link</span>
                </div>
              </div>

              <div className="flex mt-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/post/${currentSharingPost}`}
                  className="rounded-r-none"
                />
                <Button
                  className={`rounded-l-none ${copySuccess ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}`}
                  onClick={handleCopyLink}
                >
                  {copySuccess ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                value={editedPostContent}
                onChange={(e) => setEditedPostContent(e.target.value)}
                className="min-h-[120px]"
                placeholder="Write your post..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-privacy">Privacy</Label>
              <Select
                value={editedPostPrivacy}
                onValueChange={(value: "public" | "friends" | "private") => setEditedPostPrivacy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select privacy setting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Public</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Friends Only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Private</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPostOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveEditedPost}
              className="bg-primary hover:bg-primary/90"
              disabled={!editedPostContent.trim() || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

