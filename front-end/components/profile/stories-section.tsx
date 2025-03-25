"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, EyeOff, Check, Globe, Users, Lock, ImageIcon, Camera } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from "uuid"

interface Story {
  id: string
  title: string
  media: string
  date: string
  hidden: boolean
  privacy: string
}

interface StoriesSectionProps {
  stories: Story[]
  setStories: (stories: Story[]) => void
  userProfile: {
    name: string
  }
}

export function StoriesSection({ stories, setStories, userProfile }: StoriesSectionProps) {
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false)
  const [newStory, setNewStory] = useState({
    title: "",
    privacy: "public",
    media: null as string | null,
  })
  const storyMediaInputRef = useRef<HTMLInputElement>(null)

  // Toggle hide story
  const toggleHideStory = (id: string) => {
    setStories(stories.map((story) => (story.id === id ? { ...story, hidden: !story.hidden } : story)))
    toast({
      title: "Story visibility updated",
      description: "Your story's visibility has been updated successfully.",
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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Stories</h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {stories
          .filter((story) => !story.hidden)
          .map((story) => (
            <div key={story.id} className="flex-shrink-0 w-32">
              <div className="relative h-32 w-32 rounded-xl overflow-hidden mb-2">
                <img src={story.media || "/placeholder.svg"} alt={story.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 text-white hover:bg-black/60">
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
    </div>
  )
}

