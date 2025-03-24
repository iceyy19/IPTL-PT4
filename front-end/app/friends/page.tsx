"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Check, X, MessageSquare, Coffee, Users } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data for friends
const mockFriends = [
  {
    id: "1",
    name: "Emma Wilson",
    username: "@emma_coffee",
    avatar: "/images/avatar-1.jpg",
    mutualFriends: 12,
    online: true,
  },
  {
    id: "2",
    name: "James Rodriguez",
    username: "@coffee_james",
    avatar: "/images/avatar-2.jpg",
    mutualFriends: 8,
    online: true,
  },
  {
    id: "3",
    name: "Sophia Chen",
    username: "@sophia_latte",
    avatar: "/images/avatar-3.jpg",
    mutualFriends: 5,
    online: false,
  },
  {
    id: "4",
    name: "Michael Brown",
    username: "@mike_espresso",
    avatar: "/images/avatar-4.jpg",
    mutualFriends: 3,
    online: false,
  },
  {
    id: "5",
    name: "Olivia Taylor",
    username: "@olivia_beans",
    avatar: "/images/avatar-5.jpg",
    mutualFriends: 7,
    online: true,
  },
]

// Mock data for friend requests
const mockFriendRequests = [
  {
    id: "6",
    name: "Daniel Lee",
    username: "@daniel_brew",
    avatar: "/images/avatar-6.jpg",
    mutualFriends: 4,
  },
  {
    id: "7",
    name: "Sarah Johnson",
    username: "@sarah_coffee",
    avatar: "/images/avatar-7.jpg",
    mutualFriends: 6,
  },
]

// Mock data for suggested friends
const mockSuggestions = [
  {
    id: "8",
    name: "Alex Martinez",
    username: "@alex_barista",
    avatar: "/images/avatar-8.jpg",
    mutualFriends: 9,
  },
  {
    id: "9",
    name: "Jessica Kim",
    username: "@jessica_mocha",
    avatar: "/images/avatar-9.jpg",
    mutualFriends: 3,
  },
  {
    id: "10",
    name: "Ryan Wilson",
    username: "@ryan_roaster",
    avatar: "/images/avatar-10.jpg",
    mutualFriends: 5,
  },
]

// Add mock data for all users in the platform
const mockAllUsers = [
  {
    id: "11",
    name: "David Wilson",
    username: "@david_coffee",
    avatar: "/images/avatar-11.jpg",
    bio: "Coffee enthusiast and home barista",
    mutualFriends: 2,
  },
  {
    id: "12",
    name: "Lisa Thompson",
    username: "@lisa_espresso",
    avatar: "/images/avatar-12.jpg",
    bio: "Coffee shop owner in Portland",
    mutualFriends: 0,
  },
  {
    id: "13",
    name: "Mark Davis",
    username: "@mark_latte",
    avatar: "/images/avatar-13.jpg",
    bio: "Professional barista and latte art champion",
    mutualFriends: 5,
  },
  {
    id: "14",
    name: "Jennifer Lopez",
    username: "@jen_mocha",
    avatar: "/images/avatar-14.jpg",
    bio: "Coffee blogger and reviewer",
    mutualFriends: 3,
  },
  {
    id: "15",
    name: "Robert Chen",
    username: "@robert_beans",
    avatar: "/images/avatar-15.jpg",
    bio: "Coffee bean importer and roaster",
    mutualFriends: 1,
  },
]

// Update the FriendsPage component to include the search dialog
export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState(mockFriends)
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests)
  const [suggestions, setSuggestions] = useState(mockSuggestions)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [globalSearchQuery, setGlobalSearchQuery] = useState("")
  const [allUsers] = useState(mockAllUsers)

  // Filter friends based on search query
  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter all users based on global search query
  const filteredAllUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      (user.bio && user.bio.toLowerCase().includes(globalSearchQuery.toLowerCase())),
  )

  const handleAcceptRequest = (id: string) => {
    const request = friendRequests.find((req) => req.id === id)
    if (request) {
      setFriends([...friends, { ...request, online: false }])
      setFriendRequests(friendRequests.filter((req) => req.id !== id))
    }
  }

  const handleRejectRequest = (id: string) => {
    setFriendRequests(friendRequests.filter((req) => req.id !== id))
  }

  const handleAddFriend = (id: string) => {
    // In a real app, this would send a friend request
    // For demo purposes, we'll just remove from suggestions or all users
    setSuggestions(suggestions.filter((sug) => sug.id !== id))
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Friends List */}
          <div className="w-full md:w-2/3">
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden shadow-lg mb-8">
              <div className="p-4 border-b border-[#2a2a2a] flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Friends</h2>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setIsSearchDialogOpen(true)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find People
                </Button>
              </div>
              <div className="p-4 border-b border-[#2a2a2a]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search friends"
                    className="pl-9 bg-[#2a2a2a] border-0 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <div className="px-4 pt-4">
                  <TabsList className="grid w-full grid-cols-3 bg-[#2a2a2a]">
                    <TabsTrigger value="all" className="data-[state=active]:bg-[#3a3a3a]">
                      All Friends
                    </TabsTrigger>
                    <TabsTrigger value="online" className="data-[state=active]:bg-[#3a3a3a]">
                      Online
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="data-[state=active]:bg-[#3a3a3a]">
                      Recent
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="p-4">
                  {filteredFriends.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredFriends.map((friend) => (
                        <Card key={friend.id} className="bg-[#2a2a2a] border-[#3a3a3a]">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={friend.avatar} alt={friend.name} />
                                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {friend.online && (
                                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#2a2a2a]"></span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white">{friend.name}</p>
                                <p className="text-xs text-gray-400">{friend.username}</p>
                                <p className="text-xs text-gray-400 mt-1">{friend.mutualFriends} mutual friends</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                              >
                                <MessageSquare className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                              >
                                <Coffee className="h-5 w-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No friends found</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="online" className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFriends
                      .filter((friend) => friend.online)
                      .map((friend) => (
                        <Card key={friend.id} className="bg-[#2a2a2a] border-[#3a3a3a]">
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={friend.avatar} alt={friend.name} />
                                  <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#2a2a2a]"></span>
                              </div>
                              <div>
                                <p className="font-medium text-white">{friend.name}</p>
                                <p className="text-xs text-gray-400">{friend.username}</p>
                                <p className="text-xs text-gray-400 mt-1">{friend.mutualFriends} mutual friends</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                              >
                                <MessageSquare className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                              >
                                <Coffee className="h-5 w-5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFriends.slice(0, 2).map((friend) => (
                      <Card key={friend.id} className="bg-[#2a2a2a] border-[#3a3a3a]">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={friend.avatar} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {friend.online && (
                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#2a2a2a]"></span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-white">{friend.name}</p>
                              <p className="text-xs text-gray-400">{friend.username}</p>
                              <p className="text-xs text-gray-400 mt-1">{friend.mutualFriends} mutual friends</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                            >
                              <MessageSquare className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-white hover:bg-[#3a3a3a]"
                            >
                              <Coffee className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Requests & Suggestions */}
          <div className="w-full md:w-1/3 space-y-8">
            {/* Friend Requests */}
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden shadow-lg">
              <div className="p-4 border-b border-[#2a2a2a]">
                <h2 className="text-xl font-bold text-white">Friend Requests</h2>
              </div>
              <div className="p-4">
                {friendRequests.length > 0 ? (
                  <div className="space-y-4">
                    {friendRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.avatar} alt={request.name} />
                            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{request.name}</p>
                            <p className="text-xs text-gray-400">{request.username}</p>
                            <p className="text-xs text-gray-400 mt-1">{request.mutualFriends} mutual friends</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={() => handleAcceptRequest(request.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400">No pending friend requests</p>
                  </div>
                )}
              </div>
            </div>

            {/* Suggested Friends */}
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden shadow-lg">
              <div className="p-4 border-b border-[#2a2a2a]">
                <h2 className="text-xl font-bold text-white">People You May Know</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                          <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{suggestion.name}</p>
                          <p className="text-xs text-gray-400">{suggestion.username}</p>
                          <p className="text-xs text-gray-400 mt-1">{suggestion.mutualFriends} mutual friends</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white"
                        onClick={() => handleAddFriend(suggestion.id)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search People Dialog */}
        <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] text-white border-[#2a2a2a]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Find People</DialogTitle>
            </DialogHeader>
            <div className="relative my-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, username, or bio"
                className="pl-9 bg-[#2a2a2a] border-0 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {globalSearchQuery.trim() === "" ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-400">Search for people by name, username, or bio</p>
                </div>
              ) : filteredAllUsers.length > 0 ? (
                filteredAllUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2a2a2a]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.username}</p>
                        {user.bio && <p className="text-sm text-gray-400 mt-1 line-clamp-1">{user.bio}</p>}
                        <p className="text-xs text-gray-400 mt-1">{user.mutualFriends} mutual friends</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={() => handleAddFriend(user.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No users found matching "{globalSearchQuery}"</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}

