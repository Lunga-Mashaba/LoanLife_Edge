import { useEffect, useState } from 'react';
import { fetchPortfolio } from '../../services/apiClient';

export default function Portfolio() {
  const [data, setData] = useState(null);
  useEffect(() => { fetchPortfolio().then(setData); }, []);
  if (!data) return <div>Loading…</div>;

  return (
    <div className="grid">
      {data.loans.map(l => (
        <div key={l.id} className="card glow">
          <h3>{l.name}</h3>
          <p>Health: {l.health}</p>
          <p>ESG: {l.esg}</p>
          <p>
            Risk: 30d {Math.round(l.risk30 * 100)}% ·
            60d {Math.round(l.risk60 * 100)}% ·
            90d {Math.round(l.risk90 * 100)}%
          </p>
          <a href={`/loan/${l.id}`}>View details</a>
        </div>
      ))}
    </div>
  );
}
