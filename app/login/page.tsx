"use client"

import type React from "react"

import { useState } from "react"
import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple validation
    if (email && password) {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <Image
                src="/images/copilot-20251227-191010.png"
                alt="LoanLife Edge Logo"
                width={64}
                height={64}
                className="object-contain animate-pulse-glow"
              />
              <div className="absolute inset-0 blur-xl bg-[oklch(0.55_0.20_220)] opacity-50" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-glow-blue text-[oklch(0.95_0.01_250)] mb-2">LoanLife Edge</h1>
          <p className="text-[oklch(0.60_0.02_250)] text-sm font-mono">Enterprise Risk Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-[oklch(0.14_0.02_250)] border border-[oklch(0.25_0.04_250)] rounded-xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-2">Secure Login</h2>
            <p className="text-sm text-[oklch(0.60_0.02_250)]">Access your risk analytics dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-[oklch(0.80_0.02_250)] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[oklch(0.50_0.02_250)]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@loanlife.edge"
                  className="pl-10 bg-[oklch(0.10_0.02_250)] border-[oklch(0.30_0.04_250)] text-[oklch(0.95_0.01_250)] h-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[oklch(0.80_0.02_250)] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[oklch(0.50_0.02_250)]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-[oklch(0.10_0.02_250)] border-[oklch(0.30_0.04_250)] text-[oklch(0.95_0.01_250)] h-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[oklch(0.55_0.20_220)] hover:bg-[oklch(0.60_0.22_220)] text-white glow-blue transition-all duration-200"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[oklch(0.25_0.04_250)]">
            <div className="flex items-center gap-2 text-xs text-[oklch(0.60_0.02_250)]">
              <Lock className="h-3 w-3 text-[oklch(0.70_0.25_145)]" />
              <span>256-bit end-to-end encryption</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[oklch(0.50_0.02_250)] mt-6 font-mono">
          LoanLife Edge v1.0 | Offline-First Architecture
        </p>
      </div>
    </div>
  )
}
