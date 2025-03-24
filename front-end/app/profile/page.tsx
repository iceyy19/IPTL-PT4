"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  MapPin,
  LinkIcon,
  Edit,
  Grid,
  Bookmark,
  Heart,
  MessageSquare,
  Share2,
  Coffee,
  ImageIcon,
  Camera,
  Upload,
  Eye,
  EyeOff,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Trash2,
  Globe,
  Users,
  Lock,
  Facebook,
  Twitter,
  Mail,
  Copy,
  X,
  Check,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// We also need to import the DropdownMenu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { v4 as uuidv4 } from "uuid"

// Mock data for user profile
const userProfileData = {
  name: "Coffee Lover",
  username: "@coffeelover",
  bio: "Coffee enthusiast | Barista in training | Exploring the world one cup at a time ☕",
  location: "Seattle, WA",
  birthday: "January 15, 1990",
  website: "coffeelover.com",
  joinedDate: "Joined March 2020",
  profileImage: "/images/avatar.jpg",
  coverImage: "/images/coffee-banner.jpg",
  stats: {
    posts: 42,
    followers: 1024,
    following: 256,
  },
}

// Update the mock data to include a hidden field and privacy setting for stories
const userStories = [
  {
    id: "s1",
    title: "Morning Brew",
    media: "/images/coffee-1.jpg",
    date: "2 days ago",
    hidden: false,
    privacy: "public",
  },
  {
    id: "s2",
    title: "Cafe Hopping",
    media: "/images/coffee-2.jpg",
    date: "1 week ago",
    hidden: false,
    privacy: "friends",
  },
  {
    id: "s3",
    title: "Latte Art",
    media: "/images/coffee-3.jpg",
    date: "2 weeks ago",
    hidden: false,
    privacy: "public",
  },
  // Add a hidden story
  {
    id: "s4",
    title: "Coffee Beans",
    media: "/images/coffee-5.jpg",
    date: "3 weeks ago",
    hidden: true,
    privacy: "public",
  },
]

// Update the mock data for posts to include comments, privacy settings, etc.
const userPosts = [
  {
    id: "p1",
    content: "Just discovered this amazing coffee shop downtown. Their pour-over is absolutely divine! ☕️ #CoffeeLover",
    image: "/images/coffee-post-1.jpg",
    likes: 24,
    comments: [
      {
        id: "c1",
        name: "James Rodriguez",
        username: "@coffee_james",
        content: "I need to check this place out! Where is it located?",
        timestamp: "1 hour ago",
      },
      {
        id: "c2",
        name: "Sophia Chen",
        username: "@sophia_latte",
        content: "Their pastries are amazing too! Try the almond croissant next time.",
        timestamp: "2 hours ago",
      },
      {
        id: "c3",
        name: "Michael Brown",
        username: "@mike_espresso",
        content: "I've been going there for months. Best coffee in town!",
        timestamp: "3 hours ago",
      },
    ],
    date: "2 days ago",
    hidden: false,
    saved: false,
    privacy: "public",
  },
  {
    id: "p2",
    content:
      "Morning ritual: freshly ground beans, my favorite mug, and a moment of peace before the day begins. What's your coffee routine?",
    image: "/images/coffee-post-2.jpg",
    likes: 18,
    comments: [
      {
        id: "c4",
        name: "Emma Wilson",
        username: "@emma_coffee",
        content: "I love starting my day with a French press! So meditative.",
        timestamp: "30 minutes ago",
      },
      {
        id: "c5",
        name: "Alex Martinez",
        username: "@alex_barista",
        content: "Pour-over with light roast beans is my go-to morning ritual.",
        timestamp: "1 hour ago",
      },
    ],
    date: "1 week ago",
    hidden: false,
    saved: false,
    privacy: "friends",
  },
  {
    id: "p3",
    content:
      "Experimenting with a new cold brew recipe today. Added a hint of vanilla and cinnamon. The result? Absolutely delicious!",
    image: "/images/coffee-3.jpg",
    likes: 32,
    comments: [
      {
        id: "c6",
        name: "Jessica Kim",
        username: "@jessica_mocha",
        content: "I need this recipe! Sounds amazing.",
        timestamp: "2 hours ago",
      },
    ],
    date: "2 weeks ago",
    hidden: false,
    saved: true,
    privacy: "public",
  },
  // Add a hidden post
  {
    id: "p4",
    content: "My secret coffee stash at home. Don't tell anyone where I keep the good beans!",
    image: "/images/coffee-4.jpg",
    likes: 12,
    comments: [],
    date: "1 month ago",
    hidden: true,
    saved: false,
    privacy: "private",
  },
]

// Mock data for saved posts
const savedPosts = [
  {
    id: "sp1",
    author: "LatteLover88",
    authorUsername: "@lattelover",
    content: "Trying out a new latte recipe with oat milk. It's surprisingly good!",
    image: "/images/coffee-post-1.jpg",
    likes: 21,
    comments: [
      {
        id: "sc1",
        name: "Coffee Lover",
        username: "@coffeelover",
        content: "I've been meaning to try oat milk! Is it better than almond?",
        timestamp: "1 day ago",
      },
    ],
    date: "3 days ago",
    privacy: "public",
  },
  {
    id: "sp2",
    author: "EspressoFanatic",
    authorUsername: "@espressofan",
    content: "Just got a new espresso machine and I'm in love! The crema is perfect.",
    image: "/images/coffee-post-2.jpg",
    likes: 35,
    comments: [],
    date: "1 week ago",
    privacy: "public",
  },
]

// Now update the component to include all the requested features
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [userProfile, setUserProfile] = useState(userProfileData)
  const [stories, setStories] = useState(userStories)
  const [posts, setPosts] = useState(userPosts)
  const [savedPostsList, setSavedPostsList] = useState(savedPosts)

  // State for edit profile dialog
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)

  // State for profile picture and cover photo editing
  const [isEditProfilePicOpen, setIsEditProfilePicOpen] = useState(false)
  const [isEditCoverPhotoOpen, setIsEditCoverPhotoOpen] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState(userProfile.profileImage)
  const [coverImagePreview, setCoverImagePreview] = useState(userProfile.coverImage)

  // State for comments, sharing, and editing
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [currentSharingPost, setCurrentSharingPost] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  const [isEditPostOpen, setIsEditPostOpen] = useState(false)
  const [currentEditingPost, setCurrentEditingPost] = useState<any>(null)
  const [editedPostContent, setEditedPostContent] = useState("")
  const [editedPostPrivacy, setEditedPostPrivacy] = useState("")
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false)
  const [newStory, setNewStory] = useState({
    title: "",
    privacy: "public",
    media: null as string | null,
  })

  // Refs for file inputs
  const profilePicInputRef = useRef<HTMLInputElement>(null)
  const coverPhotoInputRef = useRef<HTMLInputElement>(null)
  const storyMediaInputRef = useRef<HTMLInputElement>(null)

  // Handle profile edit form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle profile picture change
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle cover photo change
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle story media change
  const handleStoryMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setNewStory((prev) => ({
          ...prev,
          media: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Save profile changes
  const saveProfileChanges = () => {
    setUserProfile(editedProfile)
    setIsEditProfileOpen(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  // Save profile picture
  const saveProfilePicture = () => {
    setUserProfile((prev) => ({
      ...prev,
      profileImage: profileImagePreview,
    }))
    setIsEditProfilePicOpen(false)
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been successfully updated.",
    })
  }

  // Save cover photo
  const saveCoverPhoto = () => {
    setUserProfile((prev) => ({
      ...prev,
      coverImage: coverImagePreview,
    }))
    setIsEditCoverPhotoOpen(false)
    toast({
      title: "Cover photo updated",
      description: "Your cover photo has been successfully updated.",
    })
  }

  // Toggle hide story
  const toggleHideStory = (id: string) => {
    setStories((prevStories) =>
      prevStories.map((story) => (story.id === id ? { ...story, hidden: !story.hidden } : story)),
    )
    toast({
      title: "Story visibility updated",
      description: "Your story's visibility has been updated successfully.",
    })
  }

  // Toggle hide post
  const toggleHidePost = (id: string) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === id ? { ...post, hidden: !post.hidden } : post)))
    toast({
      title: "Post visibility updated",
      description: "Your post's visibility has been updated successfully.",
    })
  }

  // Toggle save post
  const toggleSavePost = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, saved: !post.saved } : post)))

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
    const post = [...posts, ...savedPostsList].find((p) => p.id === currentSharingPost)
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

    const comment = {
      id: uuidv4(),
      name: "Coffee Lover",
      username: "@coffeelover",
      content: newComment[postId],
      timestamp: "Just now",
    }

    if (isSavedPost) {
      setSavedPostsList(
        savedPostsList.map((post) =>
          post.id === postId ? { ...post, comments: [comment, ...(post.comments || [])] } : post,
        ),
      )
    } else {
      setPosts(
        posts.map((post) => (post.id === postId ? { ...post, comments: [comment, ...(post.comments || [])] } : post)),
      )
    }

    setNewComment((prev) => ({
      ...prev,
      [postId]: "",
    }))
  }

  // Handle edit post
  const handleEditPost = (post: any) => {
    setCurrentEditingPost(post)
    setEditedPostContent(post.content)
    setEditedPostPrivacy(post.privacy)
    setIsEditPostOpen(true)
  }

  // Save edited post
  const saveEditedPost = () => {
    if (!currentEditingPost) return

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
  }

  // Delete post
  const deletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
    toast({
      title: "Post deleted",
      description: "Your post has been permanently deleted.",
    })
  }

  // Create new story
  const handleCreateStory = () => {
    if (!newStory.title || !newStory.media) return

    const story = {
      id: uuidv4(),
      title: newStory.title,
      media: newStory.media,
      date: "Just now",
      hidden: false,
      privacy: newStory.privacy,
    }

    setStories([story, ...stories])
    setNewStory({
      title: "",
      privacy: "public",
      media: null,
    })
    setIsCreateStoryOpen(false)

    toast({
      title: "Story created",
      description: "Your story has been successfully created.",
    })
  }

  // Update story privacy
  const updateStoryPrivacy = (storyId: string, privacy: string) => {
    setStories(stories.map((story) => (story.id === storyId ? { ...story, privacy } : story)))

    toast({
      title: "Privacy updated",
      description: `Story is now ${privacy === "public" ? "visible to everyone" : privacy === "friends" ? "visible to friends only" : "private"}.`,
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

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 pb-20">
        {/* Cover Photo */}
        <div className="relative h-60 md:h-80 -mx-4 mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${userProfile.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-4 md:left-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-black">
                <AvatarImage src={userProfile.profileImage} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-primary text-white hover:bg-primary/90 border-black"
                onClick={() => setIsEditProfilePicOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Edit Cover Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 bg-black/50 text-white border-white/20 hover:bg-black/70"
            onClick={() => setIsEditCoverPhotoOpen(true)}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Edit Cover
          </Button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
            <p className="text-gray-400">{userProfile.username}</p>
            <p className="text-white mt-4 max-w-md">{userProfile.bio}</p>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{userProfile.location}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <LinkIcon className="h-4 w-4 mr-1" />
                <a href={`https://${userProfile.website}`} className="text-sm text-primary hover:underline">
                  {userProfile.website}
                </a>
              </div>
              <div className="flex items-center text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">Born {userProfile.birthday}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Coffee className="h-4 w-4 mr-1" />
                <span className="text-sm">{userProfile.joinedDate}</span>
              </div>
            </div>

            <div className="flex gap-6 mt-4">
              <div>
                <span className="font-bold text-white">{userProfile.stats.posts}</span>{" "}
                <span className="text-gray-400">Posts</span>
              </div>
              <div>
                <span className="font-bold text-white">{userProfile.stats.followers}</span>{" "}
                <span className="text-gray-400">Followers</span>
              </div>
              <div>
                <span className="font-bold text-white">{userProfile.stats.following}</span>{" "}
                <span className="text-gray-400">Following</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setIsEditProfileOpen(true)}>
              Edit Profile
            </Button>
            <Button variant="outline" className="border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
              Share Profile
            </Button>
          </div>
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Stories</h2>
            <Button
              variant="outline"
              className="border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
              onClick={() => setIsCreateStoryOpen(true)}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Create Story
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {stories
              .filter((story) => !story.hidden)
              .map((story) => (
                <div key={story.id} className="flex-shrink-0 w-32">
                  <div className="relative h-32 w-32 rounded-xl overflow-hidden mb-2">
                    <img
                      src={story.media || "/placeholder.svg"}
                      alt={story.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-black/40 text-white hover:bg-black/60"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#2a2a2a] border-[#3a3a3a] text-white">
                          <DropdownMenuItem
                            onClick={() => toggleHideStory(story.id)}
                            className="cursor-pointer hover:bg-[#3a3a3a]"
                          >
                            <EyeOff className="h-4 w-4 mr-2" />
                            Hide Story
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#3a3a3a]" />
                          <DropdownMenuItem
                            className="flex items-center justify-between cursor-default hover:bg-transparent"
                            disabled
                          >
                            <span className="text-sm text-gray-400">Privacy:</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStoryPrivacy(story.id, "public")}
                            className="cursor-pointer hover:bg-[#3a3a3a]"
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            Public
                            {story.privacy === "public" && <Check className="h-4 w-4 ml-2" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStoryPrivacy(story.id, "friends")}
                            className="cursor-pointer hover:bg-[#3a3a3a]"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Friends Only
                            {story.privacy === "friends" && <Check className="h-4 w-4 ml-2" />}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStoryPrivacy(story.id, "private")}
                            className="cursor-pointer hover:bg-[#3a3a3a]"
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Private
                            {story.privacy === "private" && <Check className="h-4 w-4 ml-2" />}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
            <div
              className="flex-shrink-0 w-32 h-32 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors border-2 border-dashed border-[#4a4a4a]"
              onClick={() => setIsCreateStoryOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-400">New Story</p>
            </div>
          </div>
        </div>

        {/* Tabs for Posts and Saved */}
        <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-[#2a2a2a]">
            <TabsTrigger value="posts" className="data-[state=active]:bg-[#3a3a3a]">
              <Grid className="h-4 w-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-[#3a3a3a]">
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          {/* TabsContent for Posts */}
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-6">
              {posts
                .filter((post) => !post.hidden)
                .map((post) => (
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
                                {post.edited && <span className="text-xs text-gray-400">(edited)</span>}
                              </div>
                            </div>
                          </div>
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
                                onClick={() => handleEditPost(post)}
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
                                  setPosts(posts.map((p) => (p.id === post.id ? { ...p, privacy: "public" } : p)))
                                }}
                                className="cursor-pointer hover:bg-[#3a3a3a]"
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                Public
                                {post.privacy === "public" && <Check className="h-4 w-4 ml-2" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setPosts(posts.map((p) => (p.id === post.id ? { ...p, privacy: "friends" } : p)))
                                }}
                                className="cursor-pointer hover:bg-[#3a3a3a]"
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Friends Only
                                {post.privacy === "friends" && <Check className="h-4 w-4 ml-2" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setPosts(posts.map((p) => (p.id === post.id ? { ...p, privacy: "private" } : p)))
                                }}
                                className="cursor-pointer hover:bg-[#3a3a3a]"
                              >
                                <Lock className="h-4 w-4 mr-2" />
                                Private
                                {post.privacy === "private" && <Check className="h-4 w-4 ml-2" />}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-white mb-4">{post.content}</p>
                      </div>

                      {post.image && (
                        <div className="w-full h-[300px] bg-[#2a2a2a]">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt="Post"
                            className="w-full h-full object-cover"
                          />
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
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{post.comments.length}</span>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`flex items-center gap-1 ml-auto ${post.saved ? "text-primary" : "text-gray-400 hover:text-white"}`}
                          onClick={() => toggleSavePost(post.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${post.saved ? "fill-current" : ""}`} />
                          <span>{post.saved ? "Saved" : "Save"}</span>
                        </Button>
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
                ))}
            </div>
          </TabsContent>

          {/* TabsContent for Saved */}
          <TabsContent value="saved" className="mt-6">
            <div className="space-y-6">
              {savedPostsList.map((post) => (
                <Card key={post.id} className="bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{post.author}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-gray-400">
                              {post.authorUsername} • {post.date}
                            </p>
                            <div className="bg-[#2a2a2a] rounded-full p-0.5">{getPrivacyIcon(post.privacy)}</div>
                          </div>
                        </div>
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
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 ml-auto text-primary">
                        <Bookmark className="h-4 w-4 fill-current" />
                        <span>Saved</span>
                      </Button>
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
                              handleAddComment(post.id, true)
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleAddComment(post.id, true)}
                          disabled={!newComment[post.id]?.trim()}
                        >
                          Post
                        </Button>
                      </div>

                      {/* Comments Preview */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3">
                          {/* Show either all comments or just the first two */}
                          {(expandedComments[post.id] ? post.comments : post.comments.slice(0, 2)).map((comment) => (
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
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Hidden Content Section - Accessible by clicking on profile name */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Hidden Content</h2>
            <Button variant="outline" className="border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
              <EyeOff className="h-4 w-4 mr-2" />
              Manage Hidden Content
            </Button>
          </div>

          {/* Hidden Stories Section */}
          {stories.filter((story) => story.hidden).length > 0 && (
            <div className="bg-[#1a1a1a] border-[#2a2a2a] rounded-lg overflow-hidden p-4 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Hidden Stories</h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {stories
                  .filter((story) => story.hidden)
                  .map((story) => (
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
            {posts.filter((post) => post.hidden).length > 0 ? (
              <>
                <h3 className="text-lg font-medium text-white mb-4">Hidden Posts</h3>
                {posts
                  .filter((post) => post.hidden)
                  .map((post) => (
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
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt="Post"
                              className="w-full h-full object-cover"
                            />
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
      </main>
      <Footer />

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={editedProfile.name}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={editedProfile.username}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={editedProfile.bio}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={editedProfile.location}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthday" className="text-right">
                Birthday
              </Label>
              <Input
                id="birthday"
                name="birthday"
                value={editedProfile.birthday}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={editedProfile.website}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProfileOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button onClick={saveProfileChanges} className="bg-primary hover:bg-primary/90 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Picture Dialog */}
      <Dialog open={isEditProfilePicOpen} onOpenChange={setIsEditProfilePicOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative mb-6">
              <Avatar className="h-40 w-40">
                <AvatarImage src={profileImagePreview} alt="Profile Preview" />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-primary text-white hover:bg-primary/90 border-[#1a1a1a]"
                onClick={() => profilePicInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <input
              type="file"
              ref={profilePicInputRef}
              onChange={handleProfilePicChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a] mb-2"
              onClick={() => profilePicInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Picture
            </Button>
            <p className="text-xs text-gray-400 text-center">Recommended: Square image, at least 400x400 pixels</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProfilePicOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button onClick={saveProfilePicture} className="bg-primary hover:bg-primary/90 text-white">
              Save Picture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Cover Photo Dialog */}
      <Dialog open={isEditCoverPhotoOpen} onOpenChange={setIsEditCoverPhotoOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Change Cover Photo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImagePreview})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                  onClick={() => coverPhotoInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Change Cover
                </Button>
              </div>
            </div>
            <input
              type="file"
              ref={coverPhotoInputRef}
              onChange={handleCoverPhotoChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a] mb-2"
              onClick={() => coverPhotoInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Cover Photo
            </Button>
            <p className="text-xs text-gray-400 text-center">Recommended: 1500x500 pixels, JPG or PNG format</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCoverPhotoOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button onClick={saveCoverPhoto} className="bg-primary hover:bg-primary/90 text-white">
              Save Cover Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* Create Story Dialog */}
      <Dialog open={isCreateStoryOpen} onOpenChange={setIsCreateStoryOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Create Story</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="story-title">Title</Label>
              <Input
                id="story-title"
                value={newStory.title}
                onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                className="bg-[#2a2a2a] border-[#3a3a3a] text-white"
                placeholder="Enter a title for your story"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="story-privacy">Privacy</Label>
              <Select value={newStory.privacy} onValueChange={(value) => setNewStory({ ...newStory, privacy: value })}>
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

            <div className="space-y-2">
              <Label>Media</Label>
              {newStory.media ? (
                <div className="relative rounded-lg overflow-hidden h-48">
                  <img
                    src={newStory.media || "/placeholder.svg"}
                    alt="Story preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                      onClick={() => storyMediaInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer rounded-lg bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors border-2 border-dashed border-[#4a4a4a] h-48"
                  onClick={() => storyMediaInputRef.current?.click()}
                >
                  <div className="w-12 h-12 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">Click to upload an image</p>
                </div>
              )}
              <input
                type="file"
                ref={storyMediaInputRef}
                onChange={handleStoryMediaChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateStoryOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateStory}
              className="bg-primary hover:bg-primary/90 text-white"
              disabled={!newStory.title || !newStory.media}
            >
              Create Story
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
    </div>
  )
}

