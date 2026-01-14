"use client"

import { MemoizedLoanHealthGrid } from "@/components/loan-health-grid"
import { MemoizedRiskTimeline } from "@/components/risk-timeline"
import { MemoizedESGCompliance } from "@/components/esg-compliance"
import { MemoizedAuditLogPanel } from "@/components/audit-log-panel"
import { MemoizedAIInsights } from "@/components/ai-insights"
import { memo } from "react"

export function PortfolioDashboard() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      {/* Header */}
      <header className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Portfolio Overview</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Real-time loan health monitoring with AI-powered predictions</p>
      </header>

      {/* AI Insights Banner */}
      <MemoizedAIInsights />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          <MemoizedLoanHealthGrid />
          <MemoizedRiskTimeline />
        </div>
        <div className="space-y-4 sm:space-y-6 min-w-0">
          <MemoizedESGCompliance />
          <MemoizedAuditLogPanel />
        </div>
      </div>
    </div>
  )
}

// Memoize dashboard to prevent unnecessary re-renders
export const MemoizedPortfolioDashboard = memo(PortfolioDashboard)
