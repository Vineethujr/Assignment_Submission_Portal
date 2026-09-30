export default function StatusPill({ status }) {
  const text = status?.replaceAll('_', ' ') || 'UNKNOWN';
  return <span className={`status-pill ${status?.toLowerCase() || ''}`}>{text}</span>;
}
