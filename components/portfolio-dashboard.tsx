"use client"

import { LoanHealthGrid } from "@/components/loan-health-grid"
import { RiskTimeline } from "@/components/risk-timeline"
import { ESGCompliance } from "@/components/esg-compliance"
import { AuditLogPanel } from "@/components/audit-log-panel"
import { AIInsights } from "@/components/ai-insights"

export function PortfolioDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[oklch(0.95_0.01_250)] mb-2">Portfolio Overview</h2>
        <p className="text-[oklch(0.60_0.02_250)]">Real-time loan health monitoring with AI-powered predictions</p>
      </div>

      {/* AI Insights Banner */}
      <AIInsights />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <LoanHealthGrid />
          <RiskTimeline />
        </div>
        <div className="space-y-6">
          <ESGCompliance />
          <AuditLogPanel />
        </div>
      </div>
    </div>
  )
}
