"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, MessageCircle, Send, X, Pause, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock comments data
const mockComments = {
  "1": [
    { id: "c1", username: "@coffee_lover", text: "This looks amazing! ☕", time: "5m ago" },
    { id: "c2", username: "@barista_pro", text: "Perfect crema on that espresso!", time: "12m ago" },
    { id: "c3", username: "@morning_brew", text: "Where is this coffee shop?", time: "30m ago" },
  ],
  "2": [
    { id: "c4", username: "@latte_art", text: "Beautiful design!", time: "2m ago" },
    { id: "c5", username: "@coffee_addict", text: "I need to learn how to do this", time: "15m ago" },
  ],
  "3": [
    { id: "c6", username: "@cafe_hopper", text: "Love the ambiance!", time: "8m ago" },
    { id: "c7", username: "@coffee_bean", text: "Is this in downtown?", time: "20m ago" },
    { id: "c8", username: "@espresso_shot", text: "Perfect spot for working", time: "45m ago" },
  ],
  "4": [{ id: "c9", username: "@dark_roast", text: "Strong and bold, just how I like it", time: "3m ago" }],
  "5": [
    { id: "c10", username: "@coffee_grinder", text: "Fresh beans make all the difference", time: "7m ago" },
    { id: "c11", username: "@pour_over", text: "What's your favorite roast?", time: "18m ago" },
  ],
}

interface StoryViewerProps {
  story: {
    id: string
    title: string
    media: string
    type: string
    username: string
  }
  stories: Array<{
    id: string
    title: string
    media: string
    type: string
    username: string
  }>
  onClose: () => void
  setViewingStory: (
    story: {
      id: string
      title: string
      media: string
      type: string
      username: string
    } | null,
  ) => void
}

export function StoryViewer({ story, stories, onClose, setViewingStory }: StoryViewerProps) {
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentIndex = stories.findIndex((s) => s.id === story.id)
  const hasNext = currentIndex < stories.length - 1
  const hasPrevious = currentIndex > 0

  // Get comments for current story or empty array if none exist
  const storyComments = mockComments[story.id as keyof typeof mockComments] || []

  const goToNextStory = () => {
    if (hasNext) {
      setViewingStory(stories[currentIndex + 1])
    } else {
      onClose()
    }
  }

  const goToPreviousStory = () => {
    if (hasPrevious) {
      setViewingStory(stories[currentIndex - 1])
    }
  }

  const togglePause = () => {
    if (isPaused) {
      if (story.type === "video" && videoRef.current) {
        videoRef.current.play()
      } else {
        startProgress()
      }
      setIsPaused(false)
    } else {
      if (story.type === "video" && videoRef.current) {
        videoRef.current.pause()
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
        progressInterval.current = null
      }
      setIsPaused(true)
    }
  }

  const handleLike = () => {
    // In a real app, you would send a like to the server
    console.log("Liked story:", story.id)
  }

  const handleComment = () => {
    if (!comment.trim()) return

    // In a real app, you would send the comment to the server
    console.log("Comment on story:", story.id, comment)
    setComment("")
  }

  const toggleComments = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowComments(!showComments)
  }

  const startProgress = () => {
    if (story.type === "image") {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 0.5
          if (newProgress >= 100) {
            clearInterval(progressInterval.current!)
            progressInterval.current = null
            setTimeout(goToNextStory, 300)
            return 100
          }
          return newProgress
        })
      }, 50)
    }
  }

  useEffect(() => {
    setProgress(0)
    setIsPaused(false)
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
    if (story.type === "image") {
      startProgress()
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
        progressInterval.current = null
      }
    }
  }, [story.id])

  // Handle video progress
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(percentage)
    }
  }

  const handleVideoEnded = () => {
    goToNextStory()
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        // Only allow the Dialog's built-in close behavior to close the entire story
        // when explicitly clicking the main close button or pressing Escape
        if (!open) onClose()
      }}
    >
      <DialogContent
        className={`p-0 h-[80vh] max-h-[80vh] w-[45vw] max-w-[45vw] overflow-hidden ${showComments ? "max-w-5xl" : "max-w-3xl"}`}
      >
        <div className="relative h-full w-full flex">
          {/* Story Content Side */}
          <div className="relative flex-1 h-full w-full max-w-[360px] max-h-[640px] mx-auto bg-black">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-10">
              <div
                className="h-full bg-primary transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Story title */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold drop-shadow-md">{story.title}</h3>
                <p className="text-white/70 text-sm drop-shadow-md">{story.username}</p>
              </div>
            </div>

            {/* Pause/Play button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-16 z-10 text-white hover:bg-black/20 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                togglePause();
              }}
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>

            {/* Close button for the entire story */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-black/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Story content */}
            <div
              className="h-full flex items-center justify-center"
              onClick={() => togglePause()} // Toggle pause/play when clicking the story content
            >
              {story.type === "image" ? (
                <img
                  src={story.media || "/placeholder.svg"}
                  alt={story.title}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={story.media}
                  className="max-h-full max-w-full object-contain"
                  autoPlay
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleVideoEnded}
                />
              )}
            </div>

            {/* Navigation buttons */}
            {hasPrevious && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-black/20 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  goToPreviousStory()
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {hasNext && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-black/20 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  goToNextStory()
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Reactions */}
            <div className="absolute right-4 top-1/3 z-10 flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/20 text-white hover:bg-black/40"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLike()
                }}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat button - moved to bottom of right navigation */}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-4 bottom-20 z-10 rounded-full ${showComments ? "bg-primary text-white" : "bg-black/20 text-white"} hover:bg-black/40`}
              onClick={toggleComments}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            {/* Comment input section */}
            <div
              className="absolute bottom-4 left-4 right-4 z-10 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()} // Prevent click from propagating to the story content
            >
              <Input
                id="comment-input"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-black/20 border-none text-white placeholder:text-white/70 focus-visible:ring-primary"
                onFocus={() => {
                  if (!isPaused) togglePause(); // Pause the story when the comment textbox is focused
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComment();
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-black/20"
                onClick={handleComment}
                disabled={!comment.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Comments Side */}
          {showComments && (
            <div className="w-80 h-full border-l border-border/40 bg-background/95 flex flex-col">
              <div className="p-4 border-b border-border/40 flex justify-between items-center">
                <h3 className="font-semibold">Comments</h3>
                {/* Close button for the comment section */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-black/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowComments(false) // Close only the comment section
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                {storyComments.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {storyComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{comment.username.charAt(1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{comment.username}</p>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">No comments yet</p>
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t border-border/40">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleComment()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleComment} disabled={!comment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}