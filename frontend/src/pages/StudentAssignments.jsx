import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { getAssignments, getCourses, getMySubmissions } from '../services/firestoreService';
import { formatDate, SUBMISSION_STATUS } from '../utils/constants';
import StatusPill from '../components/StatusPill';

export default function StudentAssignments() {
  const { user } = useAuth();
  const [data, setData] = useState({ assignments: [], courses: [], submissions: [] });
  const [error, setError] = useState('');
  useEffect(() => {
    if (!user?.uid) return;
    Promise.all([getAssignments('student', user.uid), getCourses(), getMySubmissions(user.uid)])
      .then(([assignments, courses, submissions]) => setData({ assignments, courses, submissions }))
      .catch((e) => setError(e.message));
  }, [user?.uid]);
  const courseName = useMemo(() => Object.fromEntries(data.courses.map((c) => [c.id, c.courseName])), [data.courses]);
  const submitted = useMemo(() => new Map(data.submissions.map((s) => [s.assignmentId, s])), [data.submissions]);
  return <div><div className="section-title"><div><span className="eyebrow">Coursework</span><h2>Available assignments</h2></div></div>{error && <div className="alert error">{error}</div>}<div className="assignment-grid">{data.assignments.map((a)=><article className="assignment-card" key={a.id}><div className="card-top"><span className="tag">{courseName[a.courseId] || a.courseId}</span><StatusPill status={submitted.get(a.id)?.submissionStatus || SUBMISSION_STATUS.NOT_SUBMITTED}/></div><h3>{a.title}</h3><p>{a.description || 'No description provided.'}</p><div className="meta"><span>Due {formatDate(a.deadline)}</span><span>{a.maxMarks} marks</span></div><Link className="secondary-btn" to={`/student/assignments/${a.id}`}>Open assignment</Link></article>)}</div>{!data.assignments.length&&!error&&<div className="card empty">No assignments have been published yet.</div>}</div>;
}
