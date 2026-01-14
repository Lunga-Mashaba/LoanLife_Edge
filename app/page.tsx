import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { PortfolioDashboard } from "@/components/portfolio-dashboard"
import { AnimatedBackground } from "@/components/animated-background"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Page() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate relative">
      <AnimatedBackground />
      <ErrorBoundary>
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 max-w-[1920px] mx-auto w-full md:ml-0">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6" role="main">
            <ErrorBoundary>
              <PortfolioDashboard />
            </ErrorBoundary>
          </main>
        </div>
      </ErrorBoundary>
    </div>
  )
}
