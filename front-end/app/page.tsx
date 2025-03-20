import { Header } from "@/components/header"
import { StorySection } from "@/components/story-section"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"

export default function Home() {
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
  )
}

