"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideImage, Video, X, Globe, Users, Lock } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "../context/UserContext"

interface StoryCreatorProps {
  isOpen: boolean
  onClose: () => void
  onAddStory: (story: {
    id: string
    title: string
    media: string
    type: string
    username: string
    privacy: string
  }) => void
}

export function StoryCreator({ isOpen, onClose, onAddStory }: StoryCreatorProps) {
  const [title, setTitle] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [privacy, setPrivacy] = useState("public")
  const { username } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)

  // Function to resize image to standard story dimensions
  const resizeImage = (dataUrl: string, callback: (resizedDataUrl: string) => void) => {
    // Use window.Image to explicitly reference the global Image constructor
    const img = new window.Image()
    img.onload = () => {
      // Target dimensions for stories (9:16 aspect ratio like Instagram/Facebook)
      const targetWidth = 1080
      const targetHeight = 1920

      // Create canvas with target dimensions
      const canvas = document.createElement("canvas")
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Fill background with black
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, targetWidth, targetHeight)

        // Calculate dimensions to maintain aspect ratio
        let newWidth, newHeight, offsetX, offsetY

        const imgRatio = img.width / img.height
        const targetRatio = targetWidth / targetHeight

        if (imgRatio > targetRatio) {
          // Image is wider than target ratio
          newHeight = targetHeight
          newWidth = newHeight * imgRatio
          offsetX = (targetWidth - newWidth) / 2
          offsetY = 0
        } else {
          // Image is taller than target ratio
          newWidth = targetWidth
          newHeight = newWidth / imgRatio
          offsetX = 0
          offsetY = (targetHeight - newHeight) / 2
        }

        // Draw image centered on canvas
        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight)

        // Convert canvas to data URL
        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.85)
        callback(resizedDataUrl)
      }
    }
    img.src = dataUrl
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string

      if (file.type.startsWith("video")) {
        setMediaPreview(result)
        setMediaType("video")
        setIsProcessing(false)
      } else {
        // Resize image to standard story dimensions
        resizeImage(result, (resizedDataUrl) => {
          setMediaPreview(resizedDataUrl)
          setMediaType("image")
          setIsProcessing(false)
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!title || !mediaPreview) return

    const newStory = {
      id: uuidv4(),
      title,
      media: mediaPreview,
      type: mediaType,
      username: username || "@anonymous", // Provide a default if username is null
      privacy,
    }

    try {
      // For local development, just use the callback directly
      onAddStory(newStory)

      // Reset form
      setTitle("")
      setMediaPreview(null)
      setMediaType("image")
      setPrivacy("public")
      onClose()
    } catch (error) {
      console.error("Error creating story:", error)
    }
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
                  <LucideImage className="h-10 w-10 text-muted-foreground mb-2" />
                ) : (
                  <Video className="h-10 w-10 text-muted-foreground mb-2" />
                )}
                <p className="text-sm text-muted-foreground text-center">Click to upload an image or video</p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Images will be resized to fit story format (9:16 ratio)
                </p>
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
              <div className="relative">
                <div className="rounded-lg overflow-hidden bg-black aspect-[9/16] max-h-[300px]">
                  {mediaType === "image" ? (
                    <img
                      src={mediaPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <video src={mediaPreview} controls className="w-full h-full object-contain" />
                  )}
                </div>
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

            {isProcessing && (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm">Processing image...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !mediaPreview || isProcessing}>
            Post Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

