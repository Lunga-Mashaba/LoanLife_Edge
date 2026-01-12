/**
 * Loans API
 * Functions for loan-related API calls
 */
import { apiClient, API_ENDPOINTS } from './client'
import { apiCache } from './cache'
import type { Loan, LoanState, UploadLoanResponse, CovenantCheck } from './types'

export const loansApi = {
  /**
   * Get all loans (cached for 30 seconds)
   */
  async getAll(): Promise<Loan[]> {
    return apiCache.getOrFetch(
      'loans:all',
      () => apiClient.get<Loan[]>(API_ENDPOINTS.loans.all),
      30000 // 30 seconds cache
    )
  },

  /**
   * Get a specific loan by ID (cached for 60 seconds)
   */
  async getById(loanId: string): Promise<Loan> {
    return apiCache.getOrFetch(
      `loans:${loanId}`,
      () => apiClient.get<Loan>(API_ENDPOINTS.loans.get(loanId)),
      60000 // 60 seconds cache
    )
  },

  /**
   * Get complete loan state including health metrics (cached for 15 seconds)
   */
  async getState(loanId: string): Promise<LoanState> {
    return apiCache.getOrFetch(
      `loans:${loanId}:state`,
      () => apiClient.get<LoanState>(API_ENDPOINTS.loans.state(loanId)),
      15000 // 15 seconds cache (more dynamic data)
    )
  },

  /**
   * Upload a loan document (PDF or DOCX)
   */
  async uploadDocument(file: File, userId = 'analyst'): Promise<UploadLoanResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', userId)
    
    return apiClient.postFormData<UploadLoanResponse>(API_ENDPOINTS.loans.upload, formData)
  },

  /**
   * Record a covenant check
   */
  async recordCovenantCheck(
    loanId: string,
    covenantId: string,
    actualValue: number,
    notes?: string,
    userId = 'analyst'
  ): Promise<CovenantCheck> {
    return apiClient.post<CovenantCheck>(API_ENDPOINTS.loans.covenantCheck(loanId), {
      covenant_id: covenantId,
      actual_value: actualValue,
      notes,
      user_id: userId,
    })
  },
}
