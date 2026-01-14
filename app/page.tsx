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
        <div className="flex flex-1 flex-col min-w-0 w-full md:pl-64">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-full" role="main">
            <div className="max-w-[1600px] mx-auto w-full">
              <ErrorBoundary>
                <PortfolioDashboard />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </ErrorBoundary>
    </div>
  )
}
