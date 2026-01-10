"use client"

import { Card } from "@/components/ui/card"
import { Lock, Database, FileCheck, AlertTriangle } from "lucide-react"

const auditLogs = [
  { id: "0x7f2a...3b9c", action: "Covenant Update", loan: "LN-2024-001", time: "2m ago", icon: FileCheck },
  { id: "0x8e3b...4c0d", action: "Risk Assessment", loan: "LN-2024-004", time: "15m ago", icon: AlertTriangle },
  { id: "0x9f4c...5d1e", action: "ESG Data Sync", loan: "LN-2024-002", time: "1h ago", icon: Database },
  { id: "0xa05d...6e2f", action: "Blockchain Commit", loan: "All Loans", time: "2h ago", icon: Lock },
]

export function AuditLogPanel() {
  return (
    <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)]">Audit Log</h3>
        <Lock className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
      </div>
      <div className="space-y-3">
        {auditLogs.map((log, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] hover:border-[oklch(0.50_0.22_290)] transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <log.icon className="h-4 w-4 text-[oklch(0.60_0.22_290)] mt-1" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[oklch(0.90_0.01_250)]">{log.action}</p>
                <p className="text-xs text-[oklch(0.60_0.02_250)] mt-1">{log.loan}</p>
                <p className="text-xs text-[oklch(0.50_0.22_290)] font-mono mt-1">{log.id}</p>
              </div>
              <span className="text-xs text-[oklch(0.60_0.02_250)] whitespace-nowrap">{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
