/**
 * React hook for fetching ESG data
 */
'use client'

import { useState, useEffect } from 'react'
import { esgApi } from '@/lib/api/esg'
import type { ESGScore, ESGCompliance } from '@/lib/api/types'

export function useESGScore(loanId: string | null) {
  const [score, setScore] = useState<ESGScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!loanId) {
      setScore(null)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchScore() {
      try {
        setLoading(true)
        setError(null)
        const data = await esgApi.getScore(loanId as string)
        if (!cancelled) {
          setScore(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch ESG score'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchScore()

    return () => {
      cancelled = true
    }
  }, [loanId])

  return { score, loading, error }
}

export function useESGCompliance(loanId: string | null) {
  const [compliance, setCompliance] = useState<ESGCompliance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!loanId) {
      setCompliance(null)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchCompliance() {
      try {
        setLoading(true)
        setError(null)
        const data = await esgApi.getCompliance(loanId as string)
        if (!cancelled) {
          setCompliance(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch ESG compliance'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchCompliance()

    return () => {
      cancelled = true
    }
  }, [loanId])

  return { compliance, loading, error }
}
