"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, Bookmark, EyeOff } from "lucide-react"

// Import our components
import { ProfileHeader } from "@/components/profile/profile-header"
import { StoriesSection } from "@/components/profile/stories-section"
import { PostsSection } from "@/components/profile/posts-section"
import { HiddenContent } from "@/components/profile/hidden-content"

// Define interfaces for our data
interface Story {
  id: string
  title: string
  media: string
  date: string
  hidden: boolean
  privacy: string
}

interface Comment {
  id: string
  name: string
  username: string
  content: string
  timestamp: string
}

interface Post {
  id: string
  content: string
  image?: string
  likes: number
  comments: Comment[]
  date: string
  hidden: boolean
  saved: boolean
  privacy: string
  edited?: boolean
}

interface SavedPost {
  id: string
  author: string
  authorUsername: string
  content: string
  image?: string
  likes: number
  comments: Comment[]
  date: string
  privacy: string
  edited?: boolean
}

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
const userStories: Story[] = [
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
const userPosts: Post[] = [
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
const savedPosts: SavedPost[] = [
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [userProfile, setUserProfile] = useState(userProfileData)
  const [stories, setStories] = useState(userStories)
  const [posts, setPosts] = useState(userPosts)
  const [savedPostsList, setSavedPostsList] = useState(savedPosts)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 pb-20">
        {/* Profile Header Component */}
        <ProfileHeader userProfile={userProfile} setUserProfile={setUserProfile} />

        {/* Stories Section Component */}
        <StoriesSection stories={stories} setStories={setStories} userProfile={userProfile} />

        {/* Tabs for Posts and Saved */}
        <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-[#2a2a2a]">
            <TabsTrigger value="posts" className="data-[state=active]:bg-[#3a3a3a]">
              <Grid className="h-4 w-4 mr-2" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-[#3a3a3a]">
              <Bookmark className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
            <TabsTrigger value="hidden" className="data-[state=active]:bg-[#3a3a3a]">
              <EyeOff className="h-4 w-4 mr-2" />
              Hidden
            </TabsTrigger>
          </TabsList>

          {/* Posts Section Component */}
          <TabsContent value="posts" className="mt-6">
            <PostsSection
              posts={posts}
              setPosts={setPosts}
              userProfile={userProfile}
              savedPosts={savedPostsList}
              setSavedPosts={setSavedPostsList}
              activeTab="posts"
            />
          </TabsContent>

          {/* Saved Posts Section */}
          <TabsContent value="saved" className="mt-6">
            <PostsSection
              posts={posts}
              setPosts={setPosts}
              userProfile={userProfile}
              savedPosts={savedPostsList}
              setSavedPosts={setSavedPostsList}
              activeTab="saved"
            />
          </TabsContent>
          <TabsContent value="hidden" className="mt-6">
            <HiddenContent
              stories={stories}
              setStories={setStories}
              posts={posts}
              setPosts={setPosts}
              userProfile={userProfile}
            />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

