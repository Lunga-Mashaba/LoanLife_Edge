"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react"

const loans = [
  {
    id: "LN-2024-001",
    borrower: "TechCorp Industries",
    amount: "$45.2M",
    health: 92,
    status: "healthy",
    trend: "up",
    covenant: "Compliant",
  },
  {
    id: "LN-2024-002",
    borrower: "GreenEnergy Partners",
    amount: "$32.5M",
    health: 88,
    status: "healthy",
    trend: "up",
    covenant: "Compliant",
  },
  {
    id: "LN-2024-003",
    borrower: "RetailMax Solutions",
    amount: "$28.1M",
    health: 65,
    status: "warning",
    trend: "down",
    covenant: "At Risk",
  },
  {
    id: "LN-2024-004",
    borrower: "MediHealth Corp",
    amount: "$52.8M",
    health: 45,
    status: "critical",
    trend: "down",
    covenant: "Breach Alert",
  },
  {
    id: "LN-2024-005",
    borrower: "AutoDrive Logistics",
    amount: "$38.9M",
    health: 95,
    status: "healthy",
    trend: "up",
    covenant: "Compliant",
  },
  {
    id: "LN-2024-006",
    borrower: "BuildTech Construction",
    amount: "$41.3M",
    health: 72,
    status: "warning",
    trend: "down",
    covenant: "At Risk",
  },
]

export function LoanHealthGrid() {
  return (
    <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)] mb-4">Loan Health Scores</h3>
      <div className="space-y-3">
        {loans.map((loan) => (
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
