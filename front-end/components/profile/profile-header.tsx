"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, ImageIcon, Camera, Upload, Calendar, MapPin, LinkIcon, Coffee } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface ProfileHeaderProps {
  userProfile: {
    name: string
    username: string
    bio: string
    location: string
    birthday: string
    website: string
    joinedDate: string
    profileImage: string
    coverImage: string
    stats: {
      posts: number
      followers: number
      following: number
    }
  }
  setUserProfile: (profile: any) => void
}

export function ProfileHeader({ userProfile, setUserProfile }: ProfileHeaderProps) {
  // State for edit profile dialog
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [editedProfile, setEditedProfile] = useState(userProfile)

  // State for profile picture and cover photo editing
  const [isEditProfilePicOpen, setIsEditProfilePicOpen] = useState(false)
  const [isEditCoverPhotoOpen, setIsEditCoverPhotoOpen] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState(userProfile.profileImage)
  const [coverImagePreview, setCoverImagePreview] = useState(userProfile.coverImage)

  // Refs for file inputs
  const profilePicInputRef = useRef<HTMLInputElement>(null)
  const coverPhotoInputRef = useRef<HTMLInputElement>(null)

  // Handle profile edit form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle profile picture change
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle cover photo change
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCoverImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Save profile changes
  const saveProfileChanges = () => {
    setUserProfile(editedProfile)
    setIsEditProfileOpen(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    })
  }

  // Save profile picture
  const saveProfilePicture = () => {
    setUserProfile((prev: any) => ({
      ...prev,
      profileImage: profileImagePreview,
    }))
    setIsEditProfilePicOpen(false)
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been successfully updated.",
    })
  }

  // Save cover photo
  const saveCoverPhoto = () => {
    setUserProfile((prev: any) => ({
      ...prev,
      coverImage: coverImagePreview,
    }))
    setIsEditCoverPhotoOpen(false)
    toast({
      title: "Cover photo updated",
      description: "Your cover photo has been successfully updated.",
    })
  }

  return (
    <>
      {/* Cover Photo */}
      <div className="relative h-60 md:h-80 -mx-4 mb-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${userProfile.coverImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-4 md:left-8">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-black">
              <AvatarImage src={userProfile.profileImage} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full bg-primary text-white hover:bg-primary/90 border-black"
              onClick={() => setIsEditProfilePicOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Edit Cover Button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-black/50 text-white border-white/20 hover:bg-black/70"
          onClick={() => setIsEditCoverPhotoOpen(true)}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Edit Cover
        </Button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
          <p className="text-gray-400">{"@"+userProfile.username}</p>
          <p className="text-white mt-4 max-w-md">{userProfile.bio}</p>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center text-gray-400">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{userProfile.location}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <LinkIcon className="h-4 w-4 mr-1" />
              <a href={`https://${userProfile.website}`} className="text-sm text-primary hover:underline">
                {userProfile.website}
              </a>
            </div>
            <div className="flex items-center text-gray-400">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">
                {"Born " + new Date(userProfile.birthday).toLocaleDateString("en-US", {
                weekday: "long", // Include the day of the week
                year: "numeric",
                month: "long",
                day: "numeric",
                })}
            </span>
            </div>
            <div className="flex items-center text-gray-400">
            <Coffee className="h-4 w-4 mr-1" />
            <span className="text-sm">
                {"Joined " + new Date(userProfile.joinedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                })}
            </span>
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <div>
              <span className="font-bold text-white">{userProfile.stats.posts}</span>{" "}
              <span className="text-gray-400">Posts</span>
            </div>
            <div>
              <span className="font-bold text-white">{userProfile.stats.followers}</span>{" "}
              <span className="text-gray-400">Followers</span>
            </div>
            <div>
              <span className="font-bold text-white">{userProfile.stats.following}</span>{" "}
              <span className="text-gray-400">Following</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setIsEditProfileOpen(true)}>
            Edit Profile
          </Button>
          <Button variant="outline" className="border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            Share Profile
          </Button>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={editedProfile.name}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={editedProfile.username}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={editedProfile.bio}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={editedProfile.location}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthday" className="text-right">
                Birthday
              </Label>
              <Input
                id="birthday"
                name="birthday"
                value={editedProfile.birthday}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={editedProfile.website}
                onChange={handleProfileChange}
                className="col-span-3 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProfileOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button onClick={saveProfileChanges} className="bg-primary hover:bg-primary/90 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Picture Dialog */}
      <Dialog open={isEditProfilePicOpen} onOpenChange={setIsEditProfilePicOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Change Profile Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative mb-6">
              <Avatar className="h-40 w-40">
                <AvatarImage src={profileImagePreview} alt="Profile Preview" />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-primary text-white hover:bg-primary/90 border-[#1a1a1a]"
                onClick={() => profilePicInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <input
              type="file"
              ref={profilePicInputRef}
              onChange={handleProfilePicChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a] mb-2"
              onClick={() => profilePicInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Picture
            </Button>
            <p className="text-xs text-gray-400 text-center">Recommended: Square image, at least 400x400 pixels</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProfilePicOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button onClick={saveProfilePicture} className="bg-primary hover:bg-primary/90 text-white">
              Save Picture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Cover Photo Dialog */}
      <Dialog open={isEditCoverPhotoOpen} onOpenChange={setIsEditCoverPhotoOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Change Cover Photo</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImagePreview})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  className="bg-black/50 text-white border-white/20 hover:bg-black/70"
                  onClick={() => coverPhotoInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Change Cover
                </Button>
              </div>
            </div>
            <input
              type="file"
              ref={coverPhotoInputRef}
              onChange={handleCoverPhotoChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              variant="outline"
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a] mb-2"
              onClick={() => coverPhotoInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Cover Photo
            </Button>
            <p className="text-xs text-gray-400 text-center">Recommended: 1500x500 pixels, JPG or PNG format</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditCoverPhotoOpen(false)}
              className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
            >
              Cancel
            </Button>
            <Button onClick={saveCoverPhoto} className="bg-primary hover:bg-primary/90 text-white">
              Save Cover Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

