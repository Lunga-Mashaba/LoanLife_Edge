"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { AnimatedBackground } from "@/components/animated-background"
import { FileText, Lock, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function AuditLogPage() {
  const auditEntries = [
    {
      id: "0xA7B2...9C4E",
      timestamp: "2024-01-15 14:32:18 UTC",
      action: "Covenant Breach Detected",
      user: "system@ai-monitor",
      loanId: "LN-2024-8472",
      status: "critical",
      verified: true,
    },
    {
      id: "0xF3D8...2A1B",
      timestamp: "2024-01-15 14:28:05 UTC",
      action: "Risk Score Updated",
      user: "admin@loanlife.edge",
      loanId: "LN-2024-6891",
      status: "info",
      verified: true,
    },
    {
      id: "0xC9E5...7F3D",
      timestamp: "2024-01-15 14:15:42 UTC",
      action: "Manual Override Applied",
      user: "risk.officer@loanlife.edge",
      loanId: "LN-2024-5234",
      status: "warning",
      verified: true,
    },
    {
      id: "0x8B4A...6E2C",
      timestamp: "2024-01-15 13:58:31 UTC",
      action: "Digital Twin Synced",
      user: "system@blockchain-sync",
      loanId: "LN-2024-8472",
      status: "success",
      verified: true,
    },
    {
      id: "0xD1F9...4C8B",
      timestamp: "2024-01-15 13:42:19 UTC",
      action: "ESG Score Calculated",
      user: "system@ai-monitor",
      loanId: "LN-2024-7123",
      status: "info",
      verified: true,
    },
  ]

  return (
    <div className="flex min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-background dark:from-[oklch(0.12_0.02_250)] dark:via-[oklch(0.10_0.03_240)] dark:to-[oklch(0.12_0.02_250)] gradient-animate relative">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 w-full md:pl-64">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-full">
          <div className="max-w-[1600px] mx-auto w-full">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Blockchain Audit Log</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Immutable transaction history with cryptographic verification</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Card className="bg-card border-border p-4">
              <div className="text-xs text-muted-foreground mb-2">Total Events</div>
              <div className="text-2xl font-bold text-card-foreground">1,247</div>
            </Card>
            <Card className="bg-card border-border p-4">
              <div className="text-xs text-muted-foreground mb-2">Today</div>
              <div className="text-2xl font-bold text-[oklch(0.55_0.20_220)]">43</div>
            </Card>
            <Card className="bg-card border-border p-4">
              <div className="text-xs text-muted-foreground mb-2">Verified</div>
              <div className="text-2xl font-bold text-[oklch(0.70_0.25_145)]">100%</div>
            </Card>
            <Card className="bg-card border-border p-4">
              <div className="text-xs text-muted-foreground mb-2">Chain Height</div>
              <div className="text-2xl font-bold text-[oklch(0.60_0.18_280)]">8,492</div>
            </Card>
          </div>

          {/* Audit Log Entries */}
          <Card className="bg-card border-border">
            <div className="p-3 sm:p-4 border-b border-border">
              <h2 className="text-base sm:text-lg font-semibold text-card-foreground">Recent Transactions</h2>
            </div>
            <div className="divide-y divide-border">
              {auditEntries.map((entry) => (
                <div key={entry.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-2">
                    <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="relative mt-0.5 sm:mt-1 flex-shrink-0">
                        {entry.status === "critical" && (
                          <>
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.65_0.22_25)]" />
                            <div className="absolute inset-0 blur-md bg-[oklch(0.65_0.22_25)] opacity-50" />
                          </>
                        )}
                        {entry.status === "warning" && <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.75_0.18_65)]" />}
                        {entry.status === "success" && <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.70_0.25_145)]" />}
                        {entry.status === "info" && <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[oklch(0.55_0.20_220)]" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm sm:text-base text-card-foreground mb-1 break-words">{entry.action}</div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="break-all">{entry.timestamp}</span>
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="break-all sm:break-normal">{entry.user}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="font-mono break-all">{entry.loanId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 sm:ml-4">
                      {entry.verified && (
                        <div className="flex items-center gap-1 text-xs text-[oklch(0.70_0.25_145)] whitespace-nowrap">
                          <Lock className="h-3 w-3 animate-lock-secure" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-6 sm:ml-8 mt-2">
                    <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-2 py-1 rounded bg-muted border border-border animate-blockchain-link">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">Block Hash:</span>
                      <span className="text-xs font-mono text-[oklch(0.60_0.18_280)] break-all">{entry.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
