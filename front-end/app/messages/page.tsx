"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Phone, Video, Info, Image, Smile, Paperclip } from "lucide-react"

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Emma Wilson",
    username: "@emma_coffee",
    avatar: "/images/avatar-1.jpg",
    lastMessage: "That coffee shop was amazing!",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "James Rodriguez",
    username: "@coffee_james",
    avatar: "/images/avatar-2.jpg",
    lastMessage: "Are you going to the coffee festival?",
    time: "1h ago",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Sophia Chen",
    username: "@sophia_latte",
    avatar: "/images/avatar-3.jpg",
    lastMessage: "I just tried that new roast you recommended",
    time: "3h ago",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Michael Brown",
    username: "@mike_espresso",
    avatar: "/images/avatar-4.jpg",
    lastMessage: "Let's meet at the cafe tomorrow",
    time: "1d ago",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Olivia Taylor",
    username: "@olivia_beans",
    avatar: "/images/avatar-5.jpg",
    lastMessage: "Have you tried the new cold brew method?",
    time: "2d ago",
    unread: 0,
    online: true,
  },
  {
    id: "6",
    name: "Coffee Lovers Group",
    username: "5 members",
    avatar: "/images/group-avatar.jpg",
    lastMessage: "Emma: Who's up for a coffee meetup?",
    time: "2d ago",
    unread: 3,
    online: false,
    isGroup: true,
  },
]

// Mock data for messages in a conversation
const mockMessages = {
  "1": [
    {
      id: "m1",
      sender: "Emma Wilson",
      senderUsername: "@emma_coffee",
      avatar: "/images/avatar-1.jpg",
      content: "Hey! Have you tried that new coffee shop downtown?",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: "m2",
      sender: "Me",
      content: "Not yet! Is it good?",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: "m3",
      sender: "Emma Wilson",
      senderUsername: "@emma_coffee",
      avatar: "/images/avatar-1.jpg",
      content:
        "It's amazing! They have this special pour-over that takes like 5 minutes to make but it's worth the wait.",
      time: "10:33 AM",
      isMe: false,
    },
    {
      id: "m4",
      sender: "Me",
      content: "That sounds great! What's the place called?",
      time: "10:35 AM",
      isMe: true,
    },
    {
      id: "m5",
      sender: "Emma Wilson",
      senderUsername: "@emma_coffee",
      avatar: "/images/avatar-1.jpg",
      content:
        "It's called 'The Daily Grind'. They also have these amazing pastries that pair perfectly with their coffee.",
      time: "10:36 AM",
      isMe: false,
    },
    {
      id: "m6",
      sender: "Me",
      content: "I'll definitely check it out this weekend. Thanks for the recommendation!",
      time: "10:38 AM",
      isMe: true,
    },
    {
      id: "m7",
      sender: "Emma Wilson",
      senderUsername: "@emma_coffee",
      avatar: "/images/avatar-1.jpg",
      content: "Let me know what you think! Maybe we can go together sometime.",
      time: "10:40 AM",
      isMe: false,
    },
    {
      id: "m8",
      sender: "Emma Wilson",
      senderUsername: "@emma_coffee",
      avatar: "/images/avatar-1.jpg",
      content: "That coffee shop was amazing!",
      time: "11:45 AM",
      isMe: false,
    },
  ],
  "2": [
    {
      id: "m1",
      sender: "James Rodriguez",
      senderUsername: "@coffee_james",
      avatar: "/images/avatar-2.jpg",
      content: "Hey, are you going to the coffee festival this weekend?",
      time: "Yesterday",
      isMe: false,
    },
    {
      id: "m2",
      sender: "Me",
      content: "I'm planning to! Are you?",
      time: "Yesterday",
      isMe: true,
    },
    {
      id: "m3",
      sender: "James Rodriguez",
      senderUsername: "@coffee_james",
      avatar: "/images/avatar-2.jpg",
      content: "Definitely! I heard they'll have tastings from roasters all over the country.",
      time: "Yesterday",
      isMe: false,
    },
  ],
}

export default function MessagesPage() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      const validateSession = async () => {
        const sessionId = localStorage.getItem("sessionId");
    
        if (!sessionId) {
          console.log("No session found, redirecting to login...");
          router.push("/login");
          return;
        }
    
        try {
          const response = await fetch("/api/validate-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
          });
    
          if (response.ok) {
            console.log("Session is valid");
            setIsAuthenticated(true);
          } else {
            console.error("Invalid session, redirecting to login...");
            localStorage.removeItem("sessionId");
            router.push("/login");
          }
        } catch (error) {
          console.error("Error validating session:", error);
          localStorage.removeItem("sessionId");
          router.push("/login");
        }
      };
    
      validateSession();
    }, [router]);

    if (!isAuthenticated) {
        // Redirecting or showing a fallback if the user is not authenticated
        return null; // Prevent rendering if the user is not authenticated
      }

  const [activeConversation, setActiveConversation] = useState<string | null>("1")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Scroll to bottom of messages when active conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation, messages])

  const handleSendMessage = () => {
    if (!message.trim() || !activeConversation) return

    const newMessage = {
      id: `m${Date.now()}`,
      sender: "Me",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    }

    setMessages((prev) => ({
      ...prev,
      [activeConversation]: [...(prev[activeConversation as keyof typeof prev] || []), newMessage],
    }))

    // Update last message in conversations list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              lastMessage: message,
              time: "Just now",
              unread: 0,
            }
          : conv,
      ),
    )

    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="container mx-auto px-0 md:px-4 py-6">
        <div className="bg-[#121212] rounded-lg overflow-hidden shadow-xl flex flex-col md:flex-row h-[calc(100vh-12rem)]">
          {/* Conversations Sidebar */}
          <div className="w-full md:w-80 border-r border-[#2a2a2a] flex flex-col">
            <div className="p-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations"
                  className="pl-9 bg-[#2a2a2a] border-0 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-[#2a2a2a] transition-colors ${
                      activeConversation === conversation.id ? "bg-[#2a2a2a]" : ""
                    }`}
                    onClick={() => {
                      setActiveConversation(conversation.id)
                      // Mark as read when clicked
                      setConversations((prev) =>
                        prev.map((conv) => (conv.id === conversation.id ? { ...conv, unread: 0 } : conv)),
                      )
                    }}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#121212]"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-white truncate">{conversation.name}</h3>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="min-w-[20px] h-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{conversation.unread}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-400">No conversations found</div>
              )}
            </ScrollArea>
          </div>

          {/* Message Thread */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Conversation Header */}
              <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={conversations.find((c) => c.id === activeConversation)?.avatar || "/images/avatar.jpg"}
                      alt={conversations.find((c) => c.id === activeConversation)?.name || "User"}
                    />
                    <AvatarFallback>
                      {(conversations.find((c) => c.id === activeConversation)?.name || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-white">
                      {conversations.find((c) => c.id === activeConversation)?.name || "User"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {conversations.find((c) => c.id === activeConversation)?.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
                    <Info className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages[activeConversation as keyof typeof messages]?.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[80%] ${msg.isMe ? "flex-row-reverse" : ""}`}>
                        {!msg.isMe && (
                          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                            <AvatarImage src={msg.avatar} alt={msg.sender} />
                            <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-2xl px-4 py-2 ${
                              msg.isMe ? "bg-primary text-white" : "bg-[#2a2a2a] text-white"
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-[#2a2a2a]">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
                    <Image className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      className="bg-[#2a2a2a] border-0 text-white placeholder:text-gray-400 focus-visible:ring-primary pr-10"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Your Messages</h3>
                <p className="text-gray-400 mb-4">Send private messages to friends and fellow coffee enthusiasts</p>
                <Button className="bg-primary hover:bg-primary/90 text-white">Start a Conversation</Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

