"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useAllPredictions } from "@/hooks/use-all-predictions"
import { SkeletonCard } from "@/components/ui/skeleton-loader"
import Link from "next/link"

export function RiskTimeline() {
  const { events, loading, error } = useAllPredictions()

  return (
    <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)]">Predictive Risk Timeline</h3>
        <span className="text-xs text-[oklch(0.60_0.02_250)] font-mono">Next 90 Days</span>
      </div>

      {loading ? (
        <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading risk timeline">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.55_0.20_25)]">
          <p className="text-sm text-[oklch(0.55_0.20_25)]">Failed to load risk timeline</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)]">
          <p className="text-sm text-[oklch(0.60_0.02_250)]">No risk events predicted in the next 90 days</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-[oklch(0.70_0.25_145)] via-[oklch(0.75_0.20_60)] to-[oklch(0.55_0.20_25)] rounded-full" aria-hidden="true" />

          {/* Day Markers */}
          <div className="flex justify-between mb-12 pt-6">
            {[0, 30, 60, 90].map((day) => (
              <div key={day} className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-[oklch(0.55_0.20_220)] border-2 border-[oklch(0.15_0.03_250)] mb-2" aria-hidden="true" />
                <span className="text-xs text-[oklch(0.60_0.02_250)] font-mono">Day {day}</span>
              </div>
            ))}
          </div>

          {/* Risk Events */}
          <div className="space-y-4">
            {events.map((event, idx) => (
              <Link
                key={`${event.loan_id}-${event.day}-${idx}`}
                href={`/digital-twins?loan=${event.loan_id}`}
                className="block p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] hover:border-[oklch(0.55_0.20_220)] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.15_0.03_250)]"
                aria-label={`Risk event for ${event.loan_name} on day ${event.day}: ${event.probability}% probability`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <AlertTriangle
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                        event.severity === "critical" ? "text-[oklch(0.55_0.20_25)]" : "text-[oklch(0.75_0.20_60)]"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[oklch(0.90_0.01_250)]">{event.event}</p>
                      <p className="text-xs text-[oklch(0.60_0.02_250)] mt-1 font-mono truncate">
                        {event.loan_name} • Day {event.day}
                      </p>
                      {event.prediction?.key_factors && event.prediction.key_factors.length > 0 && (
                        <p className="text-xs text-[oklch(0.60_0.02_250)] mt-1">
                          {event.prediction.key_factors[0]}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
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
              </Link>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
