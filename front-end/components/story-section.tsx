"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StoryCreator } from "@/components/story-creator"
import { StoryViewer } from "@/components/story-viewer"
import { ChevronLeft, ChevronRight, Plus, Globe, Users, Lock, Eye } from "lucide-react"
import { fetchStories, addStory } from "@/lib/story-api"

export function StorySection() {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [viewingStory, setViewingStory] = useState<any>(null)
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const storiesContainerRef = useRef<HTMLDivElement>(null)

  // Fetch stories from the API
  useEffect(() => {
    const getStories = async () => {
      try {
        setLoading(true)
        const data = await fetchStories()
        setStories(data)
      } catch (err) {
        console.error("Error fetching stories:", err)
        setError(err instanceof Error ? err.message : "Failed to load stories")
      } finally {
        setLoading(false)
      }
    }

    getStories()
  }, [])

  const handleScroll = (direction: number) => {
    if (storiesContainerRef.current) {
      storiesContainerRef.current.scrollBy({
        left: direction * 200,
        behavior: "smooth",
      })
    }
  }

  const handleAddStory = async (newStory: {
    id: string
    title: string
    media: string
    type: string
    username: string
    privacy: string
  }) => {
    try {
      const addedStory = await addStory(newStory)

      // Add the new story to the state
      setStories([addedStory, ...stories])
      setIsCreatorOpen(false)
    } catch (err) {
      console.error("Error adding story:", err)
      // You might want to show an error notification here
    }
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

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : stories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No stories found. Be the first to add one!</div>
        ) : (
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
                  key={story._id || story.id}
                  className="flex-shrink-0 w-32 h-56 rounded-xl overflow-hidden cursor-pointer snap-start relative group"
                  onClick={() => {
                    setViewingStory(story); // Open the story
                    setTimeout(() => {
                      document.dispatchEvent(new Event("startStoryProgress")); // Trigger progress
                    }, 100);
                  }}
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
        )}
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

