import { useState } from 'react';
import { Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context';

export default function Login() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user && profile) return <Navigate to={profile.role === 'teacher' ? '/teacher' : '/student'} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setBusy(true);
    try { const current = await login(form.email, form.password); navigate(location.state?.from || '/', { replace: true }); void current; }
    catch (err) { setError(err.message.replace('Firebase: ', '')); }
    finally { setBusy(false); }
  };

  return <div className="auth-page"><div className="auth-card"><div className="brand large"><div className="brand-mark">CA</div><div><strong>Cloud Assignment</strong><span>Portal</span></div></div><h1>Welcome back</h1><p className="muted">Sign in to continue to your workspace.</p>
    {error && <div className="alert error">{error}</div>}
    <form onSubmit={handleSubmit} className="form-stack">
      <label>Email<input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></label>
      <label>Password<input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/></label>
      <button className="primary-btn" id="login" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="auth-foot">New student? <Link to="/register">Create an account</Link></p>
  </div></div>;
}
