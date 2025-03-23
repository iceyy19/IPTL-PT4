"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Image, Video, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Cropper } from "react-cropper"
import "cropperjs/dist/cropper.css"
import type { ReactCropperElement } from "react-cropper"

interface StoryCreatorProps {
  isOpen: boolean
  onClose: () => void
  onAddStory: (story: {
    id: string
    title: string
    media: string
    type: string
    username: string
  }) => void
}

export function StoryCreator({ isOpen, onClose, onAddStory }: StoryCreatorProps) {
  const [title, setTitle] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | undefined>(undefined)
  const [mediaType, setMediaType] = useState<"image" | "video">("image")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [username, setUsername] = useState("@coffeelover")
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const cropperRef = useRef<ReactCropperElement>(null)


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

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper
    if (!cropper) {
      console.error("Cropper is not initialized")
      return
    }
  
    const croppedCanvas = cropper.getCroppedCanvas({
      width: 1080, // 9:16 aspect ratio (1080x1920)
      height: 1920,
    })
  
    if (!croppedCanvas) {
      console.error("Failed to crop the image")
      return
    }
  
    setCroppedImage(croppedCanvas.toDataURL("image/jpeg"))
    setMediaPreview(undefined) // Hide the cropper after cropping
  }


  const handleSubmit = () => {
    if (!title || (!croppedImage && !mediaPreview)) return

    const finalMedia = croppedImage || mediaPreview

    onAddStory({
      id: uuidv4(),
      title,
      media: finalMedia!,
      type: mediaType,
      username: username,
    })

    setTitle("")
    setMediaPreview(undefined)
    setCroppedImage(null)
    setMediaType("image")
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

          <div className="space-y-4">
            {!mediaPreview && !croppedImage ? (
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
            ) : mediaType === "image" && mediaPreview ? (
              <div className="relative rounded-lg overflow-hidden">
                <Cropper
                  src={mediaPreview || undefined}
                  style={{ height: 300, width: "100%" }}
                  viewMode={1}
                  aspectRatio={9 / 16}
                  guides={true}
                  ref={cropperRef}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMediaPreview(undefined)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCrop}>Crop</Button>
                </div>
              </div>
            ) : croppedImage ? (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={croppedImage}
                  alt="Cropped Preview"
                  className="w-full h-auto max-h-[300px] object-contain"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setCroppedImage(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                <video src={mediaPreview} controls className="w-full h-auto max-h-[300px]" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setMediaPreview(undefined)
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
          <Button onClick={handleSubmit} disabled={!title || (!croppedImage && !mediaPreview)}>
            Post Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

