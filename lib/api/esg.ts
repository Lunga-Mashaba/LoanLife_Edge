/**
 * ESG API
 * Functions for ESG-related API calls
 */
import { apiClient, API_ENDPOINTS } from './client'
import { apiCache } from './cache'
import type { ESGScore, ESGCompliance } from './types'

export const esgApi = {
  /**
   * Get ESG score for a loan (cached for 60 seconds)
   */
  async getScore(loanId: string): Promise<ESGScore> {
    return apiCache.getOrFetch(
      `esg:${loanId}:score`,
      () => apiClient.get<ESGScore>(API_ENDPOINTS.esg.score(loanId)),
      60000 // 60 seconds cache
    )
  },

  /**
   * Get ESG compliance summary for a loan (cached for 60 seconds)
   */
  async getCompliance(loanId: string): Promise<ESGCompliance> {
    return apiCache.getOrFetch(
      `esg:${loanId}:compliance`,
      () => apiClient.get<ESGCompliance>(API_ENDPOINTS.esg.compliance(loanId)),
      60000 // 60 seconds cache
    )
  },

  /**
   * Get ESG breach risk prediction
   */
  async getBreachRisk(loanId: string, horizonDays = 90): Promise<any> {
    return apiClient.get(API_ENDPOINTS.esg.breachRisk(loanId, horizonDays))
  },

  /**
   * Record an ESG compliance check
   */
  async recordComplianceCheck(
    loanId: string,
    clauseId: string,
    status: 'compliant' | 'at_risk' | 'non_compliant',
    evidence?: string,
    notes?: string,
    userId = 'analyst'
  ): Promise<any> {
    return apiClient.post(API_ENDPOINTS.esg.complianceCheck(loanId), {
      clause_id: clauseId,
      status,
      evidence,
      notes,
      user_id: userId,
    })
  },
}
