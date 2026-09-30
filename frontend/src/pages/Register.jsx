import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); setError(''); if (form.password.length < 6) return setError('Password must be at least 6 characters.'); if (form.password !== form.confirm) return setError('Passwords do not match.'); setBusy(true); try { await registerStudent(form); navigate('/student', { replace: true }); } catch (err) { setError(err.message.replace('Firebase: ', '')); } finally { setBusy(false); } };
  return <div className="auth-page"><div className="auth-card"><div className="brand large"><div className="brand-mark">CA</div><div><strong>Cloud Assignment</strong><span>Portal</span></div></div><h1>Create student account</h1><p className="muted">Teacher accounts should be provisioned by an administrator.</p>{error && <div className="alert error">{error}</div>}
    <form className="form-stack" onSubmit={submit}><label>Full name<input required value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/></label><label>Email<input required type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/></label><label>Password<input required type="password" minLength="6" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/></label><label>Confirm password<input required type="password" value={form.confirm} onChange={(e)=>setForm({...form,confirm:e.target.value})}/></label><button className="primary-btn" disabled={busy}>{busy?'Creating…':'Create account'}</button></form><p className="auth-foot">Already registered? <Link to="/login">Sign in</Link></p>
  </div></div>;
}
