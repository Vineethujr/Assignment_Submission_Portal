"""Reusable Google Cloud Storage helper for uploaded assignment objects."""
from __future__ import annotations

from datetime import timedelta

from firebase_admin import storage


def bucket():
    return storage.bucket()


def upload_bytes(path: str, content: bytes, content_type: str) -> None:
    blob = bucket().blob(path)
    blob.upload_from_string(content, content_type=content_type)


def delete_object(path: str) -> None:
    bucket().blob(path).delete()


def signed_download_url(path: str, minutes: int = 10) -> str:
    return bucket().blob(path).generate_signed_url(version="v4", expiration=timedelta(minutes=minutes), method="GET")
