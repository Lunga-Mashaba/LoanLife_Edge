/**
 * React hook for fetching loans
 */
'use client'

import { useState, useEffect } from 'react'
import { loansApi } from '@/lib/api/loans'
import type { Loan, LoanState } from '@/lib/api/types'
import { ApiError } from '@/lib/api/client'

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchLoans() {
      try {
        setLoading(true)
        setError(null)
        const data = await loansApi.getAll()
        if (!cancelled) {
          setLoans(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch loans'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchLoans()

    return () => {
      cancelled = true
    }
  }, [])

  return { loans, loading, error, refetch: () => {
    setLoading(true)
    loansApi.getAll().then(setLoans).catch(setError).finally(() => setLoading(false))
  } }
}

export function useLoan(loanId: string | null) {
  const [loan, setLoan] = useState<Loan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!loanId) {
      setLoan(null)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchLoan() {
      try {
        setLoading(true)
        setError(null)
        const data = await loansApi.getById(loanId)
        if (!cancelled) {
          setLoan(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch loan'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchLoan()

    return () => {
      cancelled = true
    }
  }, [loanId])

  return { loan, loading, error }
}

export function useLoanState(loanId: string | null) {
  const [state, setState] = useState<LoanState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!loanId) {
      setState(null)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchState() {
      try {
        setLoading(true)
        setError(null)
        const data = await loansApi.getState(loanId)
        if (!cancelled) {
          setState(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch loan state'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchState()

    // Refetch every 30 seconds for real-time updates
    const interval = setInterval(fetchState, 30000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [loanId])

  return { state, loading, error }
}
