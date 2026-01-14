"use client"

import type React from "react"

import { useState } from "react"
import { Lock, Mail, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validation
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }
    
    if (!password.trim()) {
      setError("Please enter your password")
      return
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    // Simple demo login - accepts any email/password combination
    setLoading(true)
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    
    try {
      // For demo purposes, any email/password combination works
      // In production, this would call an authentication API
      router.push("/")
    } catch (err) {
      setError("Login failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="relative">
              <Image
                src="/images/copilot-20251227-191010.png"
                alt="LoanLife Edge Logo"
                width={64}
                height={64}
                className="object-contain animate-pulse-glow w-12 h-12 sm:w-16 sm:h-16"
              />
              <div className="absolute inset-0 blur-xl bg-[oklch(0.55_0.20_220)] opacity-50" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-glow-blue text-[oklch(0.95_0.01_250)] mb-1 sm:mb-2">LoanLife Edge</h1>
          <p className="text-[oklch(0.60_0.02_250)] text-xs sm:text-sm font-mono">Enterprise Risk Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-[oklch(0.14_0.02_250)] border border-[oklch(0.25_0.04_250)] rounded-xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-1 sm:mb-2">Secure Login</h2>
            <p className="text-xs sm:text-sm text-[oklch(0.60_0.02_250)]">Access your risk analytics dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[oklch(0.18_0.03_25)] border border-[oklch(0.55_0.20_25)] flex items-center gap-2 text-sm text-[oklch(0.65_0.22_25)]">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4 sm:space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[oklch(0.80_0.02_250)] mb-1.5 sm:mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.50_0.02_250)]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("") // Clear error when user types
                  }}
                  placeholder="admin@loanlife.edge"
                  className="pl-9 sm:pl-10 bg-[oklch(0.10_0.02_250)] border-[oklch(0.30_0.04_250)] text-[oklch(0.95_0.01_250)] h-10 sm:h-11 text-sm sm:text-base"
                  disabled={loading}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "email-error" : undefined}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-[oklch(0.80_0.02_250)] mb-1.5 sm:mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.50_0.02_250)]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("") // Clear error when user types
                  }}
                  placeholder="••••••••"
                  className="pl-9 sm:pl-10 bg-[oklch(0.10_0.02_250)] border-[oklch(0.30_0.04_250)] text-[oklch(0.95_0.01_250)] h-10 sm:h-11 text-sm sm:text-base"
                  disabled={loading}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "password-error" : undefined}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 sm:h-11 bg-[oklch(0.55_0.20_220)] hover:bg-[oklch(0.60_0.22_220)] disabled:opacity-50 disabled:cursor-not-allowed text-white glow-blue transition-all duration-200 text-sm sm:text-base"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[oklch(0.25_0.04_250)]">
            <div className="flex items-center justify-center gap-2 text-xs text-[oklch(0.60_0.02_250)]">
              <Lock className="h-3 w-3 text-[oklch(0.70_0.25_145)] flex-shrink-0" />
              <span className="text-center">256-bit end-to-end encryption</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[oklch(0.50_0.02_250)] mt-4 sm:mt-6 font-mono px-4">
          LoanLife Edge v1.0 | Offline-First Architecture
        </p>
      </div>
    </div>
  )
}
