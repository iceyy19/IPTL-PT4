"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Ensure this is inside the component
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Coffee, Menu, MessageSquare, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "../context/UserContext";
import { useUserProfile } from "@/hooks/useUserProfile";


// Define the type for the user state
interface UserState {
  name: string;
  username: string;
}

export function Header() {
  const router = useRouter(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { username } = useUser();
  const { profile, loading, error } = useUserProfile(username);

   // Dynamically update the user state with profile data
   const [user, setUser] = useState<UserState>({
    name: "Loading...",
    username: "@" + (username || "guest"),
  });

  useEffect(() => {
    if (profile && !loading && !error) {
      setUser({
        name: profile.name, // Use the name from the profile
        username: "@" + profile.username,
      });
    }
  }, [profile, loading, error]);

  const handleLogout = async () => {
    const sessionId = localStorage.getItem("sessionId");
  
    if (!sessionId) {
      console.log("No session found, redirecting to login...");
      router.push("/login");
      return;
    }
  
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });
  
      if (response.ok) {
        console.log("Logged out successfully");
      } else {
        const data = await response.json();
        console.error("Logout failed:", data.error);
      }
  
      localStorage.removeItem("sessionId");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("sessionId");
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold tracking-tight">
            CafeStory
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/messages" className="text-sm font-medium transition-colors hover:text-primary">
            Messages
          </Link>
          <Link href="/friends" className="text-sm font-medium transition-colors hover:text-primary">
            Friends
          </Link>
          <div className="flex items-center gap-2 ml-4 border-l pl-4 border-border/40">
            <Link href="/profile" className="flex items-center gap-2 hover:text-primary">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/avatar.jpg" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.username}</p>
              </div>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Logout
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/profile"
                className="flex items-center gap-3 p-2 mb-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/avatar.jpg" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.username}</p>
                </div>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <Coffee className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/messages"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </Link>
              <Link
                href="/friends"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Friends
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center justify-start gap-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
