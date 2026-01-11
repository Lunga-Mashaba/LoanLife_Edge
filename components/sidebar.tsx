"use client"
import { Shield, BarChart3, FileText, Database, Settings, Rocket, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"

const navigation = [
  { name: "Getting Started", icon: Rocket, href: "/getting-started" },
  { name: "Portfolio", icon: BarChart3, href: "/" },
  { name: "Digital Twins", icon: Database, href: "/digital-twins" },
  { name: "Risk Analytics", icon: Shield, href: "/risk-analytics" },
  { name: "Audit Log", icon: FileText, href: "/audit-log" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const closeMobileMenu = () => setIsMobileOpen(false)

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[oklch(0.15_0.03_250)] border border-[oklch(0.25_0.04_250)] text-[oklch(0.90_0.01_250)] md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}

      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "border-r border-[oklch(0.25_0.04_250)] bg-[oklch(0.10_0.02_250)] flex flex-col z-50",
          "w-64 fixed md:static h-screen",
          isMobile && !isMobileOpen && "hidden",
          isMobile && isMobileOpen && "translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}
      >
      {/* Logo */}
      <div className="p-6 border-b border-[oklch(0.25_0.04_250)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative">
            <Image
              src="/images/copilot-20251227-191010.png"
              alt="LoanLife Edge Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <div className="absolute inset-0 blur-md bg-[oklch(0.55_0.20_220)] opacity-30" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-glow-blue text-[oklch(0.95_0.01_250)]">LoanLife</h1>
            <p className="text-xs text-[oklch(0.60_0.02_250)] font-mono">EDGE v1.0</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2" role="navigation" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.10_0.02_250)]",
                isActive
                  ? "bg-[oklch(0.55_0.20_220)] text-white glow-blue"
                  : "text-[oklch(0.70_0.02_250)] hover:bg-[oklch(0.18_0.03_250)] hover:text-[oklch(0.90_0.01_250)]",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-[oklch(0.25_0.04_250)] space-y-3" role="status" aria-live="polite">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="h-4 w-4 text-[oklch(0.70_0.25_145)]" aria-hidden="true" />
          <span className="text-[oklch(0.60_0.02_250)]">Offline-First</span>
          <div className="h-2 w-2 rounded-full bg-[oklch(0.70_0.25_145)] animate-pulse-glow" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Database className="h-4 w-4 text-[oklch(0.55_0.20_220)]" aria-hidden="true" />
          <span className="text-[oklch(0.60_0.02_250)]">Blockchain Synced</span>
          <div className="h-2 w-2 rounded-full bg-[oklch(0.55_0.20_220)] animate-pulse" aria-hidden="true" />
        </div>
      </div>
    </div>
    </>
  )
}
