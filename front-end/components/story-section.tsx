"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StoryCreator } from "@/components/story-creator"
import { StoryViewer } from "@/components/story-viewer"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

// Mock data for stories
const mockStories = [
  {
    id: "1",
    title: "Morning Brew",
    media: "/images/coffee-1.jpg",
    type: "image",
    username: "@emma_coffee",
  },
  {
    id: "2",
    title: "Latte Art",
    media: "/images/coffee-2.jpg",
    type: "image",
    username: "@barista_mike",
  },
  {
    id: "3",
    title: "Coffee Shop Vibes",
    media: "/images/coffee-3.jpg",
    type: "image",
    username: "@coffee_addict",
  },
  {
    id: "4",
    title: "Espresso Shot",
    media: "/images/coffee-4.jpg",
    type: "image",
    username: "@espresso_expert",
  },
  {
    id: "5",
    title: "Coffee Beans",
    media: "/images/coffee-5.jpg",
    type: "image",
    username: "@bean_lover",
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
  }) => {
    setStories([newStory, ...stories])
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
                  <p className="text-white text-sm font-medium truncate">{story.title}</p>
                  <p className="text-white/70 text-xs truncate">{story.username}</p>
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

