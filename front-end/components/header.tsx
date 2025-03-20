"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Coffee, Menu, MessageSquare, User, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState({ name: "Coffee Lover", username: "@coffeelover" })

  const handleLogout = async () => {
    try {
      await fetch("/auth/logout", { method: "GET" })
      window.location.replace("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

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
          <Link href="/profile" className="text-sm font-medium transition-colors hover:text-primary">
            Profile
          </Link>
          <div className="flex items-center gap-2 ml-4 border-l pl-4 border-border/40">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/avatar.jpg" alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.username}</p>
            </div>
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
              <div className="flex items-center gap-3 p-2 mb-4 bg-muted/20 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/avatar.jpg" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.username}</p>
                </div>
              </div>
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
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
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

