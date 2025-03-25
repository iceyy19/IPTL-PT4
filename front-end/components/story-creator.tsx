"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Image, Video, X, Globe, Users, Lock } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StoryCreatorProps {
  isOpen: boolean
  onClose: () => void
  onAddStory: (story: {
    id: string
    title: string
    media: string
    type: string
    username: string
    privacy: string // Add privacy property
  }) => void
}

export function StoryCreator({ isOpen, onClose, onAddStory }: StoryCreatorProps) {
  const [title, setTitle] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [username, setUsername] = useState("@coffeelover")
  const [privacy, setPrivacy] = useState("public") // Add privacy state

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setMediaPreview(reader.result as string)
      setMediaType(file.type.startsWith("video") ? "video" : "image")
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = () => {
    if (!title || !mediaPreview) return

    // In a real app, you would upload the file to a server
    // For this demo, we'll just use the preview URL
    onAddStory({
      id: uuidv4(),
      title,
      media: mediaPreview,
      type: mediaType,
      username: username,
      privacy: privacy, // Include privacy in the story object
    })

    // Reset form
    setTitle("")
    setMediaPreview(null)
    setMediaType("image")
    setPrivacy("public") // Reset privacy
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Your Story</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Story Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your story"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Add privacy selection dropdown */}
          <div className="space-y-2">
            <Label htmlFor="privacy">Privacy</Label>
            <Select value={privacy} onValueChange={setPrivacy}>
              <SelectTrigger id="privacy" className="w-full">
                <SelectValue placeholder="Select privacy setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Friends Only</span>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {!mediaPreview ? (
              // Upload section - shown when no media is selected
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {mediaType === "image" ? (
                  <Image className="h-10 w-10 text-muted-foreground mb-2" />
                ) : (
                  <Video className="h-10 w-10 text-muted-foreground mb-2" />
                )}
                <p className="text-sm text-muted-foreground text-center">Click to upload an image or video</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              // Preview section - shown when media is selected
              <div className="relative rounded-lg overflow-hidden">
                {mediaType === "image" ? (
                  <img
                    src={mediaPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                ) : (
                  <video src={mediaPreview} controls className="w-full h-auto max-h-[300px]" />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setMediaPreview(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !mediaPreview}>
            Post Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

