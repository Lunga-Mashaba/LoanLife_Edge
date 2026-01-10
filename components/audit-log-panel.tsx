"use client"

import { Card } from "@/components/ui/card"
import { Lock, Database, FileCheck, AlertTriangle, Loader2, Shield } from "lucide-react"
import { useAuditLogs } from "@/hooks/use-audit"
import { formatDistanceToNow } from "date-fns"

function getEventIcon(eventType: string) {
  if (eventType.includes("COVENANT")) return FileCheck
  if (eventType.includes("PREDICTION") || eventType.includes("RISK")) return AlertTriangle
  if (eventType.includes("ESG")) return Database
  if (eventType.includes("BLOCKCHAIN") || eventType.includes("AUDIT")) return Shield
  return Lock
}

function formatEventType(eventType: string): string {
  return eventType
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

function formatTxHash(hash?: string): string {
  if (!hash) return "Pending..."
  if (hash.length <= 10) return hash
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export function AuditLogPanel() {
  const { logs, loading, error } = useAuditLogs({})

  // Show only the 5 most recent logs
  const recentLogs = logs.slice(0, 5)

  if (loading) {
    return (
      <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)]">Audit Log</h3>
          <Lock className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[oklch(0.55_0.20_220)]" />
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)]">Audit Log</h3>
          <Lock className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
        </div>
        <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.55_0.20_25)]">
          <p className="text-sm text-[oklch(0.55_0.20_25)]">Failed to load audit logs</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.04_250)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[oklch(0.95_0.01_250)]">Audit Log</h3>
        <Lock className="h-5 w-5 text-[oklch(0.55_0.20_220)]" />
      </div>
      <div className="space-y-3">
        {recentLogs.length === 0 ? (
          <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)]">
            <p className="text-sm text-[oklch(0.60_0.02_250)]">No audit logs found</p>
          </div>
        ) : (
          recentLogs.map((log) => {
            const Icon = getEventIcon(log.event_type)
            const timeAgo = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })
            const txHash = log.blockchain_tx_hash

            return (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] hover:border-[oklch(0.50_0.22_290)] transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 text-[oklch(0.60_0.22_290)] mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[oklch(0.90_0.01_250)]">{formatEventType(log.event_type)}</p>
                    <p className="text-xs text-[oklch(0.60_0.02_250)] mt-1">{log.description}</p>
                    {log.loan_id && (
                      <p className="text-xs text-[oklch(0.60_0.02_250)] mt-1 font-mono">{log.loan_id}</p>
                    )}
                    {txHash && (
                      <p className="text-xs text-[oklch(0.50_0.22_290)] font-mono mt-1">{formatTxHash(txHash)}</p>
                    )}
                  </div>
                  <span className="text-xs text-[oklch(0.60_0.02_250)] whitespace-nowrap">{timeAgo}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
