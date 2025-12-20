export default function ESGIndicators({ score = 75 }) {
  const status = score >= 80 ? 'Compliant' : score >= 60 ? 'Watch' : 'Risk';
  return (
    <div className={`badge ${status.toLowerCase()}`}>ESG {status} ({score})</div>
  );
}
