"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useLoans } from "@/hooks/use-loans"
import Link from "next/link"
import { useState, useEffect, useMemo, memo } from "react"
import type { LoanState, Loan } from "@/lib/api/types"
import { loansApi } from "@/lib/api/loans"
import { useSearchContext } from "@/lib/search-context"
import { SkeletonLoanCard } from "@/components/ui/skeleton-loader"

interface LoanHealthData {
  id: string
  borrower: string
  amount: string
  health: number
  status: "healthy" | "warning" | "critical"
  trend: "up" | "down"
  covenant: string
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount.toFixed(0)}`
}

function getCovenantStatus(covenantStatus: LoanState["covenant_status"] | undefined | null): { status: "healthy" | "warning" | "critical"; label: string } {
  if (!covenantStatus) {
    return { status: "healthy", label: "N/A" }
  }
  if (covenantStatus.breached > 0) {
    return { status: "critical", label: "Breach Alert" }
  }
  if (covenantStatus.at_risk > 0) {
    return { status: "warning", label: "At Risk" }
  }
  return { status: "healthy", label: "Compliant" }
}

export function LoanHealthGrid() {
  const { loans, loading, error } = useLoans()
  const { searchQuery } = useSearchContext()
  const [loanStates, setLoanStates] = useState<Record<string, LoanState>>({})
  const [statesLoading, setStatesLoading] = useState(false)

  // Filter loans based on search query
  const filteredLoans = useMemo(() => {
    if (!searchQuery.trim()) {
      return loans
    }

    const query = searchQuery.toLowerCase().trim()
    return loans.filter((loan) => {
      return (
        loan.borrower_name.toLowerCase().includes(query) ||
        loan.id.toLowerCase().includes(query) ||
        loan.loan_amount.toString().includes(query) ||
        (loan.metadata && JSON.stringify(loan.metadata).toLowerCase().includes(query))
      )
    })
  }, [loans, searchQuery])

  // Fetch loan states for all loans
  useEffect(() => {
    if (loans.length === 0) return

    let cancelled = false
    setStatesLoading(true)

    async function fetchStates() {
      const states: Record<string, LoanState> = {}
      for (const loan of loans) {
        try {
          const state = await loansApi.getState(loan.id)
          if (!cancelled) {
            states[loan.id] = state
          }
        } catch (err) {
          console.error(`Failed to fetch state for loan ${loan.id}:`, err)
        }
      }
      if (!cancelled) {
        setLoanStates(states)
        setStatesLoading(false)
      }
    }

    fetchStates()

    return () => {
      cancelled = true
    }
  }, [loans])

  // Transform loans data for display
  const loanHealthData: LoanHealthData[] = filteredLoans.map((loan) => {
    const state = loanStates[loan.id]
    const health = state?.health_score ?? 0
    const covenantInfo = getCovenantStatus(state?.covenant_status)
    
    // Determine trend based on health score (simplified - in production would compare with previous state)
    const trend: "up" | "down" = health >= 75 ? "up" : "down"

    return {
      id: loan.id,
      borrower: loan.borrower_name,
      amount: formatCurrency(loan.loan_amount),
      health: Math.round(health),
      status: covenantInfo.status,
      trend,
      covenant: covenantInfo.label,
    }
  })

  if (loading || statesLoading) {
    return (
      <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">Loan Health Scores</h3>
        <div className="space-y-3" role="status" aria-live="polite" aria-label="Loading loans">
          <SkeletonLoanCard />
          <SkeletonLoanCard />
          <SkeletonLoanCard />
        </div>
      </Card>
    )
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const isNetworkError = errorMessage.includes('Network') || errorMessage.includes('Failed to fetch')
    
    return (
      <Card className="p-4 sm:p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <h3 className="text-lg sm:text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-3 sm:mb-4">Loan Health Scores</h3>
        <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.55_0.20_25)]">
          <p className="text-sm text-[oklch(0.55_0.20_25)] mb-2">
            {isNetworkError 
              ? "Unable to connect to the backend API. Please ensure the backend service is running."
              : `Failed to load loans: ${errorMessage}`}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-[oklch(0.60_0.02_250)] font-mono mt-2">
              API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}
            </p>
          )}
        </div>
      </Card>
    )
  }

  if (loanHealthData.length === 0) {
    return (
      <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">Loan Health Scores</h3>
        <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)]">
          <p className="text-[oklch(0.60_0.02_250)]">
            {searchQuery.trim() 
              ? `No loans found matching "${searchQuery}".` 
              : "No loans found. Upload a loan document to get started."}
          </p>
        </div>
      </Card>
    )
  }
  return (
    <Card className="p-4 sm:p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-[oklch(0.95_0.01_250)]">Loan Health Scores</h3>
        {searchQuery.trim() && (
          <span className="text-xs sm:text-sm text-[oklch(0.60_0.02_250)]" role="status" aria-live="polite">
            {filteredLoans.length} of {loans.length} loans
          </span>
        )}
      </div>
      <div className="space-y-3">
        {loanHealthData.map((loan) => (
          <Link
            key={loan.id}
            href={`/digital-twins?loan=${loan.id}`}
            className="block p-3 sm:p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] hover:border-[oklch(0.55_0.20_220)] transition-all duration-200 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.55_0.20_220)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.15_0.03_250)]"
            aria-label={`Loan ${loan.borrower}, ${loan.amount}, Health: ${loan.health}%, Status: ${loan.covenant}. Click to view details`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-mono text-[oklch(0.60_0.02_250)] truncate">{loan.id}</span>
                  {loan.trend === "up" ? (
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[oklch(0.70_0.25_145)] flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[oklch(0.55_0.20_25)] flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm sm:text-base font-medium text-[oklch(0.90_0.01_250)] mt-1 truncate">{loan.borrower}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-base sm:text-lg font-bold text-[oklch(0.95_0.01_250)]">{loan.amount}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3">
              {/* Health Score */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[oklch(0.60_0.02_250)]">Health Score</span>
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      loan.health >= 80
                        ? "text-[oklch(0.70_0.25_145)]"
                        : loan.health >= 60
                          ? "text-[oklch(0.75_0.20_60)]"
                          : "text-[oklch(0.55_0.20_25)]"
                    }`}
                  >
                    {loan.health}%
                  </span>
                </div>
                <div className="h-2 bg-[oklch(0.22_0.03_250)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      loan.health >= 80
                        ? "bg-[oklch(0.70_0.25_145)] glow-green"
                        : loan.health >= 60
                          ? "bg-[oklch(0.75_0.20_60)]"
                          : "bg-[oklch(0.55_0.20_25)]"
                    }`}
                    style={{ width: `${loan.health}%` }}
                  />
                </div>
              </div>

              {/* Covenant Status */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {loan.status === "healthy" ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.70_0.25_145)]" />
                ) : (
                  <AlertTriangle
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      loan.status === "warning" ? "text-[oklch(0.75_0.20_60)]" : "text-[oklch(0.55_0.20_25)]"
                    }`}
                  />
                )}
                <span
                  className={`text-xs font-medium ${
                    loan.status === "healthy"
                      ? "text-[oklch(0.70_0.25_145)]"
                      : loan.status === "warning"
                        ? "text-[oklch(0.75_0.20_60)]"
                        : "text-[oklch(0.55_0.20_25)]"
                  }`}
                >
                  {loan.covenant}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}

// Memoize component to prevent unnecessary re-renders
export const MemoizedLoanHealthGrid = memo(LoanHealthGrid)
