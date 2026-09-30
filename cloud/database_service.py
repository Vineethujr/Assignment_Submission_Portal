"""Reusable Firestore service wrapper for the Python backend/integrations."""
from __future__ import annotations

from typing import Any

from firebase_admin import firestore


def get_db():
    return firestore.client()


def get_document(collection: str, document_id: str) -> dict[str, Any] | None:
    snap = get_db().collection(collection).document(document_id).get()
    return {"id": snap.id, **(snap.to_dict() or {})} if snap.exists else None


def create_document(collection: str, data: dict[str, Any], document_id: str | None = None) -> str:
    db = get_db()
    ref = db.collection(collection).document(document_id) if document_id else db.collection(collection).document()
    ref.set(data)
    return ref.id


def update_document(collection: str, document_id: str, data: dict[str, Any]) -> None:
    get_db().collection(collection).document(document_id).update(data)
