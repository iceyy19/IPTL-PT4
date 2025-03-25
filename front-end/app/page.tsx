"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { StorySection } from "@/components/story-section";
import { BlogSection } from "@/components/blog-section";
import { Footer } from "@/components/footer";

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 bg-fixed bg-no-repeat">
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pb-20">
          <StorySection />
          <BlogSection />
        </main>
        <Footer />
      </div>

      {/* Background overlay with coffee image */}
      <div
        className="fixed inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: "url('/images/coffee-bg.jpg')",
          backgroundBlendMode: "overlay",
        }}
      />
    </div>
  );
}