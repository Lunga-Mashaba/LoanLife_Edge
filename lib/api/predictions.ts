/**
 * Predictions API
 * Functions for AI risk prediction API calls
 */
import { apiClient, API_ENDPOINTS } from './client'
import type { RiskPrediction } from './types'

export const predictionsApi = {
  /**
   * Get risk predictions for a loan
   */
  async getPredictions(loanId: string, horizons: number[] = [30, 60, 90]): Promise<RiskPrediction> {
    const horizonsStr = horizons.join(',')
    return apiClient.get<RiskPrediction>(API_ENDPOINTS.predictions.get(loanId, horizonsStr))
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
