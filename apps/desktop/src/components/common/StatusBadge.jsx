export default function StatusBadge() {
  const online = navigator.onLine;
  return (
    <span className={`badge ${online ? 'ok' : 'warn'}`}>
      {online ? 'Local • Encrypted' : 'Offline • Local only'}
    </span>
  );
}
