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

        // Get all loans with timeout protection
        let loans: Loan[] = []
        try {
          // Use Promise.race to add a timeout
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Loans fetch timeout')), 10000) // 10 second timeout
          )
          
          loans = await Promise.race([loansApi.getAll(), timeoutPromise])
        } catch (err) {
          console.error('Failed to fetch loans:', err)
          // Continue with empty array if loans fetch fails
          loans = []
        }
        
        if (cancelled) {
          setLoading(false)
          return
        }

        // If no loans, set loading to false immediately
        if (loans.length === 0) {
          setEvents([])
          setLoading(false)
          return
        }

        const allEvents: TimelineEvent[] = []

        // Fetch predictions for each loan (with error handling per loan)
        for (const loan of loans) {
          try {
            const prediction = await predictionsApi.getPredictions(loan.id, [30, 60, 90])
            
            // Verify prediction has the expected structure
            if (!prediction || !prediction.predictions) {
              console.warn(`Invalid prediction response for loan ${loan.id}`)
              continue
            }
            
            // Extract events for timeline (30, 60, 90 days)
            Object.entries(prediction.predictions).forEach(([horizonKey, pred]: [string, any]) => {
              try {
                const days = parseInt(horizonKey.replace('_days', ''))
                
                // Handle different probability formats (percentage or decimal)
                // Backend returns `probability` as decimal (0-1), frontend type expects `breach_probability`
                let prob: number
                const probability = pred.breach_probability ?? pred.probability
                
                if (typeof probability === 'number') {
                  // Convert decimal to percentage if needed
                  prob = probability <= 1 ? Math.round(probability * 100) : Math.round(probability)
                } else {
                  console.warn(`Invalid probability format for loan ${loan.id}, horizon ${horizonKey}:`, pred)
                  return
                }
                
                // Validate risk level
                const riskLevel = pred.risk_level || 'low'
                
                // Only show if risk is significant (>30% probability)
                if (prob > 30 && !isNaN(days)) {
                  allEvents.push({
                    loan_id: loan.id,
                    loan_name: loan.borrower_name || 'Unknown Loan',
                    day: days,
                    event: riskLevel === 'critical' 
                      ? 'Covenant Breach Risk' 
                      : riskLevel === 'high'
                      ? 'High Risk Alert'
                      : 'Risk Warning',
                    severity: (riskLevel === 'critical' ? 'critical' : 'warning') as 'warning' | 'critical',
                    probability: prob,
                    prediction: pred,
                  })
                }
              } catch (entryErr) {
                console.warn(`Error processing prediction entry for loan ${loan.id}, horizon ${horizonKey}:`, entryErr)
              }
            })
          } catch (err: any) {
            // Log but continue - some loans may not have predictions yet
            // This is expected for new loans or if the backend is still processing
            if (err?.status === 404) {
              // Loan not found - skip silently (might be deleted or not yet created)
              continue
            } else if (err?.status === 500) {
              // Server error - might be generating predictions, skip this loan
              console.warn(`Server error fetching predictions for loan ${loan.id}:`, err.message || err)
              continue
            } else {
              // Other errors - log and continue
              console.warn(`Failed to fetch predictions for loan ${loan.id}:`, err.message || err)
              continue
            }
          }
        }

        // Sort by day
        allEvents.sort((a, b) => a.day - b.day)

        if (!cancelled) {
          setEvents(allEvents)
          setLoading(false)
        }
      } catch (err) {
        console.error('Error in fetchAllPredictions:', err)
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch predictions'))
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
