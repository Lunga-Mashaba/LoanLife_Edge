"use client"

import { Bell, Search, User, X, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useSearchContext } from "@/lib/search-context"
import { useIsMobile } from "@/hooks/use-mobile"

export function TopBar() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearchContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useIsMobile()
  
  const handleMenuClick = () => {
    // Dispatch custom event to toggle sidebar
    window.dispatchEvent(new CustomEvent('toggleSidebar'))
  }

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="sticky top-0 z-40 h-14 sm:h-16 border-b border-[oklch(0.25_0.04_250)] bg-[oklch(0.13_0.02_250)]/80 backdrop-blur-xl px-2 sm:px-4 md:px-6 flex items-center justify-between gap-2">
      {/* Hamburger Menu Button - Mobile Only */}
      {isMobile && onMenuClick && (
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg bg-[oklch(0.15_0.03_250)] border border-[oklch(0.25_0.04_250)] text-[oklch(0.90_0.01_250)] hover:bg-[oklch(0.20_0.03_250)] transition-colors flex-shrink-0"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      
      {/* Search */}
      <div className="flex-1 min-w-0 max-w-xl md:max-w-xl">
        <div className="relative">
          <Search 
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[oklch(0.60_0.02_250)]" 
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search... (⌘K)"
            className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-sm sm:text-base bg-[oklch(0.18_0.03_250)] border-[oklch(0.25_0.04_250)] text-[oklch(0.90_0.01_250)] placeholder:text-[oklch(0.50_0.02_250)] focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)]"
            aria-label="Search loans, covenants, and ESG metrics"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[oklch(0.25_0.04_250)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)]"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[oklch(0.60_0.02_250)]" />
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        <Link href="/notifications" aria-label="Notifications">
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 relative focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)]">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.70_0.02_250)]" aria-hidden="true" />
            <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[oklch(0.55_0.20_25)] animate-pulse" aria-hidden="true" />
            <span className="sr-only">Notifications</span>
          </Button>
        </Link>
        <div className="w-px h-4 sm:h-6 bg-[oklch(0.25_0.04_250)]" aria-hidden="true" />
        <Link href="/login" aria-label="User account">
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)]">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.70_0.02_250)]" aria-hidden="true" />
            <span className="sr-only">User account</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
