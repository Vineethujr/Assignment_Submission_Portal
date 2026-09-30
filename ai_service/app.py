"""Optional AI extension: plagiarism similarity + baseline grade suggestion.

This module is educational. Similarity scores and model suggestions must be
reviewed by a teacher and must not be treated as an automatic final grade.
"""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

MODEL_NAME = os.getenv("SBERT_MODEL", "all-MiniLM-L6-v2")
GRADE_MODEL_PATH = Path(os.getenv("GRADE_MODEL_PATH", "grade_model.pkl"))

app = FastAPI(title="Assignment AI Assistant", version="1.0.0")
_sbert = None
_grade_model = None


class SimilarityRequest(BaseModel):
    text: str = Field(min_length=1)
    corpus: list[str] = Field(default_factory=list)


class GradeRequest(BaseModel):
    text: str = Field(min_length=1)


def sbert():
    global _sbert
    if _sbert is None:
        from sentence_transformers import SentenceTransformer
        _sbert = SentenceTransformer(MODEL_NAME)
    return _sbert


def grade_model():
    global _grade_model
    if _grade_model is None and GRADE_MODEL_PATH.exists():
        import joblib
        _grade_model = joblib.load(GRADE_MODEL_PATH)
    return _grade_model


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME, "gradeModelLoaded": GRADE_MODEL_PATH.exists()}


@app.post("/similarity")
def similarity(payload: SimilarityRequest):
    if not payload.corpus:
        raise HTTPException(status_code=400, detail="corpus must contain at least one reference text")
    from sentence_transformers import util
    model = sbert()
    query = model.encode(payload.text, convert_to_tensor=True)
    corpus = model.encode(payload.corpus, convert_to_tensor=True)
    scores = util.cos_sim(query, corpus)[0]
    best_index = int(scores.argmax().item())
    return {"plagiarism_score": float(scores[best_index].item()), "reference_index": best_index}


@app.post("/grade")
def grade(payload: GradeRequest):
    model = grade_model()
    if model is None:
        raise HTTPException(status_code=503, detail="Grade model is not trained. Run train_grade_model.py first.")
    prediction = float(model.predict([payload.text])[0])
    return {"grade_suggestion": prediction, "warning": "Teacher review required."}
