"use client"

import { MemoizedLoanHealthGrid } from "@/components/loan-health-grid"
import { MemoizedRiskTimeline } from "@/components/risk-timeline"
import { MemoizedESGCompliance } from "@/components/esg-compliance"
import { MemoizedAuditLogPanel } from "@/components/audit-log-panel"
import { MemoizedAIInsights } from "@/components/ai-insights"
import { memo } from "react"

export function PortfolioDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-[oklch(0.95_0.01_250)] mb-2">Portfolio Overview</h1>
        <p className="text-[oklch(0.60_0.02_250)]">Real-time loan health monitoring with AI-powered predictions</p>
      </header>

      {/* AI Insights Banner */}
      <MemoizedAIInsights />

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <MemoizedLoanHealthGrid />
          <MemoizedRiskTimeline />
        </div>
        <div className="space-y-6">
          <MemoizedESGCompliance />
          <MemoizedAuditLogPanel />
        </div>
      </div>
    </div>
  )
}

// Memoize dashboard to prevent unnecessary re-renders
export const MemoizedPortfolioDashboard = memo(PortfolioDashboard)
