/**
 * API Configuration
 * Centralized configuration for backend API
 */

// Get API URL from environment or use default
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }
  // Server-side: use environment variable
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
}

export const API_CONFIG = {
  baseUrl: getApiUrl(),
  timeout: 60000, // 60 seconds - increased for Render free tier cold starts
}

// Log API config in development and production (for debugging)
if (typeof window !== 'undefined') {
  console.log('🔌 API Config:', {
    baseUrl: API_CONFIG.baseUrl,
    envVar: process.env.NEXT_PUBLIC_API_URL,
    isProduction: process.env.NODE_ENV === 'production',
  })
}

export const API_ENDPOINTS = {
  // Health
  health: '/health',
  
  // Loans
  loans: {
    all: '/api/v1/loans',
    get: (id: string) => `/api/v1/loans/${id}`,
    state: (id: string) => `/api/v1/loans/${id}/state`,
    upload: '/api/v1/loans/upload',
    covenantCheck: (id: string) => `/api/v1/loans/${id}/covenant-check`,
  },
  
  // Predictions
  predictions: {
    get: (id: string, horizons = '30,60,90') => `/api/v1/predictions/${id}?horizons=${horizons}`,
    covenant: (loanId: string, covenantId: string, horizon = 30) => 
      `/api/v1/predictions/${loanId}/covenant/${covenantId}?horizon_days=${horizon}`,
    explainability: (id: string, horizon = 30) => 
      `/api/v1/predictions/${id}/explainability?horizon_days=${horizon}`,
  },
  
  // ESG
  esg: {
    score: (id: string) => `/api/v1/esg/${id}/score`,
    compliance: (id: string) => `/api/v1/esg/${id}/compliance`,
    breachRisk: (id: string, horizon = 90) => `/api/v1/esg/${id}/breach-risk?horizon_days=${horizon}`,
    complianceCheck: (id: string) => `/api/v1/esg/${id}/compliance-check`,
  },
  
  // Audit
  audit: {
    all: '/api/v1/audit',
    summary: (id: string) => `/api/v1/audit/${id}/summary`,
    eventTypes: '/api/v1/audit/events/types',
  },
} as const
