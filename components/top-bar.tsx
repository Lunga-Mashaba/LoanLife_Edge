"use client"

import { Bell, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TopBar() {
  return (
    <div className="h-16 border-b border-[oklch(0.25_0.04_250)] bg-[oklch(0.13_0.02_250)]/80 backdrop-blur-xl px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.60_0.02_250)]" />
          <Input
            placeholder="Search loans, covenants, ESG metrics..."
            className="pl-10 bg-[oklch(0.18_0.03_250)] border-[oklch(0.25_0.04_250)] text-[oklch(0.90_0.01_250)] placeholder:text-[oklch(0.50_0.02_250)]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link href="/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-[oklch(0.70_0.02_250)]" />
            <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[oklch(0.55_0.20_25)] animate-pulse" />
          </Button>
        </Link>
        <div className="w-px h-6 bg-[oklch(0.25_0.04_250)]" />
        <Link href="/login">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5 text-[oklch(0.70_0.02_250)]" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
