import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function RiskTimeline({ predictions }) {
  const data = predictions.map(p => ({ name: `${p.horizon}d`, prob: p.probability }));
  return (
    <LineChart width={420} height={200} data={data}>
      <XAxis dataKey="name" stroke="var(--silver)" />
      <YAxis stroke="var(--silver)" />
      <Tooltip />
      <Line type="monotone" dataKey="prob" stroke="var(--accent)" strokeWidth={2} dot />
    </LineChart>
  );
}
