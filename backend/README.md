# Optional FastAPI REST API

This service is an optional backend path for the same project. The default React app can work directly with Firebase Auth, Firestore, and Storage, which keeps the student demo simple. The FastAPI service adds conventional REST endpoints and is useful for integrations, automation, or a later mobile client.

## Run locally

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app:app --reload --port 8000
```

You need Firebase Admin credentials for the REST service. Do not commit the service-account JSON file.

## API authentication

Get the Firebase ID token in the browser with `await auth.currentUser.getIdToken()` and send:

```text
Authorization: Bearer <ID_TOKEN>
```

The service verifies the token with Firebase Admin SDK and then checks the role in `users/{uid}`.
