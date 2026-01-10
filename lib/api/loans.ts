/**
 * Loans API
 * Functions for loan-related API calls
 */
import { apiClient, API_ENDPOINTS } from './client'
import type { Loan, LoanState, UploadLoanResponse, CovenantCheck } from './types'

export const loansApi = {
  /**
   * Get all loans
   */
  async getAll(): Promise<Loan[]> {
    return apiClient.get<Loan[]>(API_ENDPOINTS.loans.all)
  },

  /**
   * Get a specific loan by ID
   */
  async getById(loanId: string): Promise<Loan> {
    return apiClient.get<Loan>(API_ENDPOINTS.loans.get(loanId))
  },

  /**
   * Get complete loan state including health metrics
   */
  async getState(loanId: string): Promise<LoanState> {
    return apiClient.get<LoanState>(API_ENDPOINTS.loans.state(loanId))
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
