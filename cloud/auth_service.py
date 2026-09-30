"""Reusable Firebase Authentication helper functions for trusted Python code."""
from __future__ import annotations

from typing import Any

from firebase_admin import auth


def verify_id_token(id_token: str) -> dict[str, Any]:
    return auth.verify_id_token(id_token)


def create_user(email: str, password: str, display_name: str, role: str = "student") -> auth.UserRecord:
    user = auth.create_user(email=email, password=password, display_name=display_name)
    auth.set_custom_user_claims(user.uid, {"role": role})
    return user
