import { useState, useRef, type ChangeEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideImage, Video, X, Globe, Users, Lock } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "../context/UserContext"
import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css"

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
  const [privacy, setPrivacy] = useState("public")
  const { username } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cropData, setCropData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cropperRef = useRef<any>(null)

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
        setMediaPreview(result)
        setMediaType("image")
        setIsProcessing(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleCrop = () => {
    if (cropperRef.current) {
      const croppedImageUrl = cropperRef.current.getCroppedCanvas().toDataURL("image/jpeg")
      setMediaPreview(croppedImageUrl)
    }
  }

  const handleSubmit = async () => {
    if (!title || !mediaPreview) return

    const newStory = {
      id: uuidv4(),
      title,
      media: mediaPreview,
      type: mediaType,
      username: username || "@anonymous", 
      privacy,
    }

    try {
      onAddStory(newStory)
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                {mediaType === "image" ? (
                  <Cropper
                    ref={cropperRef}
                    src={mediaPreview}
                    style={{ width: "100%", height: "300px" }}
                    aspectRatio={9 / 16}
                    guides={false}
                    viewMode={1}
                  />
                ) : (
                  <video src={mediaPreview} controls className="w-full h-full object-contain" />
                )}
                {mediaType === "image" && (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={handleCrop}
                  >
                    Crop Image
                  </Button>
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
