/**
 * Predictions API
 * Functions for AI risk prediction API calls
 */
import { apiClient, API_ENDPOINTS } from './client'
import { apiCache } from './cache'
import type { RiskPrediction } from './types'

export const predictionsApi = {
  /**
   * Get risk predictions for a loan (cached for 60 seconds)
   */
  async getPredictions(loanId: string, horizons: number[] = [30, 60, 90]): Promise<RiskPrediction> {
    const horizonsStr = horizons.join(',')
    const cacheKey = `predictions:${loanId}:${horizonsStr}`
    return apiCache.getOrFetch(
      cacheKey,
      () => apiClient.get<RiskPrediction>(API_ENDPOINTS.predictions.get(loanId, horizonsStr)),
      60000 // 60 seconds cache
    )
  },

  /**
   * Get risk prediction for a specific covenant
   */
  async getCovenantPrediction(
    loanId: string,
    covenantId: string,
    horizonDays = 30
  ): Promise<RiskPrediction> {
    return apiClient.get<RiskPrediction>(
      API_ENDPOINTS.predictions.covenant(loanId, covenantId, horizonDays)
    )
  },

  /**
   * Get detailed explainability for a prediction
   */
  async getExplainability(loanId: string, horizonDays = 30): Promise<any> {
    return apiClient.get(API_ENDPOINTS.predictions.explainability(loanId, horizonDays))
  },
}
