# Database Design

## Collections

### `users/{userId}`
`userId`, `name`, `email`, `role`, `createdAt`

### `courses/{courseId}`
`courseId` is the document ID. Fields: `courseName`, `teacherId`, `createdAt`.

### `assignments/{assignmentId}` (root-level collection in this implementation; the supplied source also described a course subcollection variant)
`assignmentId`, `courseId`, `title`, `description`, `deadline`, `maxMarks`, `allowedFileTypes`, `maxFileSizeMB`, `createdBy`, `teacherId`, `createdAt`.

### `submissions/{submissionId}`
`submissionId`, `assignmentId`, `courseId`, `teacherId`, `studentId`, `studentName`, `fileName`, `fileUrl`, `storagePath`, `submittedAt`, `submissionStatus`, `marks`, `feedback`, `gradedAt`, `version`.

### `analytics/{courseId_assignmentId}`
`total`, `late`, `graded`, `onTimePct`, `updatedAt`.

## Relationships

Teacher → Course → Assignment → Submission ← Student.

The database stores structured metadata, not large assignment binaries. The file is placed in Cloud Storage; Firestore stores the reference and audit metadata. Firestore supports generated document IDs, reads/writes through client SDKs, and Security Rules for authenticated web clients. citeturn415101search3turn196755search3

## Indexing

`rules/firestore.indexes.json` includes the compound queries used by the app for student submissions and teacher assignment submissions. Firestore queries must be designed to satisfy Security Rules because Rules are not filters. citeturn196755search4
