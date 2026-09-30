/*
 * Creates dummy teacher/student accounts plus a course and assignment.
 * Run from the repository root after installing root dependencies:
 *   npm install
 *   set GOOGLE_APPLICATION_CREDENTIALS=C:\path\service-account.json
 *   node scripts/seed-demo.js
 *
 * NEVER commit the service-account JSON.
 */
const admin = require('firebase-admin');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

admin.initializeApp();
const db = getFirestore();
const auth = admin.auth();

async function upsertUser({ email, password, name, role }) {
  let user;
  try { user = await auth.getUserByEmail(email); }
  catch { user = await auth.createUser({ email, password, displayName: name }); }
  await auth.setCustomUserClaims(user.uid, { role });
  await db.collection('users').doc(user.uid).set({ userId: user.uid, name, email, role, createdAt: Timestamp.now() }, { merge: true });
  return user;
}

async function main() {
  const teacher = await upsertUser({ email: 'teacher.demo@example.com', password: 'DemoTeacher123!', name: 'Demo Teacher', role: 'teacher' });
  const student = await upsertUser({ email: 'student.demo@example.com', password: 'DemoStudent123!', name: 'Demo Student', role: 'student' });

  const courseRef = db.collection('courses').doc('CS101');
  await courseRef.set({ courseName: 'CS101 Cloud Computing', teacherId: teacher.uid, createdAt: Timestamp.now() });

  const rootAssignmentRef = db.collection('assignments').doc('A1');
  await rootAssignmentRef.set({
    courseId: courseRef.id,
    title: 'Cloud Architecture Report',
    description: 'Design a scalable cloud architecture for a university assignment portal.',
    deadline: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    maxMarks: 100,
    allowedFileTypes: ['pdf', 'docx', 'png', 'jpg', 'jpeg'],
    maxFileSizeMB: 20,
    allowLateSubmissions: true,
    allowResubmission: true,
    createdBy: teacher.uid,
    teacherId: teacher.uid,
    createdAt: Timestamp.now(),
  }, { merge: true });

  console.log('Demo accounts created:');
  console.log('Teacher:', teacher.email, '/ DemoTeacher123!');
  console.log('Student:', student.email, '/ DemoStudent123!');
  console.log('Course: CS101');
  console.log('Assignment: A1');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
