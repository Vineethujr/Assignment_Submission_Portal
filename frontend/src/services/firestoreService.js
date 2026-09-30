import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { ROLES, SUBMISSION_STATUS, isLate } from '../utils/constants';

export async function createCourse({ courseName, teacherId }) {
  if (!courseName?.trim()) throw new Error('Course name is required.');
  return addDoc(collection(db, 'courses'), {
    courseName: courseName.trim(),
    teacherId,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToCourses(callback) {
  const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
}

export async function getCourses() {
  const snapshot = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getTeacherCourses(teacherId) {
  const snapshot = await getDocs(query(collection(db, 'courses'), where('teacherId', '==', teacherId)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function createAssignment({ courseId, title, description, deadline, maxMarks, allowedFileTypes, maxFileSizeMB, allowLateSubmissions = true, allowResubmission = true, createdBy }) {
  const marks = Number(maxMarks);
  const size = Number(maxFileSizeMB);
  if (!courseId || !title?.trim() || !deadline) throw new Error('Course, title and deadline are required.');
  if (!Number.isFinite(marks) || marks <= 0) throw new Error('Maximum marks must be greater than zero.');
  if (!Number.isFinite(size) || size <= 0 || size > 20) throw new Error('Maximum file size must be between 1 and 20 MB.');
  return addDoc(collection(db, 'assignments'), {
    courseId,
    title: title.trim(),
    description: description?.trim() || '',
    deadline: new Date(deadline),
    maxMarks: marks,
    allowedFileTypes: allowedFileTypes?.length ? allowedFileTypes : ['pdf', 'docx', 'png', 'jpg', 'jpeg'],
    maxFileSizeMB: size,
    allowLateSubmissions: Boolean(allowLateSubmissions),
    allowResubmission: Boolean(allowResubmission),
    createdBy,
    teacherId: createdBy,
    createdAt: serverTimestamp(),
  });
}

export async function updateAssignment(id, patch) {
  const clean = { ...patch };
  if (clean.deadline) clean.deadline = new Date(clean.deadline);
  await updateDoc(doc(db, 'assignments', id), clean);
}

export async function deleteAssignment(id) {
  await deleteDoc(doc(db, 'assignments', id));
}

export function subscribeToAssignments(role, userId, callback) {
  const q = role === ROLES.TEACHER && userId
    ? query(collection(db, 'assignments'), where('teacherId', '==', userId), orderBy('deadline', 'asc'))
    : query(collection(db, 'assignments'), orderBy('deadline', 'asc'));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
}

export function subscribeToMySubmissions(studentId, callback) {
  const q = query(collection(db, 'submissions'), where('studentId', '==', studentId), orderBy('submittedAt', 'desc'));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
}

export function subscribeToTeacherSubmissions(teacherId, callback) {
  const q = query(collection(db, 'submissions'), where('teacherId', '==', teacherId), orderBy('submittedAt', 'desc'), limit(500));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
}

export async function getAssignments(role = null, userId = null) {
  const base = role === ROLES.TEACHER && userId
    ? query(collection(db, 'assignments'), where('teacherId', '==', userId), orderBy('deadline', 'asc'))
    : query(collection(db, 'assignments'), orderBy('deadline', 'asc'));
  const snapshot = await getDocs(base);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getAssignmentById(id) {
  const snapshot = await getDoc(doc(db, 'assignments', id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function getAssignmentsByCourse(courseId) {
  const snapshot = await getDocs(query(collection(db, 'assignments'), where('courseId', '==', courseId), orderBy('deadline', 'asc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function createSubmission({ assignment, studentId, studentName, fileName, fileUrl, storagePath, submittedAt = new Date(), version = 1 }) {
  const late = isLate(submittedAt, assignment.deadline);
  return addDoc(collection(db, 'submissions'), {
    assignmentId: assignment.id,
    courseId: assignment.courseId,
    teacherId: assignment.teacherId || assignment.createdBy,
    studentId,
    studentName,
    fileName,
    fileUrl,
    storagePath,
    submittedAt,
    submissionStatus: late ? SUBMISSION_STATUS.LATE : SUBMISSION_STATUS.SUBMITTED,
    marks: null,
    feedback: '',
    gradedAt: null,
    version,
  });
}

export async function getMySubmissions(studentId) {
  const snapshot = await getDocs(query(collection(db, 'submissions'), where('studentId', '==', studentId), orderBy('submittedAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getSubmissionsForAssignment(assignmentId, teacherId) {
  const filters = [where('assignmentId', '==', assignmentId)];
  if (teacherId) filters.push(where('teacherId', '==', teacherId));
  filters.push(orderBy('submittedAt', 'desc'));
  const snapshot = await getDocs(query(collection(db, 'submissions'), ...filters));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getSubmission(id) {
  const snapshot = await getDoc(doc(db, 'submissions', id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function gradeSubmission({ submissionId, marks, feedback, maxMarks }) {
  const score = Number(marks);
  if (!Number.isFinite(score) || score < 0) throw new Error('Marks must be zero or greater.');
  if (score > Number(maxMarks)) throw new Error(`Marks cannot exceed ${maxMarks}.`);
  await updateDoc(doc(db, 'submissions', submissionId), {
    marks: score,
    feedback: feedback?.trim() || '',
    submissionStatus: SUBMISSION_STATUS.GRADED,
    gradedAt: serverTimestamp(),
  });
}

export async function getFeedbackForSubmission(submissionId) {
  const snapshot = await getDoc(doc(db, 'submissions', submissionId));
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return { marks: data.marks ?? null, feedback: data.feedback ?? '', gradedAt: data.gradedAt ?? null };
}

export async function getDashboardStats(role, userId) {
  const assignments = await getAssignments();
  const submissions = role === ROLES.STUDENT ? await getMySubmissions(userId) : await getAllSubmissionsForTeacher(userId);
  return { assignments, submissions };
}

export async function getAllSubmissionsForTeacher(teacherId) {
  const snapshot = await getDocs(query(collection(db, 'submissions'), where('teacherId', '==', teacherId), orderBy('submittedAt', 'desc'), limit(500)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getStudentUsers() {
  const snapshot = await getDocs(query(collection(db, 'users'), where('role', '==', ROLES.STUDENT)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
