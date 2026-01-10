"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

const riskEvents = [
  { day: 30, loan: "LN-2024-003", event: "Covenant Breach Risk", severity: "warning", probability: 68 },
  { day: 60, loan: "LN-2024-004", event: "Payment Default Risk", severity: "critical", probability: 85 },
  { day: 90, loan: "LN-2024-006", event: "ESG Compliance Issue", severity: "warning", probability: 52 },
]

export function RiskTimeline() {
  return (
    <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)]">Predictive Risk Timeline</h3>
        <span className="text-xs text-[oklch(0.60_0.02_250)] font-mono">Next 90 Days</span>
      </div>

      {/* Timeline Visualization */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-[oklch(0.70_0.25_145)] via-[oklch(0.75_0.20_60)] to-[oklch(0.55_0.20_25)] rounded-full" />

        {/* Day Markers */}
        <div className="flex justify-between mb-12 pt-6">
          {[0, 30, 60, 90].map((day) => (
            <div key={day} className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-[oklch(0.55_0.20_220)] border-2 border-[oklch(0.15_0.03_250)] mb-2" />
              <span className="text-xs text-[oklch(0.60_0.02_250)] font-mono">Day {day}</span>
            </div>
          ))}
        </div>

        {/* Risk Events */}
        <div className="space-y-4">
          {riskEvents.map((event, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] hover:border-[oklch(0.55_0.20_220)] transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${
                      event.severity === "critical" ? "text-[oklch(0.55_0.20_25)]" : "text-[oklch(0.75_0.20_60)]"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-[oklch(0.90_0.01_250)]">{event.event}</p>
                    <p className="text-xs text-[oklch(0.60_0.02_250)] mt-1 font-mono">
                      {event.loan} • Day {event.day}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      event.severity === "critical" ? "text-[oklch(0.55_0.20_25)]" : "text-[oklch(0.75_0.20_60)]"
                    }`}
                  >
                    {event.probability}%
                  </p>
                  <p className="text-xs text-[oklch(0.60_0.02_250)]">Risk</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
