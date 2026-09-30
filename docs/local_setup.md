# Local / Virtual Simulation

This path runs the full core application without paid cloud infrastructure by using Firebase Local Emulator Suite for Authentication, Firestore, and Storage. Firebase's current emulator guidance requires Node.js and Java; the documentation currently says Node 16+ and JDK 11+, and notes that Firestore emulator support is moving toward Java 21, so JDK 21 is the safest choice for a fresh setup. citeturn368546search0turn368546search3

## 1. Install software

Windows recommended:

- Node.js 20 or newer
- JDK 21
- Git
- VS Code

Check:

```powershell
node --version
npm --version
java -version
git --version
```

The Firebase CLI requires Node 18+ according to current Firebase documentation. citeturn368546search1

## 2. Install dependencies

From the repository root:

```powershell
npm install
npm run install:frontend
npm run install:functions
npm install -g firebase-tools
```

## 3. Start Firebase emulators

```powershell
firebase emulators:start --project demo-cloud-assignment
```

The project already configures Auth on `9099`, Firestore on `8080`, Storage on `9199`, and Emulator UI on `4000`.

## 4. Create frontend environment file

Copy:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

For local mode set:

```env
VITE_FIREBASE_API_KEY=demo-key
VITE_FIREBASE_AUTH_DOMAIN=demo-cloud-assignment.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-cloud-assignment
VITE_FIREBASE_STORAGE_BUCKET=demo-cloud-assignment.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=demo
VITE_FIREBASE_APP_ID=demo
VITE_USE_FIREBASE_EMULATORS=true
VITE_EMULATOR_HOST=127.0.0.1
VITE_API_BASE_URL=
```

The Web SDK connects to the Auth/Firestore/Storage emulators using the explicit emulator connection functions. citeturn368546search4turn368546search6turn368546search3

## 5. Seed dummy accounts and data

Open a second PowerShell window while emulators are running:

```powershell
npm run seed:emulator
```

Expected output:

```text
Local demo seed complete.
Teacher: teacher.demo@example.com / DemoTeacher123!
Student: student.demo@example.com / DemoStudent123!
```

## 6. Start React

```powershell
npm run dev
```

Expected output contains:

```text
Local: http://localhost:5173/
```

## 7. Demo sequence

Teacher:

1. Login with `teacher.demo@example.com` / `DemoTeacher123!`.
2. Open **Assignments**.
3. Confirm **CS101 Cloud Computing**.
4. Create another assignment or use the seeded `Cloud Architecture Report`.
5. Open **Review submissions** after a student upload.
6. Enter marks and feedback.

Student:

1. Login with `student.demo@example.com` / `DemoStudent123!`.
2. Open the assignment.
3. Choose `sample_files/sample.pdf`.
4. Upload the file.
5. Confirm version/status.
6. Log back in as teacher, grade it, then return to the student account.
7. Confirm marks and feedback appear.

## 8. Cloud Storage verification

Open Firebase Emulator UI:

```text
http://localhost:4000
```

Use the Storage and Firestore tabs to prove that the file object and metadata were stored separately.

## 9. Stop/reset

Press `Ctrl+C` in the emulator terminal. The Firestore emulator data is cleared when it is shut down unless you configure import/export persistence. citeturn368546search9
