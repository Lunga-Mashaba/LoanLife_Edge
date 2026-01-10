"use client"
import { Shield, BarChart3, FileText, Database, Settings, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

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

  return (
    <div className="w-64 border-r border-[oklch(0.25_0.04_250)] bg-[oklch(0.10_0.02_250)] flex flex-col">
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
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[oklch(0.55_0.20_220)] text-white glow-blue"
                  : "text-[oklch(0.70_0.02_250)] hover:bg-[oklch(0.18_0.03_250)] hover:text-[oklch(0.90_0.01_250)]",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Status Footer */}
      <div className="p-4 border-t border-[oklch(0.25_0.04_250)] space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <Shield className="h-4 w-4 text-[oklch(0.70_0.25_145)]" />
          <span className="text-[oklch(0.60_0.02_250)]">Offline-First</span>
          <div className="h-2 w-2 rounded-full bg-[oklch(0.70_0.25_145)] animate-pulse-glow" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Database className="h-4 w-4 text-[oklch(0.55_0.20_220)]" />
          <span className="text-[oklch(0.60_0.02_250)]">Blockchain Synced</span>
          <div className="h-2 w-2 rounded-full bg-[oklch(0.55_0.20_220)] animate-pulse" />
        </div>
      </div>
    </div>
  )
}
