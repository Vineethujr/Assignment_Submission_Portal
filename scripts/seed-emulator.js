/* Seed local Firebase Auth + Firestore emulators. No cloud credentials required. */
process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
process.env.GCLOUD_PROJECT = process.env.GCLOUD_PROJECT || 'demo-cloud-assignment';

const admin = require('firebase-admin');
admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT, storageBucket: 'demo-cloud-assignment.firebasestorage.app' });
const auth = admin.auth();
const db = admin.firestore();

async function getOrCreate(email, password, displayName) {
  try { return await auth.getUserByEmail(email); }
  catch { return await auth.createUser({ email, password, displayName }); }
}

async function main() {
  const teacher = await getOrCreate('teacher.demo@example.com', 'DemoTeacher123!', 'Demo Teacher');
  const student = await getOrCreate('student.demo@example.com', 'DemoStudent123!', 'Demo Student');
  await db.collection('users').doc(teacher.uid).set({ userId: teacher.uid, name: teacher.displayName, email: teacher.email, role: 'teacher', createdAt: admin.firestore.Timestamp.now() }, { merge: true });
  await db.collection('users').doc(student.uid).set({ userId: student.uid, name: student.displayName, email: student.email, role: 'student', createdAt: admin.firestore.Timestamp.now() }, { merge: true });
  await db.collection('courses').doc('CS101').set({ courseName: 'CS101 Cloud Computing', teacherId: teacher.uid, createdAt: admin.firestore.Timestamp.now() });
  await db.collection('assignments').doc('A1').set({ courseId:'CS101', title:'Cloud Architecture Report', description:'Design a scalable cloud architecture for a university assignment portal.', deadline:admin.firestore.Timestamp.fromDate(new Date(Date.now()+7*24*60*60*1000)), maxMarks:100, allowedFileTypes:['pdf','docx','png','jpg','jpeg'], maxFileSizeMB:20, allowLateSubmissions:true, allowResubmission:true, createdBy:teacher.uid, teacherId:teacher.uid, createdAt:admin.firestore.Timestamp.now() });
  console.log('Local demo seed complete.');
  console.log('Teacher: teacher.demo@example.com / DemoTeacher123!');
  console.log('Student: student.demo@example.com / DemoStudent123!');
}
main().catch((e)=>{console.error(e);process.exit(1);});
