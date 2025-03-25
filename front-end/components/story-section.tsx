"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StoryCreator } from "@/components/story-creator"
import { StoryViewer } from "@/components/story-viewer"
import { ChevronLeft, ChevronRight, Plus, Globe, Users, Lock, Eye } from "lucide-react"

// Update the mockStories to include views and likes
const mockStories = [
  {
    id: "1",
    title: "Morning Brew",
    media: "/images/coffee-1.jpg",
    type: "image",
    username: "@emma_coffee",
    privacy: "public",
    views: 124,
    viewers: [
      { id: "v1", name: "James Rodriguez", username: "@coffee_james", avatar: "/images/avatar-2.jpg", time: "2h ago" },
      { id: "v2", name: "Sophia Chen", username: "@sophia_latte", avatar: "/images/avatar-3.jpg", time: "1h ago" },
      { id: "v3", name: "Michael Brown", username: "@mike_espresso", avatar: "/images/avatar-4.jpg", time: "45m ago" },
      { id: "v4", name: "Olivia Taylor", username: "@olivia_beans", avatar: "/images/avatar-5.jpg", time: "30m ago" },
      // Add more viewers to reach the count
    ],
    likes: 42,
    likers: [
      { id: "l1", name: "James Rodriguez", username: "@coffee_james", avatar: "/images/avatar-2.jpg" },
      { id: "l2", name: "Sophia Chen", username: "@sophia_latte", avatar: "/images/avatar-3.jpg" },
      { id: "l3", name: "Michael Brown", username: "@mike_espresso", avatar: "/images/avatar-4.jpg" },
    ],
  },
  {
    id: "2",
    title: "Latte Art",
    media: "/images/coffee-2.jpg",
    type: "image",
    username: "@barista_mike",
    privacy: "public",
    views: 89,
    viewers: [
      { id: "v5", name: "Emma Wilson", username: "@emma_coffee", avatar: "/images/avatar-1.jpg", time: "3h ago" },
      { id: "v6", name: "Olivia Taylor", username: "@olivia_beans", avatar: "/images/avatar-5.jpg", time: "2h ago" },
      { id: "v7", name: "Daniel Lee", username: "@daniel_brew", avatar: "/images/avatar-6.jpg", time: "1h ago" },
    ],
    likes: 31,
    likers: [
      { id: "l4", name: "Emma Wilson", username: "@emma_coffee", avatar: "/images/avatar-1.jpg" },
      { id: "l5", name: "Olivia Taylor", username: "@olivia_beans", avatar: "/images/avatar-5.jpg" },
    ],
  },
  {
    id: "3",
    title: "Coffee Shop Vibes",
    media: "/images/coffee-3.jpg",
    type: "image",
    username: "@coffee_addict",
    privacy: "friends",
    views: 56,
    viewers: [
      { id: "v8", name: "James Rodriguez", username: "@coffee_james", avatar: "/images/avatar-2.jpg", time: "4h ago" },
      { id: "v9", name: "Michael Brown", username: "@mike_espresso", avatar: "/images/avatar-4.jpg", time: "3h ago" },
    ],
    likes: 18,
    likers: [{ id: "l6", name: "James Rodriguez", username: "@coffee_james", avatar: "/images/avatar-2.jpg" }],
  },
  {
    id: "4",
    title: "Espresso Shot",
    media: "/images/coffee-4.jpg",
    type: "image",
    username: "@espresso_expert",
    privacy: "public",
    views: 112,
    viewers: [
      { id: "v10", name: "Emma Wilson", username: "@emma_coffee", avatar: "/images/avatar-1.jpg", time: "5h ago" },
      { id: "v11", name: "Sophia Chen", username: "@sophia_latte", avatar: "/images/avatar-3.jpg", time: "4h ago" },
      { id: "v12", name: "Olivia Taylor", username: "@olivia_beans", avatar: "/images/avatar-5.jpg", time: "2h ago" },
    ],
    likes: 37,
    likers: [
      { id: "l7", name: "Emma Wilson", username: "@emma_coffee", avatar: "/images/avatar-1.jpg" },
      { id: "l8", name: "Sophia Chen", username: "@sophia_latte", avatar: "/images/avatar-3.jpg" },
    ],
  },
  {
    id: "5",
    title: "Coffee Beans",
    media: "/images/coffee-5.jpg",
    type: "image",
    username: "@bean_lover",
    privacy: "private",
    views: 8,
    viewers: [
      { id: "v13", name: "James Rodriguez", username: "@coffee_james", avatar: "/images/avatar-2.jpg", time: "1h ago" },
      { id: "v14", name: "Michael Brown", username: "@mike_espresso", avatar: "/images/avatar-4.jpg", time: "30m ago" },
    ],
    likes: 5,
    likers: [{ id: "l9", name: "James Rodriguez", username: "@coffee_james", avatar: "/images/avatar-2.jpg" }],
  },
]

export function StorySection() {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [viewingStory, setViewingStory] = useState<null | {
    id: string
    title: string
    media: string
    type: string
    username: string
    privacy: string
    views: number
    viewers: Array<{
      id: string
      name: string
      username: string
      avatar: string
      time: string
    }>
    likes: number
    likers: Array<{
      id: string
      name: string
      username: string
      avatar: string
    }>
  }>(null)
  const [stories, setStories] = useState(mockStories)
  const storiesContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: number) => {
    if (storiesContainerRef.current) {
      storiesContainerRef.current.scrollBy({
        left: direction * 200,
        behavior: "smooth",
      })
    }
  }

  const handleAddStory = (newStory: {
    id: string
    title: string
    media: string
    type: string
    username: string
    privacy: string
  }) => {
    // Add empty views and likes arrays to the new story
    const storyWithStats = {
      ...newStory,
      views: 0,
      viewers: [],
      likes: 0,
      likers: [],
    }
    setStories([storyWithStats, ...stories])
    setIsCreatorOpen(false)
  }

  return (
    <section className="py-8">
      {/* Hero Banner */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/coffee-banner.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        <div className="relative z-10 px-6 py-16 md:py-24 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Coffee Makes Your Day</h1>
          <p className="text-lg mb-6 max-w-md opacity-90">
            Share your coffee moments and connect with other coffee enthusiasts
          </p>
          <Button onClick={() => setIsCreatorOpen(true)} className="bg-white text-primary hover:bg-white/90">
            Create New Story
          </Button>
        </div>
      </div>

      {/* Stories Section */}
      <div className="relative mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Stories</h2>
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full"
            onClick={() => handleScroll(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div
            ref={storiesContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Add Story Button */}
            <Card
              className="flex-shrink-0 w-32 h-56 flex flex-col items-center justify-center gap-2 cursor-pointer snap-start bg-primary/10 hover:bg-primary/20 transition-colors border-2 border-dashed border-primary/30"
              onClick={() => setIsCreatorOpen(true)}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-center">Add Story</p>
            </Card>

            {/* Story Cards */}
            {stories.map((story) => (
              <Card
                key={story.id}
                className="flex-shrink-0 w-32 h-56 rounded-xl overflow-hidden cursor-pointer snap-start relative group"
                onClick={() => setViewingStory(story)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${story.media})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {/* Add privacy icon */}
                    <div className="bg-black/50 rounded-full p-0.5">
                      {story.privacy === "public" ? (
                        <Globe className="h-3 w-3 text-white" />
                      ) : story.privacy === "friends" ? (
                        <Users className="h-3 w-3 text-white" />
                      ) : (
                        <Lock className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <p className="text-white text-sm font-medium truncate">{story.title}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-white/70 text-xs">{story.username}</p>
                    {/* Add view count */}
                    <div className="flex items-center text-white/70 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      {story.views}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full"
            onClick={() => handleScroll(1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Story Creator Modal */}
      <StoryCreator isOpen={isCreatorOpen} onClose={() => setIsCreatorOpen(false)} onAddStory={handleAddStory} />

      {/* Story Viewer Modal */}
      {viewingStory && (
        <StoryViewer
          story={viewingStory}
          onClose={() => setViewingStory(null)}
          stories={stories}
          setViewingStory={setViewingStory}
        />
      )}
    </section>
  )
}

