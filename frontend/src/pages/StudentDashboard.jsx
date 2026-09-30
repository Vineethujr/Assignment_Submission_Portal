import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, FileCheck2 } from 'lucide-react';
import { useAuth } from '../context';
import { subscribeToAssignments, subscribeToMySubmissions, getCourses } from '../services/firestoreService';
import { formatDate, SUBMISSION_STATUS } from '../utils/constants';
import StatCard from '../components/StatCard';
import StatusPill from '../components/StatusPill';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [data, setData] = useState({ assignments: [], submissions: [], courses: [] });
  const [error, setError] = useState('');
  useEffect(() => {
    let unsubscribeCourses;
    try {
      const unsubscribeAssignments = subscribeToAssignments('student', user.uid, (assignments) => setData((old) => ({ ...old, assignments })));
      const unsubscribeSubmissions = subscribeToMySubmissions(user.uid, (submissions) => setData((old) => ({ ...old, submissions })));
      getCourses().then((courses) => setData((old) => ({ ...old, courses }))).catch((e) => setError(e.message));
      unsubscribeCourses = () => { unsubscribeAssignments(); unsubscribeSubmissions(); };
    } catch (e) { setError(e.message); unsubscribeCourses = () => {}; }
    return () => unsubscribeCourses?.();
  }, [user.uid]);
  const byAssignment = useMemo(() => new Map(data.submissions.map((s) => [s.assignmentId, s])), [data.submissions]);
  const pending = data.assignments.filter((a) => !byAssignment.has(a.id)).length;
  const late = data.submissions.filter((s) => s.submissionStatus === SUBMISSION_STATUS.LATE).length;
  const graded = data.submissions.filter((s) => s.submissionStatus === SUBMISSION_STATUS.GRADED).length;
  const courseName = Object.fromEntries(data.courses.map((c) => [c.id, c.courseName]));
  return <div className="dashboard"><div className="hero"><div><span className="eyebrow">Student dashboard</span><h2>Welcome, {profile?.name || 'Student'}</h2><p>Track coursework, deadlines, uploads and teacher feedback from one place.</p></div></div>{error && <div className="alert error">{error}</div>}<div className="stats-grid"><StatCard label="Total assignments" value={data.assignments.length} icon={<FileCheck2/>}/><StatCard label="Pending" value={pending} icon={<Clock3/>}/><StatCard label="Late" value={late} icon={<AlertTriangle/>}/><StatCard label="Graded" value={graded} icon={<CheckCircle2/>}/></div>
    <div className="card"><div className="section-head"><div><h3>Upcoming deadlines</h3><p className="muted">Updates automatically when assignment/submission documents change.</p></div></div><div className="table-wrap"><table><thead><tr><th>Assignment</th><th>Course</th><th>Deadline</th><th>Status</th></tr></thead><tbody>{data.assignments.slice(0,8).map((a)=>{const s=byAssignment.get(a.id); return <tr key={a.id}><td>{a.title}</td><td>{courseName[a.courseId] || a.courseId}</td><td>{formatDate(a.deadline)}</td><td>{s ? <StatusPill status={s.submissionStatus}/> : <StatusPill status={SUBMISSION_STATUS.NOT_SUBMITTED}/>}</td></tr>})}</tbody></table></div></div>
    <div className="card"><div className="section-head"><div><h3>Recent feedback</h3><p className="muted">Your latest graded submissions.</p></div></div>{data.submissions.filter(s=>s.feedback || s.marks !== null).slice(0,5).map(s=><div className="feedback-row" key={s.id}><div><strong>{s.fileName}</strong><span>{formatDate(s.gradedAt || s.submittedAt)}</span></div><div className="feedback-content"><b>{s.marks ?? '—'} marks</b><p>{s.feedback || 'No written feedback.'}</p></div></div>)}{!data.submissions.some(s=>s.feedback || s.marks !== null) && <div className="empty">No feedback yet.</div>}</div>
  </div>;
}
