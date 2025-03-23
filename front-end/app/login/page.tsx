"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react" // Import signIn
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coffee, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    emailOrUsername: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }
  
      // Store the token in local storage or cookies
      localStorage.setItem("token", data.token);
  
      // Redirect to the home page or dashboard
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      await signIn("google", { callbackUrl: "/" }); // Redirects user after login
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        <div className="bg-[#9e4a16] rounded-xl shadow-lg p-8 text-white">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="h-6 w-6 text-white" />
              <h1 className="text-2xl font-bold">CafeStory</h1>
            </div>
            <h2 className="text-xl font-semibold text-center mb-1">Log into CafeStory</h2>
            <p className="text-white/70 text-center">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                name="emailOrUsername"
                placeholder="Email or Username"
                value={credentials.emailOrUsername}
                onChange={handleChange}
                required
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2 relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="h-12 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-white/70"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-white text-[#9e4a16] hover:bg-white/90"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link 
              href="/forgot-password" 
              className="text-white hover:text-white/80 text-sm underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#9e4a16] text-white/70">OR</span>
            </div>
          </div>

          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-2 border-white/20 text-white hover:bg-white/10"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
              </g>
            </svg>
            Login with Google
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-white hover:text-white/80 underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
