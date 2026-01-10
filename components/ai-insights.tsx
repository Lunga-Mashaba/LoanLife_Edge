"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Sparkles, ChevronDown, ChevronUp, Brain } from "lucide-react"

export function AIInsights() {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="p-6 bg-gradient-to-r from-[oklch(0.50_0.22_290)]/20 to-[oklch(0.55_0.20_220)]/20 border-[oklch(0.50_0.22_290)] glow-purple">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-lg bg-[oklch(0.50_0.22_290)] glow-purple">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[oklch(0.60_0.22_290)]" />
              <h3 className="text-lg font-semibold text-[oklch(0.95_0.01_250)]">AI Risk Prediction</h3>
            </div>
            <p className="text-sm text-[oklch(0.80_0.01_250)] mb-3">
              Critical alert: LN-2024-004 shows 85% probability of payment default within 60 days based on declining
              cash flow patterns and market volatility.
            </p>
            {expanded && (
              <div className="mt-4 p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] space-y-3">
                <div>
                  <p className="text-xs font-medium text-[oklch(0.70_0.25_145)] mb-1">Key Indicators:</p>
                  <ul className="text-sm text-[oklch(0.80_0.01_250)] space-y-1 ml-4">
                    <li>• Revenue decreased 24% over last 2 quarters</li>
                    <li>• Debt-to-equity ratio increased to 2.8x</li>
                    <li>• Industry sector showing 15% downturn</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-[oklch(0.55_0.20_220)] mb-1">Recommended Actions:</p>
                  <ul className="text-sm text-[oklch(0.80_0.01_250)] space-y-1 ml-4">
                    <li>• Schedule immediate borrower review meeting</li>
                    <li>• Consider covenant restructuring</li>
                    <li>• Increase monitoring frequency to weekly</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-[oklch(0.18_0.03_250)] rounded-lg transition-colors"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-[oklch(0.60_0.02_250)]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[oklch(0.60_0.02_250)]" />
          )}
        </button>
      </div>
    </Card>
  )
}
