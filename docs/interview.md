# Interview Preparation — 10 Questions and Strong Answers

## 1. Explain your project.

I developed a Cloud-Based Student Assignment Submission & Feedback Portal where teachers create assignments and students submit their work through a web application. I used Firebase Authentication for identity, Firestore for users, courses, assignments and submission metadata, and Cloud Storage for the actual PDF, DOCX and image files. The teacher can review submissions, enter marks and written feedback, and the student can see the result. The project also includes role-based Security Rules, an optional FastAPI REST API, serverless processing examples, local emulation, automated testing and cloud deployment documentation.

## 2. Why did you use cloud computing instead of a local server?

The assignment workflow benefits from centralized access. Students and teachers can use the same hosted system from different locations. Cloud services also provide managed storage/database infrastructure, authentication integration and a path to scale without manually maintaining one server.

## 3. Why use object storage instead of the database for assignment files?

The database should store structured, queryable metadata such as assignment ID, deadline, student ID and marks. The actual PDF, DOCX or image is a file object, so it belongs in object storage. Firestore stores the storage path and metadata while Cloud Storage holds the binary object.

## 4. How did you implement authentication and authorization?

Firebase Authentication identifies the user. After login, the application loads the user's profile from Firestore, including the role. The React router hides unauthorized pages, but the important protection is in Firestore and Storage Security Rules. Those rules check the authenticated UID, role and course/submission ownership.

## 5. How did you secure one student's submission from another student?

Each submission contains `studentId`, and the Firestore read rule allows a student to read a record only when that field equals their authenticated UID. The Storage object path also contains the student ID. Teacher reads are scoped using `teacherId`. This also lets the application build queries that match the Security Rules.

## 6. How do you handle file uploads and deadlines?

Before upload I validate the file type and size. The upload goes into a path such as `assignments/{assignmentId}/{studentId}/{randomId}-{fileName}`. After the upload succeeds, the metadata document is created. The submission status is based on the submission timestamp compared with the assignment deadline. The optional Cloud Function performs trusted server-side classification as an asynchronous processing step.

## 7. What are REST APIs doing in a Firebase-based project?

The core Firebase-only application can use the Firebase client SDK directly, which is useful for a student-friendly deployment. I added a FastAPI layer to demonstrate a conventional REST architecture for mobile clients, external integrations or reporting services. The API verifies Firebase ID tokens with the Admin SDK and then applies role/ownership checks before reading or writing Firestore/Storage.

## 8. How would the application scale if many students upload near a deadline?

I would keep the frontend stateless and CDN-delivered, upload files directly to object storage, keep only small metadata documents in the database, and use serverless or horizontally scalable APIs for metadata operations. Non-critical tasks such as analytics, notifications and scanning can go through queues and background workers. Managed services remove a single file-upload server as the bottleneck.

## 9. How did you test the project?

I included unit tests for deadline logic and file validation, a 25-case manual test matrix covering authentication, RBAC, upload validation, deadlines, resubmission, grading, unauthorized access and failure scenarios, plus a GitHub Actions workflow. For production, I would add automated Firebase Security Rules tests using the Local Emulator Suite.

## 10. What would you improve next?

I would add email/push notifications, rubric-based grading, a dedicated immutable audit log, malware scanning, App Check, rate limiting, stronger backup/disaster recovery, analytics, a mobile client using the REST API and a staged CI/CD pipeline. I would also integrate the optional AI service only as teacher assistance with clear review controls.
