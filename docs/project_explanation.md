# Project Explanation

## Simple explanation

This portal is a cloud-hosted digital assignment workflow. A teacher publishes coursework and a deadline. A student signs in, selects the assignment, uploads a supported file, and receives a submission status. The teacher later opens the submission, records marks and written feedback, and the student sees the result in the dashboard.

The key cloud idea is **separation of metadata and files**: Firestore stores queryable records, while Cloud Storage stores the file objects. Authentication establishes identity, Security Rules enforce ownership/roles, and Firebase Hosting delivers the web app.

## Technical explanation

```text
Teacher
  ↓
Creates Assignment
  ↓
Cloud Firestore
  ↓
Student Dashboard
  ↓
Student Uploads Assignment
  ↓
Cloud Storage
  ↓
Submission Metadata Saved in Firestore
  ↓
Teacher Reviews Submission
  ↓
Marks + Feedback
  ↓
Cloud Firestore
  ↓
Student Views Feedback
```

The application is a React client using Firebase's modular web SDK. Firebase Authentication tracks the signed-in identity; Firestore stores the system-of-record metadata; Storage holds the binary file; and optional Functions/REST services provide server-side processing paths.

## Why cloud computing fits

- Students and teachers can access a hosted application from different locations.
- Managed object storage is better suited to PDFs/DOCX/images than database binary columns.
- Managed database services remove the need to operate a local database server.
- Authentication and Security Rules create a centralized access-control layer.
- Hosting can scale asset delivery through a CDN.
- Event-driven processing can be added without permanently running a custom server.

Firebase Hosting is backed by a global CDN and serves over SSL; Firebase Auth supports email/password authentication; Firestore and Storage integrate with Security Rules for web clients. citeturn415101search4turn415101search0turn196755search3
