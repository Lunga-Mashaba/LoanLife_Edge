/**
 * React hook for fetching predictions for all loans
 * Optimized with parallel fetching and caching
 */
'use client'

import { useState, useEffect, useRef } from 'react'
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
  const lastFetchRef = useRef<number>(0)
  const isFetchingRef = useRef<boolean>(false)

  useEffect(() => {
    let cancelled = false

    async function fetchAllPredictions() {
      // Prevent concurrent fetches
      if (isFetchingRef.current) return
      
      // Throttle: don't fetch more than once every 5 seconds
      const now = Date.now()
      if (now - lastFetchRef.current < 5000 && events.length > 0) {
        return
      }

      isFetchingRef.current = true
      lastFetchRef.current = now

      try {
        // Don't show loading if we have cached data (stale-while-revalidate)
        const hasCachedData = events.length > 0
        if (!hasCachedData) {
          setLoading(true)
        }
        setError(null)

        // Get all loans with timeout protection
        let loans: Loan[] = []
        try {
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Loans fetch timeout')), 8000) // 8 second timeout
          )
          
          loans = await Promise.race([loansApi.getAll(), timeoutPromise])
        } catch (err) {
          console.error('Failed to fetch loans:', err)
          loans = []
        }
        
        if (cancelled) {
          isFetchingRef.current = false
          if (!hasCachedData) setLoading(false)
          return
        }

        // If no loans, set loading to false immediately
        if (loans.length === 0) {
          setEvents([])
          setLoading(false)
          isFetchingRef.current = false
          return
        }

        // Limit to first 10 loans for performance
        const loansToProcess = loans.slice(0, 10)
        
        // PARALLEL FETCHING: Fetch all predictions simultaneously
        const predictionPromises = loansToProcess.map(async (loan) => {
          try {
            return {
              loan,
              prediction: await predictionsApi.getPredictions(loan.id, [30, 60, 90]),
            }
          } catch (err: any) {
            // Silently skip failed predictions
            if (err?.status === 404 || err?.status === 500) {
              return null
            }
            console.warn(`Failed to fetch predictions for loan ${loan.id}:`, err.message || err)
            return null
          }
        })

        // Wait for all predictions (with timeout)
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Predictions fetch timeout')), 15000) // 15 second timeout
        )

        const results = await Promise.race([
          Promise.all(predictionPromises),
          timeoutPromise,
        ])

        if (cancelled) {
          isFetchingRef.current = false
          if (!hasCachedData) setLoading(false)
          return
        }

        const allEvents: TimelineEvent[] = []

        // Process results
        for (const result of results) {
          if (!result || !result.prediction) continue
          
          const { loan, prediction } = result
          
          try {
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
      } finally {
        isFetchingRef.current = false
      }
    }

    fetchAllPredictions()

    // Refetch every 120 seconds (reduced frequency for better performance)
    const interval = setInterval(fetchAllPredictions, 120000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, []) // Empty deps - fetch on mount and interval only

  return { events, loading, error }
}
