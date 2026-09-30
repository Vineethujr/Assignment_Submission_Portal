# Cloud-Based Student Assignment Submission & Feedback Portal — Project Report

## Abstract

The Cloud-Based Student Assignment Submission & Feedback Portal is a web application that digitizes assignment submission, review, grading and feedback. The project uses React for the user interface and Firebase managed services for authentication, database, object storage and hosting. Students can register, view assignments, submit supported files and track their versions/status. Teachers can create coursework, review submissions, assign marks and provide written feedback. The architecture separates structured metadata from binary files, applies role-based Security Rules and provides optional REST, serverless and AI extensions.

## 1. Introduction

Educational institutions increasingly require accessible digital workflows for coursework. The portal provides a centralized system in which assignment files and related metadata can be accessed through a browser. The project demonstrates cloud computing concepts by composing authentication, managed database, object storage and hosted application services.

## 2. Problem Statement

Traditional paper, email and removable-media workflows can lead to scattered files, inconsistent deadline tracking and delayed feedback. Teachers also need a single place to review submissions and students need a reliable way to retrieve feedback and previous versions.

## 3. Objectives

1. Build a cloud-hosted student assignment workflow.
2. Implement secure student/teacher authentication.
3. Enforce role-based authorization.
4. Store metadata in a cloud database.
5. Store assignment files in cloud object storage.
6. Implement assignment CRUD and deadline logic.
7. Implement submission, resubmission, grading and feedback.
8. Provide REST and serverless architecture options.
9. Test security, validation and failure scenarios.
10. Produce reproducible GitHub documentation and deployment proof.

## 4. Existing System

Common basic approaches use email attachments, local folders, USB drives or paper forms. These approaches can make version tracking, centralized access and structured feedback difficult. The source specification also references LMS platforms such as Google Classroom, Canvas and Blackboard as examples of systems using similar broad workflows.

## 5. Proposed System

The proposed portal provides separate student and teacher dashboards with cloud-backed authentication, Firestore metadata and Cloud Storage file objects. Public registration creates only students. Teacher/admin roles are provisioned by an authorized process.

## 6. User Roles

### Student

Register/login, view assignments, see deadlines, upload and resubmit files, view own submissions, marks and teacher feedback.

### Teacher

Login, create/manage courses and assignments, define deadlines/marks/file limits, view course submissions, review files, grade and provide feedback.

### Admin

The schema supports user/course management and role provisioning as an extension.

## 7. Cloud Computing Concepts

### Cloud Computing

The portal uses hosted managed services instead of depending on one local server.

### SaaS

Users consume the assignment portal through a browser.

### PaaS

Firebase supplies managed hosting, authentication, database and storage services.

### IaaS

Not a dependency of the core version. AWS/Azure/GCP equivalents are documented as an advanced architecture.

### Cloud Database

Cloud Firestore stores user profiles, courses, assignments, submission metadata, marks and feedback.

### Object Storage

Cloud Storage stores the PDF/DOCX/image binaries.

### Authentication

Firebase Authentication handles email/password identity.

### Authorization and RBAC

Firestore and Storage Security Rules authorize requests according to user identity and role. The application uses `student`, `teacher` and `admin` roles.

### REST API

An optional FastAPI service exposes conventional endpoints for integrations and future clients.

### Serverless

Optional Cloud Functions v2 respond to Firestore events for deadline/version processing and analytics.

### Scalability/Elasticity

The architecture uses managed services, direct object storage uploads and an optional stateless backend so compute can be scaled separately from stored files.

### CDN

Firebase Hosting provides CDN-backed delivery for the web frontend.

### Environment Variables / Secrets

Firebase web configuration is supplied through frontend `.env`. Server credentials are supplied through backend environment configuration and never committed.

### Logging/Monitoring

The optional Functions layer uses structured logger calls; platform consoles can be used to observe deployment and usage.

### CI/CD

GitHub Actions runs frontend tests/builds, Function tests and Python compile checks.

## 8. Technology Stack

### Core recommended implementation

React + Vite + JavaScript, Firebase Authentication, Cloud Firestore, Firebase Cloud Storage and Firebase Hosting.

### Optional backend

Python FastAPI with Firebase Admin SDK, deployable as a container on Cloud Run or an equivalent service.

### Optional AI extension

Sentence-BERT similarity and TF-IDF + Ridge grade suggestion.

## 9. System Architecture

```text
Student / Teacher
      |
      v
Firebase Hosting / CDN
      |
      v
React + Vite
  |       |       |
  v       v       v
 Auth   Firestore Storage
          |
          v
   optional Functions

Optional REST path:
React → FastAPI → Firebase Admin → Firestore/Storage
```

## 10. Database Design

Collections:

```text
users/{userId}
courses/{courseId}
assignments/{assignmentId}
submissions/{submissionId}
analytics/{courseId_assignmentId}
```

Primary keys are document IDs. Foreign-key-like fields (`courseId`, `assignmentId`, `studentId`, `teacherId`) maintain relationships. Indexes are supplied for the application's compound queries.

## 11. Cloud Storage Design

```text
assignments/{assignmentId}/{studentId}/{randomId}-{fileName}
```

Storage holds large objects; Firestore holds their metadata/reference. The implementation limits browser uploads to PDF/DOCX/JPG/PNG and 20 MB by default.

## 12. Authentication

Students register using Firebase Email/Password Authentication. The authentication state is observed by the React `AuthProvider`. A user profile is loaded from `users/{uid}` and determines the dashboard.

## 13. Authorization

Protected routes prevent incorrect dashboard navigation in the UI. Firestore/Storage Security Rules provide the real security boundary so a user cannot simply bypass the frontend by editing URLs or requests.

## 14. Assignment Management

Teachers can create and delete assignments with title, description, course, deadline, maximum marks and file constraints. Assignment documents record `createdBy` and `teacherId`.

## 15. Submission Workflow

1. Student opens assignment.
2. File type and size are validated.
3. Upload path is generated with assignment ID, student ID and random UUID.
4. File uploads to Cloud Storage.
5. Firestore submission metadata is created.
6. Deadline determines initial `SUBMITTED` or `LATE` status.
7. Repeated uploads increment version number.

## 16. Deadline Management

The client performs immediate status calculation for responsiveness. The optional serverless trigger provides a trusted server-side reclassification using Firestore timestamps and assignment deadlines. Production should treat UTC/server timestamps as authoritative and avoid trusting the student's device clock.

## 17. Feedback & Grading

Teachers enter numeric marks and written feedback. The grade validation rejects values above the assignment's maximum. Students can read, but cannot modify, grading fields under the Firestore Rules.

## 18. REST API

The FastAPI service provides assignment CRUD, student submission, submission retrieval, grading, feedback and authorized download endpoints. Firebase ID tokens are verified server-side through Firebase Admin SDK.

## 19. Implementation

The frontend is modularized into pages, components, services and utilities. Firebase initialization is isolated in `src/firebase.js`. The backend contains authorization dependencies and service-level validation. Rules are versioned under `rules/`.

## 20. Testing

A 25-case functional matrix is included in `docs/testing.md`. Automated tests cover deadline classification and upload validation, while GitHub Actions provides repeatable CI checks. Security Rules should be exercised with emulator tests before a production deployment.

## 21. Cloud Deployment

The primary deployment uses Firebase Hosting, Authentication, Firestore and Storage. The optional backend can be deployed to a managed container platform. Cloud Functions are an advanced enhancement and are not required for the free-tier core.

## 22. Security

Security controls include authenticated access, RBAC, query-safe Firestore rules, Storage path ownership, MIME/size validation, environment variables, explicit CORS and optional signed URLs. Production hardening should also add App Check, malware scanning, rate limiting, audit logs and backups.

## 23. Scalability

At small scale, Firebase managed services simplify operations. At larger scale, use CDN delivery, direct storage uploads, stateless APIs/serverless compute, queues, background workers, caching, pre-aggregated analytics and monitoring.

## 24. Failure Handling

Transient storage/database/network failures should surface as retryable errors. The system avoids writing metadata before a successful file upload. Production REST APIs should use idempotency keys for safe retries.

## 25. Results

The intended project result is an end-to-end assignment workflow where:

- a student can authenticate and upload a valid file,
- the file appears in object storage,
- metadata appears in Firestore,
- the teacher can review and grade the submission,
- feedback becomes visible to the student,
- unauthorized role actions are rejected.

**Measured demo values should be filled from the actual run** rather than fabricated in the report. Suggested result metrics include total assignments, submissions tested, valid upload success rate, invalid upload rejection rate, late-status correctness, unauthorized request rejection count, and automated test pass count.

## 26. Advantages

- Centralized cloud workflow
- Remote access
- Separation of file/data concerns
- Role-based security
- Version history
- Managed infrastructure
- Scalable architecture path
- GitHub-friendly modular codebase

## 27. Limitations

- Core browser download links are simpler than a full backend-mediated signed URL workflow.
- Cloud Functions are optional because the current Firebase no-cost plan does not include them.
- AI assistance is a demonstration feature and requires human review.
- Enterprise backup, auditing and malware scanning are not fully implemented in the MVP.

## 28. Future Scope

- Email/push deadline reminders
- Rubric-based grading
- Plagiarism detection dashboard
- Antivirus scanning/quarantine
- App Check and rate limiting
- Notification queues
- Analytics and export
- Mobile client
- Staging/production CI/CD
- Backup/disaster recovery

## 29. Conclusion

The project demonstrates how a real educational workflow can be modeled as a cloud-native application. It separates structured metadata from file objects, uses authentication and role-based access, exposes optional REST APIs, supports event-driven processing, and provides local emulation plus cloud deployment paths. The result is a placement-oriented project that demonstrates practical Cloud Computing concepts while remaining accessible to a student developer.
