"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  Edit,
  EyeOff,
  Trash2,
  Globe,
  Users,
  Lock,
  ChevronDown,
  ChevronUp,
  Check,
  Facebook,
  Twitter,
  Mail,
  Copy,
  X,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

interface Comment {
  id: string
  name: string
  username: string
  content: string
  timestamp: string
}

// Update the Post interface to make image optional
interface Post {
  id: string
  content: string
  image?: string // Make image optional with the ? modifier
  likes: number
  comments: Comment[]
  date: string
  hidden: boolean
  saved: boolean
  privacy: string
  edited?: boolean
}

// Update the SavedPost interface to make image optional
interface SavedPost {
  id: string
  author: string
  authorUsername: string
  content: string
  image?: string // Make image optional with the ? modifier
  likes: number
  comments: Comment[]
  date: string
  privacy: string
  edited?: boolean
}

interface PostsSectionProps {
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  userProfile: {
    name: string
    username: string
    profileImage: string
  }
  savedPosts: SavedPost[]
  setSavedPosts: React.Dispatch<React.SetStateAction<SavedPost[]>>
  activeTab: string
}

export function PostsSection({
  posts,
  setPosts,
  userProfile,
  savedPosts,
  setSavedPosts,
  activeTab,
}: PostsSectionProps) {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [currentSharingPost, setCurrentSharingPost] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isEditPostOpen, setIsEditPostOpen] = useState(false)
  const [currentEditingPost, setCurrentEditingPost] = useState<Post | null>(null)
  const [editedPostContent, setEditedPostContent] = useState("")
  const [editedPostPrivacy, setEditedPostPrivacy] = useState("")

  // Toggle save post
  const toggleSavePost = (postId: string) => {
    setPosts((prevPosts: Post[]) =>
      prevPosts.map((post: Post) => (post.id === postId ? { ...post, saved: !post.saved } : post)),
    )

    const post = posts.find((p) => p.id === postId)
    if (post) {
      toast({
        title: post.saved ? "Post removed from saved" : "Post saved",
        description: post.saved
          ? "The post has been removed from your saved items."
          : "The post has been added to your saved items.",
      })
    }
  }

  // Toggle comments
  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  // Handle share post
  const handleSharePost = (postId: string) => {
    setCurrentSharingPost(postId)
    setShareDialogOpen(true)
  }

  // Handle copy link
  const handleCopyLink = () => {
    const postUrl = `https://cafestory.com/post/${currentSharingPost}`
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

  // Handle share via platform
  const handleShareVia = (platform: string) => {
    const allPosts = [...posts, ...savedPosts]
    const post = allPosts.find((p) => p.id === currentSharingPost)
    if (!post) return

    const postUrl = `https://cafestory.com/post/${currentSharingPost}`
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

  // Handle add comment
  const handleAddComment = (postId: string, isSavedPost = false) => {
    if (!newComment[postId]?.trim()) return

    const comment: Comment = {
      id: uuidv4(),
      name: userProfile.name,
      username: userProfile.username,
      content: newComment[postId],
      timestamp: "Just now",
    }

    if (isSavedPost) {
      setSavedPosts((prevSavedPosts: SavedPost[]) =>
        prevSavedPosts.map((post) =>
          post.id === postId ? { ...post, comments: [comment, ...(post.comments || [])] } : post,
        ),
      )
    } else {
      setPosts((prevPosts: Post[]) =>
        prevPosts.map((post) => (post.id === postId ? { ...post, comments: [comment, ...post.comments] } : post)),
      )
    }

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
  const saveEditedPost = () => {
    if (!currentEditingPost) return

    setPosts((prevPosts: Post[]) =>
      prevPosts.map((post) =>
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
  }

  // Delete post
  const deletePost = (postId: string) => {
    setPosts((prevPosts: Post[]) => prevPosts.filter((post) => post.id !== postId))
    toast({
      title: "Post deleted",
      description: "Your post has been permanently deleted.",
    })
  }

  // Toggle hide post
  const toggleHidePost = (id: string) => {
    setPosts((prevPosts: Post[]) =>
      prevPosts.map((post) => (post.id === id ? { ...post, hidden: !post.hidden } : post)),
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

  // Render post component
  const renderPost = (post: Post | SavedPost, isSavedPost = false) => {
    return (
      <Card key={post.id} className="bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  {isSavedPost ? (
                    <AvatarFallback>{(post as SavedPost).author?.charAt(0) || "U"}</AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={userProfile.profileImage} alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium text-white">
                    {isSavedPost ? (post as SavedPost).author : userProfile.name}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-gray-400">
                      {isSavedPost ? (post as SavedPost).authorUsername : userProfile.username} • {post.date}
                    </p>
                    <div className="bg-[#2a2a2a] rounded-full p-0.5">{getPrivacyIcon(post.privacy)}</div>
                    {post.edited && <span className="text-xs text-gray-400">(edited)</span>}
                  </div>
                </div>
              </div>
              {!isSavedPost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                    <DropdownMenuItem
                      onClick={() => handleEditPost(post as Post)}
                      className="cursor-pointer hover:bg-[#3a3a3a]"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleHidePost(post.id)}
                      className="cursor-pointer hover:bg-[#3a3a3a]"
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#3a3a3a]" />
                    <DropdownMenuItem
                      onClick={() => deletePost(post.id)}
                      className="cursor-pointer text-red-500 hover:bg-[#3a3a3a] hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#3a3a3a]" />
                    <DropdownMenuItem
                      className="flex items-center justify-between cursor-default hover:bg-transparent"
                      disabled
                    >
                      <span className="text-sm text-gray-400">Privacy:</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setPosts((prevPosts: Post[]) =>
                          prevPosts.map((p) => (p.id === post.id ? { ...p, privacy: "public" } : p)),
                        )
                      }}
                      className="cursor-pointer hover:bg-[#3a3a3a]"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Public
                      {post.privacy === "public" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setPosts((prevPosts: Post[]) =>
                          prevPosts.map((p) => (p.id === post.id ? { ...p, privacy: "friends" } : p)),
                        )
                      }}
                      className="cursor-pointer hover:bg-[#3a3a3a]"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Friends Only
                      {post.privacy === "friends" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setPosts((prevPosts: Post[]) =>
                          prevPosts.map((p) => (p.id === post.id ? { ...p, privacy: "private" } : p)),
                        )
                      }}
                      className="cursor-pointer hover:bg-[#3a3a3a]"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Private
                      {post.privacy === "private" && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="text-white mb-4">{post.content}</p>
          </div>

          {post.image && (
            <div className="w-full h-[300px] bg-[#2a2a2a]">
              <img src={post.image || "/placeholder.svg"} alt="Post" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-4 flex items-center gap-6 border-t border-[#2a2a2a]">
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-400 hover:text-white">
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => toggleComments(post.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments?.length || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-400 hover:text-white"
              onClick={() => handleSharePost(post.id)}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            {isSavedPost ? (
              <Button variant="ghost" size="sm" className="flex items-center gap-1 ml-auto text-primary">
                <Bookmark className="h-4 w-4 fill-current" />
                <span>Saved</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ml-auto ${(post as Post).saved ? "text-primary" : "text-gray-400 hover:text-white"}`}
                onClick={() => toggleSavePost(post.id)}
              >
                <Bookmark className={`h-4 w-4 ${(post as Post).saved ? "fill-current" : ""}`} />
                <span>{(post as Post).saved ? "Saved" : "Save"}</span>
              </Button>
            )}
          </div>

          {/* Comments Section */}
          <div className="px-4 pb-4">
            {/* Comment Input */}
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile.profileImage} alt="Your Avatar" />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input
                placeholder="Add a comment..."
                className="flex-1 bg-[#2a2a2a] border-[#3a3a3a] text-white"
                value={newComment[post.id] || ""}
                onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(post.id, isSavedPost)
                  }
                }}
              />
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleAddComment(post.id, isSavedPost)}
                disabled={!newComment[post.id]?.trim()}
              >
                Post
              </Button>
            </div>

            {/* Comments Preview */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-3">
                {/* Show either all comments or just the first two */}
                {(expandedComments[post.id] ? post.comments : post.comments.slice(0, 2)).map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-[#2a2a2a] p-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm text-white">{comment.name}</span>
                          <span className="text-xs text-gray-400">{comment.username}</span>
                        </div>
                        <p className="text-sm mt-1 text-white">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{comment.timestamp}</p>
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
    )
  }

  return (
    <>
      <div className="space-y-6">
        {activeTab === "posts" ? (
          posts.filter((post) => !post.hidden).length > 0 ? (
            posts.filter((post) => !post.hidden).map((post) => renderPost(post))
          ) : (
            <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No posts to display</p>
              </CardContent>
            </Card>
          )
        ) : savedPosts.length > 0 ? (
          savedPosts.map((post) => renderPost(post, true))
        ) : (
          <Card className="bg-[#1a1a1a] border-[#2a2a2a]">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">No saved posts</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Post Dialog */}
      <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Edit Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                value={editedPostContent}
                onChange={(e) => setEditedPostContent(e.target.value)}
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white min-h-[120px]"
                placeholder="Write your post..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-privacy">Privacy</Label>
              <Select value={editedPostPrivacy} onValueChange={setEditedPostPrivacy}>
                <SelectTrigger className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                  <SelectValue placeholder="Select privacy setting" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                  <SelectItem value="public" className="focus:bg-[#3a3a3a] focus:text-white">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <span>Public</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="friends" className="focus:bg-[#3a3a3a] focus:text-white">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Friends Only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="private" className="focus:bg-[#3a3a3a] focus:text-white">
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
            <Button
              variant="outline"
              onClick={() => setIsEditPostOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button
              onClick={saveEditedPost}
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={!editedPostContent.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="flex justify-start items-center gap-3 border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
                onClick={() => handleShareVia("facebook")}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span>Share on Facebook</span>
              </Button>

              <Button
                variant="outline"
                className="flex justify-start items-center gap-3 border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
                onClick={() => handleShareVia("twitter")}
              >
                <Twitter className="h-5 w-5 text-sky-500" />
                <span>Share on Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="flex justify-start items-center gap-3 border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
                onClick={() => handleShareVia("email")}
              >
                <Mail className="h-5 w-5 text-gray-500" />
                <span>Share via Email</span>
              </Button>

              <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#3a3a3a]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1a1a1a] px-2 text-gray-400">Or copy link</span>
                </div>
              </div>

              <div className="flex mt-2">
                <Input
                  readOnly
                  value={`https://cafestory.com/post/${currentSharingPost}`}
                  className="rounded-r-none bg-[#2a2a2a] border-[#3a3a3a] text-white"
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
            <Button
              variant="outline"
              onClick={() => setShareDialogOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

