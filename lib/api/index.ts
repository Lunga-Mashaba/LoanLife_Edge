/**
 * API Client - Public exports
 * Centralized export point for all API functions and types
 */

export { apiClient, ApiError } from './client'
export { API_CONFIG, API_ENDPOINTS } from './config'
export * from './types'
export { loansApi } from './loans'
export { predictionsApi } from './predictions'
export { esgApi } from './esg'
export { auditApi, type AuditLogFilters } from './audit'
