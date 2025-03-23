"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { StorySection } from "@/components/story-section";
import { BlogSection } from "@/components/blog-section";
import { Footer } from "@/components/footer";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage

      if (token) {
        // Optionally, validate the token with an API call
        try {
          const response = await fetch("/api/validate-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            throw new Error("Invalid token");
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          setIsAuthenticated(false);
          router.push("/login"); // Redirect to login if token is invalid
        }
      } else {
        console.log("No token found, redirecting...");
        setIsAuthenticated(false);
        router.push("/login"); // Redirect to login if no token is found
      }

      setIsLoading(false); // Stop loading after token check
    };

    checkToken();
  }, [router]);

  if (isLoading) {
    // Show a loading state while checking the token
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

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