"use client"
import { Shield, BarChart3, FileText, Database, Settings, Rocket, X } from "lucide-react"
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

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen)
  const closeMobileMenu = () => setIsMobileOpen(false)

  // Listen for toggle events from TopBar
  useEffect(() => {
    const handleToggle = () => toggleMobileMenu()
    window.addEventListener('toggleSidebar', handleToggle)
    return () => window.removeEventListener('toggleSidebar', handleToggle)
  }, [])

  return (
    <>

      {/* Mobile overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "border-r border-[oklch(0.25_0.04_250)] dark:border-[oklch(0.25_0.04_250)] light:border-[oklch(0.85_0.02_250)] bg-[oklch(0.10_0.02_250)] dark:bg-[oklch(0.10_0.02_250)] light:bg-[oklch(0.96_0.01_250)] flex flex-col z-50",
          "w-64 fixed h-screen",
          isMobile && !isMobileOpen && "-translate-x-full",
          isMobile && isMobileOpen && "translate-x-0",
          "transition-transform duration-300 ease-in-out"
        )}
      >
      {/* Logo */}
      <div className="p-4 sm:p-6 border-b border-[oklch(0.25_0.04_250)] dark:border-[oklch(0.25_0.04_250)] light:border-[oklch(0.85_0.02_250)]">
        <Link href="/" className="flex items-center gap-2 sm:gap-3" onClick={closeMobileMenu}>
          <div className="relative">
            <Image
              src="/images/copilot-20251227-191010.png"
              alt="LoanLife Edge Logo"
              width={28}
              height={28}
              className="object-contain sm:w-8 sm:h-8"
            />
            <div className="absolute inset-0 blur-md bg-[oklch(0.55_0.20_220)] opacity-30" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-glow-blue text-[oklch(0.95_0.01_250)] dark:text-[oklch(0.95_0.01_250)] light:text-[oklch(0.15_0.02_250)]">LoanLife</h1>
            <p className="text-xs text-[oklch(0.60_0.02_250)] dark:text-[oklch(0.60_0.02_250)] light:text-[oklch(0.40_0.02_250)] font-mono">EDGE v1.0</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto" role="navigation" aria-label="Main navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMobileMenu}
              className={cn(
                "w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.10_0.02_250)]",
                isActive
                  ? "bg-[oklch(0.55_0.20_220)] text-white glow-blue"
                  : "text-[oklch(0.70_0.02_250)] dark:text-[oklch(0.70_0.02_250)] light:text-[oklch(0.40_0.02_250)] hover:bg-[oklch(0.18_0.03_250)] dark:hover:bg-[oklch(0.18_0.03_250)] light:hover:bg-[oklch(0.92_0.01_250)] hover:text-[oklch(0.90_0.01_250)] dark:hover:text-[oklch(0.90_0.01_250)] light:hover:text-[oklch(0.15_0.02_250)]",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-3 sm:p-4 border-t border-[oklch(0.25_0.04_250)] dark:border-[oklch(0.25_0.04_250)] light:border-[oklch(0.85_0.02_250)] space-y-2 sm:space-y-3" role="status" aria-live="polite">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[oklch(0.70_0.25_145)] flex-shrink-0" aria-hidden="true" />
          <span className="text-[oklch(0.60_0.02_250)] dark:text-[oklch(0.60_0.02_250)] light:text-[oklch(0.40_0.02_250)] truncate">Offline-First</span>
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[oklch(0.70_0.25_145)] animate-pulse-glow flex-shrink-0" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Database className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[oklch(0.55_0.20_220)] flex-shrink-0" aria-hidden="true" />
          <span className="text-[oklch(0.60_0.02_250)] dark:text-[oklch(0.60_0.02_250)] light:text-[oklch(0.40_0.02_250)] truncate">Blockchain Synced</span>
          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[oklch(0.55_0.20_220)] animate-pulse flex-shrink-0" aria-hidden="true" />
        </div>
      </div>
    </div>
    </>
  )
}
