"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { useLoans } from "@/hooks/use-loans"
import { useState, useEffect } from "react"
import type { LoanState } from "@/lib/api/types"
import { loansApi } from "@/lib/api/loans"

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
  const [loanStates, setLoanStates] = useState<Record<string, LoanState>>({})
  const [statesLoading, setStatesLoading] = useState(false)

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
  const loanHealthData: LoanHealthData[] = loans.map((loan) => {
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
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[oklch(0.55_0.20_220)]" />
          <span className="ml-2 text-[oklch(0.60_0.02_250)]">Loading loans...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">Loan Health Scores</h3>
        <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.55_0.20_25)]">
          <p className="text-[oklch(0.55_0.20_25)]">Failed to load loans. Please check your API connection.</p>
        </div>
      </Card>
    )
  }

  if (loanHealthData.length === 0) {
    return (
      <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">Loan Health Scores</h3>
        <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)]">
          <p className="text-[oklch(0.60_0.02_250)]">No loans found. Upload a loan document to get started.</p>
        </div>
      </Card>
    )
  }
  return (
    <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">Loan Health Scores</h3>
      <div className="space-y-3">
        {loanHealthData.map((loan) => (
          <div
            key={loan.id}
            className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] hover:border-[oklch(0.55_0.20_220)] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-[oklch(0.60_0.02_250)]">{loan.id}</span>
                  {loan.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-[oklch(0.70_0.25_145)]" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-[oklch(0.55_0.20_25)]" />
                  )}
                </div>
                <p className="text-base font-medium text-[oklch(0.90_0.01_250)] mt-1">{loan.borrower}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[oklch(0.95_0.01_250)]">{loan.amount}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
              {/* Health Score */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[oklch(0.60_0.02_250)]">Health Score</span>
                  <span
                    className={`text-sm font-bold ${
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
              <div className="flex items-center gap-2">
                {loan.status === "healthy" ? (
                  <CheckCircle2 className="h-5 w-5 text-[oklch(0.70_0.25_145)]" />
                ) : (
                  <AlertTriangle
                    className={`h-5 w-5 ${
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
          </div>
        ))}
      </div>
    </Card>
  )
}
