# Cloud Storage Design

## Database vs Object Storage

| Data type | Store in |
|---|---|
| user profile | Firestore |
| course | Firestore |
| assignment title/description/deadline | Firestore |
| submission metadata | Firestore |
| marks/feedback | Firestore |
| PDF/DOCX/image binary | Cloud Storage |

The actual assignment file should not normally be stored as a binary database field. Object storage is designed for file/object data and lets the database remain focused on queryable metadata.

## Path convention

```text
assignments/
  {assignmentId}/
    {studentId}/
      {randomId}-{sanitizedOriginalFileName}
```

Example:

```text
assignments/A1/student-123/550e8400-e29b-41d4-a716-446655440000-cloud-report.pdf
```

The random ID prevents collisions while the student-specific path makes ownership checks straightforward in Storage Security Rules.

Cloud Storage for Firebase provides authenticated file operations and Security Rules can validate both access and metadata such as size/content type. The implementation uses authenticated paths plus a 20 MB file-size limit. citeturn415101search7turn196755search1

## Signed/private downloads

The optional FastAPI REST layer implements `/api/submissions/{id}/download`, authorizes the caller, and attempts a short-lived V4 signed URL. For the simplest Firebase client demo, the UI stores a Firebase download URL in the submission metadata. For a stricter production design, prefer short-lived signed URLs or backend-mediated streaming instead of exposing long-lived browser download links.
