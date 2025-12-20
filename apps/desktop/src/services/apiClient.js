export async function fetchPortfolio() {
  return {
    loans: [
      { id: 'LN-001', name: 'Acme Term Loan', health: 82, esg: 74, risk30: 0.12, risk60: 0.22, risk90: 0.35 },
      { id: 'LN-002', name: 'Globex Revolver', health: 68, esg: 81, risk30: 0.18, risk60: 0.29, risk90: 0.41 }
    ],
    updatedAt: new Date().toISOString()
  };
}

export async function fetchLoanDetail(id) {
  return {
    id,
    covenants: [
      { key: 'Debt/EBITDA', threshold: 3.0, current: 2.7 },
      { key: 'Interest Coverage', threshold: 2.0, current: 1.9 }
    ],
    esg: { score: 74, breachesPredicted: ['E: Emissions trend rising'] },
    predictions: [
      { horizon: 30, probability: 0.12, affected: 'Interest Coverage', explanation: 'Cashflow decline trend' },
      { horizon: 60, probability: 0.22, affected: 'Debt/EBITDA', explanation: 'Leverage drift' },
      { horizon: 90, probability: 0.35, affected: 'Liquidity covenant', explanation: 'Working capital strain' }
    ],
    audit: [{ when: 'now', action: 'Twin updated', by: 'system' }]
  };
}
