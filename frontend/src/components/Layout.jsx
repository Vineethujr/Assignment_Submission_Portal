import { BookOpen, ClipboardList, LogOut, Menu, UploadCloud, Users, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context';
import { ROLES } from '../utils/constants';

export default function Layout() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = profile?.role === ROLES.TEACHER
    ? [
        ['/teacher', <ClipboardList size={18} />, 'Teacher Dashboard'],
        ['/teacher/assignments', <BookOpen size={18} />, 'Assignments'],
      ]
    : [
        ['/student', <ClipboardList size={18} />, 'Student Dashboard'],
        ['/student/assignments', <BookOpen size={18} />, 'Assignments'],
        ['/student/submissions', <UploadCloud size={18} />, 'My Submissions'],
      ];

  const doLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">CA</div>
          <div><strong>Cloud Assignment</strong><span>Portal</span></div>
          <button className="icon-btn mobile-only" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
        <nav>
          {links.map(([to, icon, label]) => (
            <NavLink key={to} to={to} end={to === '/student' || to === '/teacher'} onClick={() => setOpen(false)}>
              {icon}<span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-chip">
            <div className="avatar">{(profile?.name || 'U')[0].toUpperCase()}</div>
            <div><strong>{profile?.name || 'User'}</strong><span>{profile?.role || 'student'}</span></div>
          </div>
          <button className="logout-btn" onClick={doLogout}><LogOut size={18} /> Sign out</button>
        </div>
      </aside>
      <main className="content">
        <header className="topbar">
          <button className="icon-btn mobile-only" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <div>
            <span className="eyebrow">Cloud Computing Project</span>
            <h1>Assignment Submission & Feedback</h1>
          </div>
        </header>
        <section className="page-wrap"><Outlet /></section>
      </main>
    </div>
  );
}
