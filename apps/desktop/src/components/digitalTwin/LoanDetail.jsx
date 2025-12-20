import { useEffect, useState } from 'react';
import { fetchLoanDetail } from '../../services/apiClient';
import RiskTimeline from '../risk/RiskTimeline.jsx';

export default function LoanDetail() {
  const id = window.location.pathname.split('/').pop();
  const [loan, setLoan] = useState(null);

  useEffect(() => { fetchLoanDetail(id).then(setLoan); }, [id]);
  if (!loan) return <div>Loading…</div>;

  return (
    <div className="card">
      <h2>Loan {loan.id}</h2>
      <h3>Covenants</h3>
      <ul>
        {loan.covenants.map(c => (
          <li key={c.key}>{c.key}: {c.current} / Threshold {c.threshold}</li>
        ))}
      </ul>

      <h3>ESG</h3>
      <p>Score: {loan.esg.score}</p>
      <ul>
        {loan.esg.breachesPredicted.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      <h3>Risk timeline</h3>
      <RiskTimeline predictions={loan.predictions} />

      <h3>Audit</h3>
      <ul>
        {loan.audit.map((a, i) => <li key={i}>{a.when} — {a.action} — {a.by}</li>)}
      </ul>
    </div>
  );
}
