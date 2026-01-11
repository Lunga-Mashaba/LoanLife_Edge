/**
 * React hook for fetching predictions for all loans
 */
'use client'

import { useState, useEffect } from 'react'
import { predictionsApi } from '@/lib/api/predictions'
import { loansApi } from '@/lib/api/loans'
import type { RiskPrediction, Loan } from '@/lib/api/types'

export interface TimelineEvent {
  loan_id: string
  loan_name: string
  day: number
  event: string
  severity: 'warning' | 'critical'
  probability: number
  prediction: RiskPrediction['predictions'][string]
}

export function useAllPredictions() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAllPredictions() {
      try {
        setLoading(true)
        setError(null)

        // Get all loans
        const loans = await loansApi.getAll()
        if (cancelled) return

        const allEvents: TimelineEvent[] = []

        // Fetch predictions for each loan
        for (const loan of loans) {
          try {
            const prediction = await predictionsApi.getPredictions(loan.id, [30, 60, 90])
            
            // Extract events for timeline (30, 60, 90 days)
            Object.entries(prediction.predictions).forEach(([horizonKey, pred]) => {
              const days = parseInt(horizonKey.replace('_days', ''))
              const prob = Math.round(pred.breach_probability * 100)
              
              // Only show if risk is significant (>30% probability)
              if (prob > 30) {
                allEvents.push({
                  loan_id: loan.id,
                  loan_name: loan.borrower_name,
                  day: days,
                  event: pred.risk_level === 'critical' 
                    ? 'Covenant Breach Risk' 
                    : pred.risk_level === 'high'
                    ? 'High Risk Alert'
                    : 'Risk Warning',
                  severity: pred.risk_level === 'critical' ? 'critical' : 'warning',
                  probability: prob,
                  prediction: pred,
                })
              }
            })
          } catch (err) {
            console.error(`Failed to fetch predictions for loan ${loan.id}:`, err)
          }
        }

        // Sort by day
        allEvents.sort((a, b) => a.day - b.day)

        if (!cancelled) {
          setEvents(allEvents)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch predictions'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchAllPredictions()

    // Refetch every 60 seconds
    const interval = setInterval(fetchAllPredictions, 60000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return { events, loading, error }
}
