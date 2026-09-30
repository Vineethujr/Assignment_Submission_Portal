# System Architecture

## Core student-friendly architecture

```text
Student / Teacher Browser
          |
          v
     Firebase Hosting
          |
          v
      React + Vite
       /       \
      v         v
Firebase Auth  Firestore
                   \
                    v
               Cloud Storage
                    |
                    v
             Submission Files
```

## Optional industry REST architecture

```text
Users
  |
  v
CDN / HTTPS
  |
  v
Firebase Hosting / React
  |
  +---- Firebase Auth
  |
  +---- REST API (FastAPI / Cloud Run)
              |
              +---- Firestore
              +---- Cloud Storage
              +---- Logging / Monitoring
```

## Optional serverless processing layer

```text
Firestore submission created
          |
          v
Cloud Functions v2
   |              |
   v              v
deadline/version  analytics
classification     aggregation
```

Firestore event-driven functions can react to document creation without updating the client application. Current Firebase documentation recommends the modular v2 trigger APIs such as `onDocumentCreated`. citeturn501699search0turn501699search3

## Request flow

1. User authenticates with Firebase Auth.
2. React gets the current authenticated user and role profile.
3. Assignment metadata is queried from Firestore.
4. Student selects a PDF/DOCX/JPG/PNG and the frontend validates size/type.
5. File is uploaded under `assignments/{assignmentId}/{studentId}/...` in Cloud Storage.
6. Firestore receives the submission metadata and version number.
7. Teacher queries only permitted submissions.
8. Teacher writes marks and feedback.
9. Student reads the updated submission document.
