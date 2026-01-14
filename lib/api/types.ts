/**
 * TypeScript types for API responses
 * Matches backend models
 */

export interface Loan {
  id: string
  borrower_name: string
  loan_amount: number
  interest_rate: number
  start_date: string
  maturity_date: string
  covenants: Covenant[]
  esg_clauses: ESGClause[]
  metadata?: Record<string, any>
}

export interface Covenant {
  id: string
  name: string
  type: string
  threshold: number
  operator: string
  description?: string
}

export interface ESGClause {
  id: string
  category: 'environmental' | 'social' | 'governance'
  description: string
  requirement: string
}

export interface LoanState {
  loan: Loan
  health_score: number
  covenant_status: {
    compliant: number
    at_risk: number
    breached: number
  }
  esg_status: {
    compliant: number
    at_risk: number
    non_compliant: number
  }
  last_updated: string
}

export interface RiskPrediction {
  loan_id: string
  overall_risk: {
    level: 'low' | 'medium' | 'high' | 'critical'
    score: number
    confidence: number
  }
  predictions: {
    [key: string]: {
      breach_probability?: number  // May be probability in some cases
      probability?: number  // Backend returns this as decimal 0-1
      risk_level: 'low' | 'medium' | 'high' | 'critical'
      key_factors?: string[]
      explanation?: {
        summary: string
        factors: Array<{
          factor: string
          impact: 'high' | 'medium' | 'low'
          description: string
        }>
      }
      horizon_days?: number
      prediction_date?: string
    }
  }
  generated_at: string
}

export interface ESGScore {
  loan_id: string
  overall_score: number
  environmental_score: number
  social_score: number
  governance_score: number
  factors: Record<string, any>
  calculated_at: string
}

export interface ESGCompliance {
  loan_id: string
  compliance_summary: {
    compliant: number
    at_risk: number
    non_compliant: number
    total: number
  }
  by_category: {
    environmental: { compliant: number; at_risk: number; non_compliant: number }
    social: { compliant: number; at_risk: number; non_compliant: number }
    governance: { compliant: number; at_risk: number; non_compliant: number }
  }
}

export interface AuditLogEntry {
  id: string
  event_type: string
  loan_id?: string
  user_id: string
  timestamp: string
  description: string
  metadata?: Record<string, any>
  blockchain_tx_hash?: string
  blockchain_block?: number
}

export interface CovenantCheck {
  id: string
  loan_id: string
  covenant_id: string
  check_date: string
  status: 'compliant' | 'at_risk' | 'breached'
  actual_value: number
  threshold_value: number
  is_breached: boolean
  notes?: string
}

export interface UploadLoanResponse {
  loan: Loan
  document: {
    id: string
    loan_id: string
    filename: string
    uploaded_at: string
  }
  extracted: {
    covenants_count: number
    esg_clauses_count: number
  }
}
