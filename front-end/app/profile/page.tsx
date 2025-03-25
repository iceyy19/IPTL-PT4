"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, Bookmark, EyeOff } from "lucide-react"
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUser } from "@/context/UserContext";

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();  
    const { username } = useUser();
    const { profile, loading, error } = useUserProfile(username);
    const [activeTab, setActiveTab] = useState("posts") 
    const [stories, setStories] = useState(userStories)
    const [posts, setPosts] = useState(userPosts)
    const [savedPostsList, setSavedPostsList] = useState(savedPosts)
    const [userProfile, setUserProfile] = useState(profile || {
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
      });

      useEffect(() => {
        const validateSession = async () => {
        const sessionId = localStorage.getItem("sessionId");
      
          if (!sessionId) {
            console.log("No session found, redirecting to login...");
            router.push("/login");
            return;
          }
      
          try {
            const response = await fetch("/api/validate-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sessionId }),
            });
      
            if (response.ok) {
              console.log("Session is valid");
              setIsAuthenticated(true);
            } else {
              console.error("Invalid session, redirecting to login...");
              localStorage.removeItem("sessionId");
              router.push("/login");
            }
          } catch (error) {
            console.error("Error validating session:", error);
            localStorage.removeItem("sessionId");
            router.push("/login");
          }
        };
      
        validateSession();
      }, [router]);

      useEffect(() => {
        if (profile) {
          setUserProfile(profile); // Update userProfile when profile is fetched
        }
      }, [profile]);
  
    if (!isAuthenticated) {
        // Redirecting or showing a fallback if the user is not authenticated
        return null; // Prevent rendering if the user is not authenticated
    }

    if (loading) {
        return <div>Loading...</div>; // Show a loading state while fetching data
        }
        
    if (error) {
    return <div>Error: {error}</div>; // Show an error message if fetching fails
    }

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

