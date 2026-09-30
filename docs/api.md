# REST API Design

The optional FastAPI service in `backend/app.py` exposes conventional REST endpoints. Each protected request uses a Firebase ID token as a Bearer token.

| Method | Endpoint | Auth | Authorization | Success | Common errors |
|---|---|---|---|---|---|
| GET | `/api/health` | No | Public health check | 200 | — |
| GET | `/api/me` | Yes | Any authenticated user | 200 | 401 |
| POST | `/api/assignments` | Yes | Teacher/Admin | 201 | 400, 401, 403 |
| GET | `/api/assignments` | Yes | Authenticated | 200 | 401 |
| GET | `/api/assignments/{id}` | Yes | Student / owning Teacher / Admin | 200 | 401, 403, 404 |
| PUT | `/api/assignments/{id}` | Yes | Owning Teacher/Admin | 200 | 400, 403, 404 |
| DELETE | `/api/assignments/{id}` | Yes | Owning Teacher/Admin | 204 | 403, 404 |
| POST | `/api/assignments/{id}/submit` | Yes | Student | 201 | 400, 401, 403, 413 |
| GET | `/api/submissions/me` | Yes | Student | 200 | 401, 403 |
| GET | `/api/assignments/{id}/submissions` | Yes | Owning Teacher/Admin | 200 | 401, 403, 404 |
| GET | `/api/submissions/{id}` | Yes | Owner Student / Teacher / Admin | 200 | 401, 403, 404 |
| POST | `/api/submissions/{id}/grade` | Yes | Owning Teacher/Admin | 200 | 400, 401, 403, 404 |
| GET | `/api/submissions/{id}/feedback` | Yes | Authorized user | 200 | 401, 403, 404 |
| GET | `/api/submissions/{id}/download` | Yes | Authorized user | 200 | 401, 403, 404, 500 |

## Example grade request

```http
POST /api/submissions/SUB123/grade
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json

{
  "marks": 86,
  "feedback": "Good architecture. Add stronger discussion of backup strategy."
}
```

The response changes the submission status to `GRADED`.

## File upload

The REST service accepts multipart form-data at `POST /api/assignments/{id}/submit`. It validates extension, MIME type and size before writing the object to Cloud Storage and then creates Firestore metadata.

The default React MVP instead uploads directly from the browser to Firebase Storage and writes metadata to Firestore. This reduces application-server bandwidth for large files and is a useful cloud architecture pattern.

## Authentication endpoints

The specification lists `POST /api/register`, `/api/login` and `/api/logout`. In this implementation those operations are intentionally delegated to Firebase Authentication rather than duplicating password handling in FastAPI. The React client uses the Firebase Auth SDK for registration, login and logout, and the REST API accepts the resulting Firebase ID token as a Bearer token. This keeps password handling inside the managed identity service.
