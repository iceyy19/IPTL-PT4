"use client"

import type React from "react"

import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
  X,
  Pause,
  Play,
  Eye,
  ArrowUp,
  Users,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUser } from "../context/UserContext";
import { formatTimeAgo } from "@/utils/timeFormatter"; // Import helper

interface StoryViewerProps {
  story: {
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
    comments?: Array<{
      id: string
      username: string
      text: string
      time: string
    }>
  }
  stories: Array<{
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
    comments?: Array<{
      id: string
      username: string
      text: string
      time: string
    }>
  }>
  onClose: () => void
  setViewingStory: (
    story: {
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
      comments?: Array<{
        id: string
        username: string
        text: string
        time: string
      }>
    } | null,
  ) => void
}

interface UserProfile {
  name: string;
  username: string;
  bio: string;
  location: string;
  birthday: string;
  website: string;
  joinedDate: string;
  profileImage: string;
  coverImage: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

export function StoryViewer({ story, stories, onClose, setViewingStory }: StoryViewerProps) {
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [comment, setComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [insightsTab, setInsightsTab] = useState("viewers")
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isMediaLoading, setIsMediaLoading] = useState(true)
  const [storyComments, setStoryComments] = useState<Array<{ id: string; username: string; text: string; time: string }>>([]);
  const { username } = useUser();
  const { profile, loading, error } = useUserProfile(username);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const avatar = profile || "/images/avatar.jpg"
  
  useEffect(() => {
    if (profile) {
      setUserProfile(profile);
      startProgress();
    }
  }, [profile]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/stories/comments?storyId=${story.id}`);
        if (!response.ok) throw new Error("Failed to fetch comments");
  
        const commentsData = await response.json();
        setStoryComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
  
    fetchComments();
  }, [story.id]);

  const currentIndex = stories.findIndex((s) => s.id === story.id)
  const hasNext = currentIndex < stories.length - 1
  const hasPrevious = currentIndex > 0

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

  const [storyViewers, setStoryViewers] = useState(story.viewers || []);
  const [storyViews, setStoryViews] = useState(story.views || 0);

  const [storyLikers, setStoryLikers] = useState(story.likers || []);
  const [storyLikes, setStoryLikes] = useState(story.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
  if (story && profile && !loading && !hasViewed) {
    addViewToStory();
    setHasViewed(true); // Prevent future duplicate calls
  }
}, [story, profile, loading]);

  useEffect(() => {
    if (userProfile) {
      setHasLiked(storyLikers.some((liker) => liker.username === userProfile.username));
    }
  }, [storyLikers, userProfile]);
  
  const handleLike = async () => {
    if (!userProfile) {
      alert("You must be logged in to like a story.");
      return;
    }
  
    try {
      const response = await fetch(`/api/stories/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId: story.id,
          userId: userProfile.username, // Use correct user ID
          name: userProfile.name, // Correctly store the name
          username: userProfile.username, // Store the correct username
          avatar: userProfile.profileImage, // Use correct avatar
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to like/unlike story");
      }
  
      const data = await response.json();
  
      // ✅ Update state to reflect new likers and like count
      setStoryLikers(data.likers);
      setStoryLikes(data.likes);
      setHasLiked(data.liked);
  
    } catch (error) {
      console.error("Error liking story:", error);
      alert("Failed to like/unlike story. Please try again.");
    }
  };

  async function addViewToStory() {
    try {
      if (!profile || !story) {
        console.warn("Profile or story is missing. Cannot update views.");
        return;
      }
  
      // Check if all fields exist before making the request
      const requestData = {
        storyId: story?.id,
        id: username,
        name: profile?.name,
        username: username,
        avatar: avatar,
      };
  
      console.log("📤 Sending data to API:", requestData);
  
      const res = await fetch(`/api/stories/view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      const data = await res.json();
      console.log("📥 Response from API:", data);
      setStoryViews((prev) => prev + 1);
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to update views");
      }
    } catch (error) {
      console.error("Error updating story views:", error);
    }
  }
  
  
  const handleComment = async () => {
    if (!comment.trim()) return;
    if (!userProfile || !userProfile.username) {
      alert("You must be logged in to comment.");
      return;
    }
  
    try {
      const response = await fetch(`/api/stories/comments`, { // ✅ Ensure correct path
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId: story.id,
          id: uuidv4(),
          username: userProfile.username,
          text: comment,
          time: new Date().toISOString(),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
  
      const savedComment = await response.json();
      setStoryComments((prevComments) => [...prevComments, savedComment]);
      setComment("");
  
      if (!showComments) {
        setShowComments(true);
      }
  
      console.log("Comment successfully saved:", savedComment);
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const toggleComments = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowComments(!showComments)
    setShowInsights(false)
  }

  const toggleInsights = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInsights(!showInsights)
    setShowComments(false)
  }

  const startProgress = () => {
    // Clear any existing interval first
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }

    if (story.type === "image" && isImageLoaded) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 0.5
          if (newProgress >= 100) {
            if (progressInterval.current) {
              clearInterval(progressInterval.current)
              progressInterval.current = null
            }
            setTimeout(goToNextStory, 300)
            return 100
          }
          return newProgress
        })
      }, 50)
    }
  }

  useEffect(() => {
    // Reset state for new story
    setProgress(0);
    setIsPaused(false);
    setShowInsights(false);
    setShowComments(false);
    setIsImageLoaded(false);
    setIsMediaLoading(true);
    // Reset comments when story changes
    setStoryComments(story.comments || []);
  
    // Clean up any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  
    // ✅ Start progress immediately for both image & video stories
    if (story.type === "video") {
      setIsMediaLoading(false);
      if (videoRef.current) {
        videoRef.current.play();
      }
      startProgress(); // ✅ Start progress immediately for videos
    } else if (story.type === "image") {
      const img = new Image();
      img.onload = () => {
        setIsImageLoaded(true);
        setIsMediaLoading(false);
        startProgress(); // ✅ Start progress when image loads
      };
      img.src = story.media;
    } else {
      startProgress(); // ✅ Start progress for any other media type
    }
  
    // ✅ Ensuring progress starts as soon as the story is opened
    setTimeout(() => {
      startProgress();
    }, 100); // Small delay ensures UI updates properly
  
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [story.id]);
  
  

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`/api/stories/insights?storyId=${story.id}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch insights");
        }
  
        const data = await response.json();
        setStoryViewers(data.viewers);
        setStoryLikers(data.likers);
        setStoryViews(data.views); // Update views count
        setStoryLikes(data.likes);
      } catch (error) {
        console.error("Error fetching story insights:", error);
      }
    };
  
    fetchInsights();
  }, [story.id]);

  // Handle image load
  const handleImageLoad = () => {
    setIsImageLoaded(true)
    // Start progress immediately when image loads
    startProgress()
  }

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
        className="p-0 overflow-hidden flex"
        style={{
          width: showComments || showInsights ? "800px" : "450px",
          height: "90vh",
          maxWidth: showComments || showInsights ? "800px" : "450px",
          maxHeight: "90vh",
        }}
      >
        {/* Story Content Side - Fixed width */}
        <div className="relative w-[450px] h-full bg-black flex flex-col">
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
              <Heart className={`h-4 w-4 ${hasLiked ? "text-red-500 fill-red-500" : "text-primary"}`} />
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
              e.stopPropagation()
              togglePause()
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

          {/* Story content - with fixed aspect ratio */}
          <div className="flex-1 flex items-center justify-center" onClick={togglePause}>
            <div className="relative w-full h-full flex items-center justify-center">
              {story.type === "image" ? (
                <img
                  src={story.media || "/placeholder.svg"}
                  alt={story.title}
                  className="max-h-full max-w-full object-contain"
                  onLoad={handleImageLoad}
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
                className={`rounded-full bg-black/20 ${hasLiked ? "text-red-500" : "text-white"} hover:bg-black/40`}
                onClick={handleLike}
              >
                <Heart className={`h-5 w-5 ${hasLiked ? "fill-red-500" : ""}`} />
              </Button>
            </div>

          {/* Instagram-like swipe up for insights */}
          {userProfile?.username === story.username && (
            <div
              className="absolute bottom-20 left-0 right-0 flex justify-center z-10"
              onClick={(e) => {
                e.stopPropagation();
                toggleInsights(e);
              }}
            >
              <div className="bg-black/30 rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer">
                <ArrowUp className="h-4 w-4 text-white" />
                <span className="text-white text-sm">
                  {story.views} {story.views === 1 ? "view" : "views"}
                </span>
              </div>
            </div>
          )}

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
            onClick={(e) => e.stopPropagation()}
          >
            <Input
              id="comment-input"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-black/20 border-none text-white placeholder:text-white/70 focus-visible:ring-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleComment()
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
          <div className="w-[350px] h-full border-l border-border/40 bg-background/95 flex flex-col">
            <div className="p-4 border-b border-border/40">
              <h3 className="font-semibold">Comments</h3>
            </div>

            <ScrollArea className="flex-1">
              {storyComments.length > 0 ? (
                <div className="p-4 space-y-4">
                  {storyComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">{"@"+comment.username}</p>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.time)}</span>
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

        {/* Insights Side - Instagram-like */}
        {showInsights && userProfile?.username === story.username && (
          <div className="w-[350px] h-full border-l border-border/40 bg-background/95 flex flex-col">
            <div className="p-4 border-b border-border/40">
              <h3 className="font-semibold">Insights</h3>
            </div>

            <Tabs defaultValue="viewers" className="w-full" onValueChange={setInsightsTab}>
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="viewers" className="data-[state=active]:bg-background">
                  <Eye className="h-4 w-4 mr-2" />
                  Viewers ({storyViews}) {/* ✅ Now updates dynamically */}
                </TabsTrigger>
                <TabsTrigger value="likes" className="data-[state=active]:bg-background">
                  <Heart className="h-4 w-4 mr-2" />
                  Likes ({storyLikes}) {/* ✅ This will now update in real-time */}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="viewers" className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <div className="p-4 space-y-3">
                    {storyViewers.length > 0 ? (
                      storyViewers.map((viewer) => (
                        <div key={viewer.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={viewer.avatar} alt={viewer.name} />
                              <AvatarFallback>{viewer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{viewer.name}</p>
                              <p className="text-xs text-muted-foreground">{"@"+viewer.username}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(viewer.time)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-32">
                        <p className="text-sm text-muted-foreground">No viewers yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="likes" className="p-0">
                <ScrollArea className="h-[calc(100vh-12rem)]">
                  <div className="p-4 space-y-3">
                    {storyLikers.length > 0 ? (
                      storyLikers.map((liker) => (
                        <div key={liker.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={liker.avatar} alt={liker.name} />
                              <AvatarFallback>{liker.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{liker.name}</p>
                              <p className="text-xs text-muted-foreground">{"@"+liker.username}</p>
                            </div>
                          </div>
                          {userProfile && liker.username !== userProfile.username && (
                            <Button variant="ghost" size="sm" className="text-primary">
                              <Users className="h-4 w-4 mr-1" />
                              Follow
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-32">
                        <p className="text-sm text-muted-foreground">No likes yet</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

