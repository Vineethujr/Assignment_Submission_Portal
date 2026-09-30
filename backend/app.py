"""Optional FastAPI REST layer for the Cloud Assignment Portal.

The main frontend can work directly with Firebase Auth/Firestore/Storage.
This service demonstrates how the same system can expose a conventional REST
API for integrations, reporting tools, mobile clients, or a future backend.
"""
from __future__ import annotations

import os
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import firebase_admin
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth, credentials, firestore, storage
from pydantic import BaseModel, Field

load_dotenv()

PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
BUCKET_NAME = os.getenv("FIREBASE_STORAGE_BUCKET")
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "20"))
SIGNED_URL_MINUTES = int(os.getenv("SIGNED_URL_MINUTES", "10"))

if not firebase_admin._apps:
    service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    options: dict[str, Any] = {}
    if PROJECT_ID:
        options["projectId"] = PROJECT_ID
    if BUCKET_NAME:
        options["storageBucket"] = BUCKET_NAME
    if service_account_path:
        firebase_admin.initialize_app(credentials.Certificate(service_account_path), options)
    else:
        firebase_admin.initialize_app(options=options)

DB = firestore.client()
BUCKET = storage.bucket()

app = FastAPI(title="Cloud Assignment Portal REST API", version="1.0.0")
origins = [item.strip() for item in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if item.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".png", ".jpg", ".jpeg"}
ALLOWED_MIME = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
}


class AssignmentIn(BaseModel):
    courseId: str = Field(min_length=1)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=5000)
    deadline: datetime
    maxMarks: float = Field(gt=0)
    allowedFileTypes: list[str] = Field(default_factory=lambda: ["pdf", "docx", "png", "jpg", "jpeg"])
    maxFileSizeMB: int = Field(default=20, ge=1, le=20)


class GradeIn(BaseModel):
    marks: float = Field(ge=0)
    feedback: str = Field(default="", max_length=10000)


def current_user(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        decoded = auth.verify_id_token(token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc
    profile = DB.collection("users").document(decoded["uid"]).get()
    profile_data = profile.to_dict() if profile.exists else {}
    return {**decoded, **profile_data, "uid": decoded["uid"]}


def require_role(*roles: str):
    def dependency(user: dict[str, Any] = Depends(current_user)):
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient role permissions")
        return user
    return dependency


def assignment_or_404(assignment_id: str) -> tuple[dict[str, Any], str]:
    ref = DB.collection("assignments").document(assignment_id)
    snap = ref.get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return snap.to_dict() or {}, assignment_id


def can_teacher_access_course(user: dict[str, Any], course_id: str) -> bool:
    course = DB.collection("courses").document(course_id).get()
    return course.exists and course.to_dict().get("teacherId") == user["uid"]


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "cloud-assignment-portal-api"}


@app.get("/api/me")
def me(user=Depends(current_user)):
    return {"uid": user["uid"], "name": user.get("name"), "email": user.get("email"), "role": user.get("role", "student")}


@app.post("/api/assignments", status_code=201)
def create_assignment(payload: AssignmentIn, user=Depends(require_role("teacher", "admin"))):
    if not can_teacher_access_course(user, payload.courseId) and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Teacher does not own this course")
    ref = DB.collection("assignments").document()
    data = payload.model_dump()
    data["createdBy"] = user["uid"]
    data["createdAt"] = firestore.SERVER_TIMESTAMP
    ref.set(data)
    return {"id": ref.id, **data}


@app.get("/api/assignments")
def list_assignments(user=Depends(current_user)):
    docs = DB.collection("assignments").order_by("deadline").stream()
    rows = [{"id": d.id, **d.to_dict()} for d in docs]
    if user.get("role") == "teacher":
        rows = [r for r in rows if can_teacher_access_course(user, r.get("courseId", ""))]
    return rows


@app.get("/api/assignments/{assignment_id}")
def get_assignment(assignment_id: str, user=Depends(current_user)):
    data, _ = assignment_or_404(assignment_id)
    if user.get("role") == "teacher" and not can_teacher_access_course(user, data.get("courseId", "")):
        raise HTTPException(status_code=403, detail="Not your course")
    return {"id": assignment_id, **data}


@app.put("/api/assignments/{assignment_id}")
def update_assignment(assignment_id: str, payload: AssignmentIn, user=Depends(require_role("teacher", "admin"))):
    data, _ = assignment_or_404(assignment_id)
    if user.get("role") != "admin" and not can_teacher_access_course(user, data.get("courseId", "")):
        raise HTTPException(status_code=403, detail="Not your course")
    new = payload.model_dump()
    new["updatedAt"] = firestore.SERVER_TIMESTAMP
    DB.collection("assignments").document(assignment_id).update(new)
    return {"id": assignment_id, **payload.model_dump()}


@app.delete("/api/assignments/{assignment_id}", status_code=204)
def delete_assignment(assignment_id: str, user=Depends(require_role("teacher", "admin"))):
    data, _ = assignment_or_404(assignment_id)
    if user.get("role") != "admin" and not can_teacher_access_course(user, data.get("courseId", "")):
        raise HTTPException(status_code=403, detail="Not your course")
    DB.collection("assignments").document(assignment_id).delete()


@app.post("/api/assignments/{assignment_id}/submit", status_code=201)
async def submit_assignment(assignment_id: str, file: UploadFile = File(...), user=Depends(require_role("student"))):
    assignment, _ = assignment_or_404(assignment_id)
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_MIME:
        raise HTTPException(status_code=400, detail="Invalid file type")
    raw = await file.read()
    max_bytes = min(int(assignment.get("maxFileSizeMB", MAX_FILE_SIZE_MB)), MAX_FILE_SIZE_MB) * 1024 * 1024
    if len(raw) > max_bytes:
        raise HTTPException(status_code=413, detail="File exceeds configured size limit")

    previous = list(DB.collection("submissions").where("assignmentId", "==", assignment_id).where("studentId", "==", user["uid"]).stream())
    version = len(previous) + 1
    submission_ref = DB.collection("submissions").document()
    safe_name = re.sub(r"[^A-Za-z0-9._-]", "_", file.filename or "submission")
    path = f"assignments/{assignment_id}/{user['uid']}/{submission_ref.id}-{safe_name}"
    blob = BUCKET.blob(path)
    blob.upload_from_string(raw, content_type=file.content_type)

    submitted_at = datetime.now(timezone.utc)
    deadline = assignment.get("deadline")
    if hasattr(deadline, "replace") and getattr(deadline, "tzinfo", None) is None:
        deadline = deadline.replace(tzinfo=timezone.utc)
    late = bool(deadline and submitted_at > deadline)
    data = {
        "assignmentId": assignment_id,
        "courseId": assignment.get("courseId"),
        "studentId": user["uid"],
        "studentName": user.get("name") or user.get("email", "Student"),
        "fileName": file.filename,
        "storagePath": path,
        "submittedAt": submitted_at,
        "submissionStatus": "LATE" if late else "SUBMITTED",
        "marks": None,
        "feedback": "",
        "gradedAt": None,
        "version": version,
    }
    submission_ref.set(data)
    return {"id": submission_ref.id, **data}


@app.get("/api/submissions/me")
def my_submissions(user=Depends(require_role("student"))):
    docs = DB.collection("submissions").where("studentId", "==", user["uid"]).stream()
    return [{"id": d.id, **d.to_dict()} for d in docs]


@app.get("/api/assignments/{assignment_id}/submissions")
def assignment_submissions(assignment_id: str, user=Depends(require_role("teacher", "admin"))):
    assignment, _ = assignment_or_404(assignment_id)
    if user.get("role") != "admin" and not can_teacher_access_course(user, assignment.get("courseId", "")):
        raise HTTPException(status_code=403, detail="Not your course")
    docs = DB.collection("submissions").where("assignmentId", "==", assignment_id).stream()
    return [{"id": d.id, **d.to_dict()} for d in docs]


@app.get("/api/submissions/{submission_id}")
def get_submission(submission_id: str, user=Depends(current_user)):
    snap = DB.collection("submissions").document(submission_id).get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Submission not found")
    data = snap.to_dict() or {}
    if user.get("role") == "student" and data.get("studentId") != user["uid"]:
        raise HTTPException(status_code=403, detail="You may only access your own submission")
    if user.get("role") == "teacher" and not can_teacher_access_course(user, data.get("courseId", "")):
        raise HTTPException(status_code=403, detail="Not your course")
    return {"id": submission_id, **data}


@app.post("/api/submissions/{submission_id}/grade")
def grade_submission(submission_id: str, payload: GradeIn, user=Depends(require_role("teacher", "admin"))):
    snap = DB.collection("submissions").document(submission_id).get()
    if not snap.exists:
        raise HTTPException(status_code=404, detail="Submission not found")
    data = snap.to_dict() or {}
    assignment, _ = assignment_or_404(data["assignmentId"])
    if user.get("role") != "admin" and not can_teacher_access_course(user, assignment.get("courseId", "")):
        raise HTTPException(status_code=403, detail="Not your course")
    if payload.marks > float(assignment.get("maxMarks", 0)):
        raise HTTPException(status_code=400, detail="Marks cannot exceed maximum marks")
    update = {"marks": payload.marks, "feedback": payload.feedback.strip(), "submissionStatus": "GRADED", "gradedAt": firestore.SERVER_TIMESTAMP}
    DB.collection("submissions").document(submission_id).update(update)
    return {"id": submission_id, **update}


@app.get("/api/submissions/{submission_id}/feedback")
def get_feedback(submission_id: str, user=Depends(current_user)):
    record = get_submission(submission_id, user)
    return {"marks": record.get("marks"), "feedback": record.get("feedback", ""), "gradedAt": record.get("gradedAt")}


@app.get("/api/submissions/{submission_id}/download")
def download_submission(submission_id: str, user=Depends(current_user)):
    record = get_submission(submission_id, user)
    path = record.get("storagePath")
    if not path:
        raise HTTPException(status_code=404, detail="Storage object not found")
    blob = BUCKET.blob(path)
    if not blob.exists():
        raise HTTPException(status_code=404, detail="Stored file not found")
    try:
        url = blob.generate_signed_url(version="v4", expiration=timedelta(minutes=SIGNED_URL_MINUTES), method="GET")
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Signed URL generation requires a signing-capable service account") from exc
    return {"url": url, "expiresInMinutes": SIGNED_URL_MINUTES}
