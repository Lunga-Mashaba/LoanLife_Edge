/**
 * React hook for fetching audit logs
 */
'use client'

import { useState, useEffect } from 'react'
import { auditApi, type AuditLogFilters } from '@/lib/api/audit'
import type { AuditLogEntry } from '@/lib/api/types'

export function useAuditLogs(filters: AuditLogFilters = {}) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchLogs() {
      try {
        setLoading(true)
        setError(null)
        const data = await auditApi.getLogs(filters)
        if (!cancelled) {
          setLogs(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch audit logs'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchLogs()

    // Refetch every 120 seconds (reduced frequency, cache handles freshness)
    const interval = setInterval(fetchLogs, 120000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [JSON.stringify(filters)])

  return { logs, loading, error }
}
