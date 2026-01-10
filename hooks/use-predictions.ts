/**
 * React hook for fetching risk predictions
 */
'use client'

import { useState, useEffect } from 'react'
import { predictionsApi } from '@/lib/api/predictions'
import type { RiskPrediction } from '@/lib/api/types'

export function usePredictions(loanId: string | null, horizons: number[] = [30, 60, 90]) {
  const [predictions, setPredictions] = useState<RiskPrediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!loanId) {
      setPredictions(null)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchPredictions() {
      try {
        setLoading(true)
        setError(null)
        const data = await predictionsApi.getPredictions(loanId, horizons)
        if (!cancelled) {
          setPredictions(data)
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

    fetchPredictions()

    // Refetch every 60 seconds for updated predictions
    const interval = setInterval(fetchPredictions, 60000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [loanId, horizons.join(',')])

  return { predictions, loading, error }
}
