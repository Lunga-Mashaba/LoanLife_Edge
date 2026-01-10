import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { PortfolioDashboard } from "@/components/portfolio-dashboard"
import { AnimatedBackground } from "@/components/animated-background"

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <PortfolioDashboard />
        </main>
      </div>
    </div>
  )
}
