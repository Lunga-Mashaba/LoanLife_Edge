"use client"

import { useState, useEffect, useMemo, memo } from "react"
import { Card } from "@/components/ui/card"
import { Sparkles, ChevronDown, ChevronUp, Brain, AlertTriangle, Loader2 } from "lucide-react"
import { useAllPredictions } from "@/hooks/use-all-predictions"
import Link from "next/link"

function AIInsights() {
  const [expanded, setExpanded] = useState(false)
  const { events, loading, error } = useAllPredictions()

  // Get the most critical prediction
  const criticalEvent = useMemo(() => {
    if (events.length === 0) return null
    return events
      .filter(e => e.severity === 'critical')
      .sort((a, b) => b.probability - a.probability)[0] || 
      events.sort((a, b) => b.probability - a.probability)[0]
  }, [events])

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-r from-[oklch(0.50_0.22_290)]/20 to-[oklch(0.55_0.20_220)]/20 border-[oklch(0.50_0.22_290)]">
        <div className="flex items-center justify-center py-4" role="status" aria-live="polite" aria-label="Loading AI insights">
          <Loader2 className="h-5 w-5 animate-spin text-[oklch(0.55_0.20_220)]" />
          <span className="ml-2 text-sm text-muted-foreground">Loading AI insights...</span>
        </div>
      </Card>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Card className="p-6 bg-gradient-to-r from-[oklch(0.50_0.22_290)]/20 to-[oklch(0.55_0.20_220)]/20 border-[oklch(0.50_0.22_290)]">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[oklch(0.50_0.22_290)]">
            <Brain className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[oklch(0.60_0.22_290)]" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-card-foreground">AI Risk Prediction</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Unable to load predictions. Please try refreshing the page.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  if (!criticalEvent || events.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-[oklch(0.50_0.22_290)]/20 to-[oklch(0.55_0.20_220)]/20 border-[oklch(0.50_0.22_290)]">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[oklch(0.50_0.22_290)]">
            <Brain className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-[oklch(0.60_0.22_290)]" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-card-foreground">AI Risk Prediction</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              No critical risk alerts at this time. All loans are within acceptable risk parameters.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const explanation = criticalEvent.prediction?.explanation
  const keyFactors = criticalEvent.prediction?.key_factors || []

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r from-[oklch(0.50_0.22_290)]/20 to-[oklch(0.55_0.20_220)]/20 border-[oklch(0.50_0.22_290)] glow-purple">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="p-2 sm:p-3 rounded-lg bg-[oklch(0.50_0.22_290)] glow-purple flex-shrink-0">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.60_0.22_290)] flex-shrink-0" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground">AI Risk Prediction</h3>
              {criticalEvent.severity === 'critical' && (
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.55_0.20_25)] flex-shrink-0" aria-label="Critical alert" />
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">
              <span className={criticalEvent.severity === 'critical' ? 'font-semibold text-[oklch(0.55_0.20_25)]' : ''}>
                {criticalEvent.severity === 'critical' ? 'Critical alert: ' : 'Alert: '}
              </span>
              <Link 
                href={`/digital-twins?loan=${criticalEvent.loan_id}`}
                className="underline hover:no-underline break-words"
              >
                {criticalEvent.loan_name}
              </Link>
              {' '}shows {criticalEvent.probability}% probability of {criticalEvent.event.toLowerCase()} within {criticalEvent.day} days.
              {explanation?.summary && ` ${explanation.summary}`}
            </p>
            {expanded && explanation && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg bg-muted border border-border space-y-3" role="region" aria-label="Detailed AI insights">
                {keyFactors.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[oklch(0.70_0.25_145)] mb-1">Key Indicators:</p>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 ml-4">
                      {keyFactors.slice(0, 3).map((factor, idx) => (
                        <li key={idx}>• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {explanation.factors && explanation.factors.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[oklch(0.55_0.20_220)] mb-1">Recommended Actions:</p>
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 ml-4">
                      {explanation.factors
                        .filter((f: any) => f.impact === 'high')
                        .slice(0, 3)
                        .map((factor: any, idx: number) => (
                          <li key={idx}>• {factor.description}</li>
                        ))}
                      {explanation.factors.filter((f: any) => f.impact === 'high').length === 0 && (
                        <li>• Schedule borrower review meeting</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)] flex-shrink-0"
          aria-label={expanded ? "Collapse insights" : "Expand insights"}
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" aria-hidden="true" />
          )}
        </button>
      </div>
    </Card>
  )
}

export const MemoizedAIInsights = memo(AIInsights)
