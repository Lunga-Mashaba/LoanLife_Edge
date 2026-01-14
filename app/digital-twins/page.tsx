"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { AnimatedBackground } from "@/components/animated-background"
import { Database, Activity, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function DigitalTwinsPage() {
  const twins = [
    {
      id: "DTW-001",
      borrower: "Acme Manufacturing Corp",
      loanId: "LN-2024-8472",
      status: "active",
      healthScore: 87,
      syncStatus: "synced",
      lastUpdate: "2 min ago",
      metrics: {
        cashFlow: "+12.3%",
        creditScore: 742,
        collateral: "$2.4M",
      },
    },
    {
      id: "DTW-002",
      borrower: "TechStart Ventures LLC",
      loanId: "LN-2024-6891",
      status: "warning",
      healthScore: 64,
      syncStatus: "synced",
      lastUpdate: "5 min ago",
      metrics: {
        cashFlow: "-3.2%",
        creditScore: 698,
        collateral: "$850K",
      },
    },
    {
      id: "DTW-003",
      borrower: "Global Logistics Inc",
      loanId: "LN-2024-5234",
      status: "critical",
      healthScore: 42,
      syncStatus: "syncing",
      lastUpdate: "12 min ago",
      metrics: {
        cashFlow: "-18.5%",
        creditScore: 612,
        collateral: "$1.1M",
      },
    },
  ]

  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-[oklch(0.12_0.02_250)] via-[oklch(0.10_0.03_240)] to-[oklch(0.12_0.02_250)] gradient-animate relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 w-full md:pl-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 pl-12 md:pl-3">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[oklch(0.95_0.01_250)] mb-1 sm:mb-2">Digital Twin Monitor</h1>
            <p className="text-sm sm:text-base text-[oklch(0.60_0.02_250)]">Real-time borrower financial state replication</p>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {twins.map((twin) => (
              <Card key={twin.id} className="bg-[oklch(0.14_0.02_250)] border-[oklch(0.25_0.04_250)] p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <Database
                        className={`h-10 w-10 sm:h-12 sm:w-12 ${
                          twin.status === "active"
                            ? "text-[oklch(0.70_0.25_145)]"
                            : twin.status === "warning"
                              ? "text-[oklch(0.75_0.18_65)]"
                              : "text-[oklch(0.65_0.22_25)]"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 blur-lg opacity-50 ${
                          twin.status === "active"
                            ? "bg-[oklch(0.70_0.25_145)]"
                            : twin.status === "warning"
                              ? "bg-[oklch(0.75_0.18_65)]"
                              : "bg-[oklch(0.65_0.22_25)]"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base sm:text-lg font-semibold text-[oklch(0.95_0.01_250)] truncate">{twin.borrower}</h3>
                        {twin.status === "active" && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.70_0.25_145)] flex-shrink-0" />}
                        {twin.status === "warning" && <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.75_0.18_65)] flex-shrink-0" />}
                        {twin.status === "critical" && <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.65_0.22_25)] flex-shrink-0" />}
                      </div>
                      <p className="text-xs sm:text-sm text-[oklch(0.60_0.02_250)] font-mono truncate">
                        {twin.id} • {twin.loanId}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <div className="text-xl sm:text-2xl font-bold text-[oklch(0.95_0.01_250)] mb-1">{twin.healthScore}</div>
                    <div className="text-xs text-[oklch(0.60_0.02_250)]">Health Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
                  <div className="bg-[oklch(0.10_0.02_250)] rounded-lg p-2 sm:p-3 border border-[oklch(0.20_0.04_250)]">
                    <div className="text-[10px] sm:text-xs text-[oklch(0.60_0.02_250)] mb-1">Cash Flow</div>
                    <div
                      className={`text-sm sm:text-lg font-semibold ${
                        twin.metrics.cashFlow.startsWith("+")
                          ? "text-[oklch(0.70_0.25_145)]"
                          : "text-[oklch(0.65_0.22_25)]"
                      }`}
                    >
                      {twin.metrics.cashFlow}
                    </div>
                  </div>
                  <div className="bg-[oklch(0.10_0.02_250)] rounded-lg p-2 sm:p-3 border border-[oklch(0.20_0.04_250)]">
                    <div className="text-[10px] sm:text-xs text-[oklch(0.60_0.02_250)] mb-1">Credit Score</div>
                    <div className="text-sm sm:text-lg font-semibold text-[oklch(0.95_0.01_250)]">{twin.metrics.creditScore}</div>
                  </div>
                  <div className="bg-[oklch(0.10_0.02_250)] rounded-lg p-2 sm:p-3 border border-[oklch(0.20_0.04_250)]">
                    <div className="text-[10px] sm:text-xs text-[oklch(0.60_0.02_250)] mb-1">Collateral</div>
                    <div className="text-sm sm:text-lg font-semibold text-[oklch(0.95_0.01_250)]">{twin.metrics.collateral}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[oklch(0.55_0.20_220)] flex-shrink-0" />
                    <span className="text-[oklch(0.60_0.02_250)]">
                      {twin.syncStatus === "synced" ? "Live Synced" : "Syncing..."}
                    </span>
                    {twin.syncStatus === "synced" && (
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[oklch(0.70_0.25_145)] animate-pulse flex-shrink-0" />
                    )}
                  </div>
                  <span className="text-[oklch(0.50_0.02_250)]">Updated {twin.lastUpdate}</span>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
