# Code Index

| File | Purpose |
|---|---|
| `frontend/src/firebase.js` | Firebase client initialization + emulator connections |
| `frontend/src/context.jsx` | Global authentication state provider |
| `frontend/src/App.jsx` | Routes and role-protected route groups |
| `frontend/src/components/Layout.jsx` | Shared portal shell/navigation |
| `frontend/src/components/ProtectedRoute.jsx` | UI-level authentication/RBAC protection |
| `frontend/src/services/authService.js` | Registration, login, logout, profile loading |
| `frontend/src/services/firestoreService.js` | Courses, assignments, submissions and grading data access |
| `frontend/src/services/storageService.js` | Resumable Storage upload + file delete helper |
| `frontend/src/services/apiService.js` | Optional REST API client with Firebase bearer token |
| `frontend/src/pages/StudentDashboard.jsx` | Student statistics/live assignment/submission view |
| `frontend/src/pages/StudentAssignments.jsx` | Student assignment list |
| `frontend/src/pages/StudentAssignmentDetail.jsx` | Upload/resubmit/version history |
| `frontend/src/pages/StudentSubmissions.jsx` | Submission table, marks and feedback |
| `frontend/src/pages/TeacherDashboard.jsx` | Teacher statistics/live submission feed |
| `frontend/src/pages/TeacherAssignments.jsx` | Course + assignment CRUD UI |
| `frontend/src/pages/TeacherAssignmentDetail.jsx` | Teacher review/grading/feedback |
| `backend/app.py` | Optional FastAPI REST service |
| `functions/src/index.js` | Optional serverless deadline/version/analytics processing |
| `rules/firestore.rules` | Firestore authorization/data validation |
| `rules/storage.rules` | Storage authorization/file validation |
| `cloud/*.py` | Reusable Python cloud service helpers |
| `ai_service/app.py` | Optional similarity/grade-assistance API |
| `ai_service/train_grade_model.py` | Optional baseline grade model training |
| `scripts/seed-demo.js` | Cloud project dummy data seeding |
| `scripts/seed-emulator.js` | Local emulator dummy data seeding |
| `.github/workflows/ci.yml` | Automated CI checks |
