# Optional AI Extension

This module adds two optional capabilities from the project specification:

1. Sentence-BERT semantic similarity against a reference corpus.
2. TF-IDF + Ridge baseline grade suggestion trained from dummy `graded_samples.csv` data.

Run locally:

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
python train_grade_model.py
uvicorn app:app --reload --port 8001
```

The similarity endpoint accepts `{ "text": "...", "corpus": ["...", "..."] }` and returns the maximum semantic similarity score and matching reference index.

The grade endpoint accepts `{ "text": "..." }` and returns a baseline numerical suggestion. It is intentionally described as a suggestion, not a final grade.
