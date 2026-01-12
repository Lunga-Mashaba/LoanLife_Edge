/**
 * Audit API
 * Functions for audit log API calls
 */
import { apiClient, API_ENDPOINTS } from './client'
import { apiCache } from './cache'
import type { AuditLogEntry } from './types'

export interface AuditLogFilters {
  loan_id?: string
  event_type?: string
  start_date?: string
  end_date?: string
}

export const auditApi = {
  /**
   * Get audit logs with optional filtering (cached for 20 seconds)
   */
  async getLogs(filters: AuditLogFilters = {}): Promise<AuditLogEntry[]> {
    const params = new URLSearchParams()
    if (filters.loan_id) params.append('loan_id', filters.loan_id)
    if (filters.event_type) params.append('event_type', filters.event_type)
    if (filters.start_date) params.append('start_date', filters.start_date)
    if (filters.end_date) params.append('end_date', filters.end_date)
    
    const query = params.toString()
    const endpoint = query ? `${API_ENDPOINTS.audit.all}?${query}` : API_ENDPOINTS.audit.all
    const cacheKey = `audit:logs:${query || 'all'}`
    
    return apiCache.getOrFetch(
      cacheKey,
      () => apiClient.get<AuditLogEntry[]>(endpoint),
      20000 // 20 seconds cache (more dynamic)
    )
  },

  /**
   * Get audit summary for a specific loan
   */
  async getSummary(loanId: string): Promise<any> {
    return apiClient.get(API_ENDPOINTS.audit.summary(loanId))
  },

  /**
   * Get list of all available audit event types
   */
  async getEventTypes(): Promise<Array<{ value: string; name: string }>> {
    return apiClient.get(API_ENDPOINTS.audit.eventTypes)
  },
}
