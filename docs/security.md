# Cloud Security

## Controls implemented

**Authentication:** Firebase Authentication handles student login/registration. Firebase Authentication supports email/password sign-in for web applications. citeturn415101search0

**Authorization / RBAC:** Firestore rules use the `users/{uid}.role` profile to distinguish student, teacher and admin operations. Frontend protected routes are a usability layer; Security Rules are the actual data boundary.

**File validation:** The browser checks extension/MIME type and size; Storage Rules enforce content type and 20 MB size server-side. Storage Rules are designed to control read/write access and validate file metadata. citeturn196755search1

**Database validation:** Firestore Rules validate ownership and prevent students from modifying grading fields.

**HTTPS:** Firebase Hosting provides SSL/HTTPS for hosted web assets. citeturn415101search4

**Secrets:** Firebase web config is supplied through environment variables; service account keys used by FastAPI/seed scripts must never be committed. Firebase's security checklist explicitly treats service-account private keys as sensitive. citeturn196755search6

**CORS:** The optional FastAPI API uses an explicit allowlist from `CORS_ORIGINS`.

**Signed URLs:** The optional REST backend can issue short-lived signed URLs after authorization.

**Auditability:** Submissions are separate Firestore documents with timestamp, version and grading fields. Production can add a dedicated audit collection for immutable events.

## Common mistakes to avoid

- Allowing anyone to write `role: teacher` during public registration.
- Using `allow read, write: if request.auth != null` for every collection.
- Making the Storage bucket public.
- Trusting browser timestamps for deadlines.
- Relying only on client-side validation.
- Committing `.env` or service-account keys.
- Using broad Firestore reads that conflict with query-safe rules.
- Returning permanent public file links when a short-lived signed URL is appropriate.
- Skipping Rules tests before deployment.

Firebase recommends starting production rules locked down, testing rules with the Local Emulator Suite, and adding rules as the schema is developed. citeturn196755search6turn196755search2

## Future security hardening

Add App Check, rate limiting at the API edge, malware scanning/AV quarantine, immutable audit logs, key rotation, retention policies, organization-managed identity, data-loss prevention and scheduled backups.
