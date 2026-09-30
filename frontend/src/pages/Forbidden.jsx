import { Link } from 'react-router-dom';
export default function Forbidden() { return <div className="center-card"><h2>Access denied</h2><p className="muted">Your account does not have permission to open this page.</p><Link className="primary-btn inline" to="/">Return to dashboard</Link></div>; }
