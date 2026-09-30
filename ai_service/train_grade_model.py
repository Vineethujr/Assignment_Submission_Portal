"""Train a simple TF-IDF + Ridge baseline from teacher-graded samples.

Expected CSV columns: text,score
The included sample dataset is dummy data for project demonstration only.
"""
from pathlib import Path
import argparse
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline

parser = argparse.ArgumentParser()
parser.add_argument('--input', default='graded_samples.csv')
parser.add_argument('--output', default='grade_model.pkl')
args = parser.parse_args()

df = pd.read_csv(args.input)
required = {'text', 'score'}
if not required.issubset(df.columns):
    raise SystemExit(f'CSV must contain columns: {sorted(required)}')

pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=20000, ngram_range=(1, 2))),
    ('reg', Ridge(alpha=1.0)),
])
pipeline.fit(df['text'].fillna(''), df['score'])
joblib.dump(pipeline, args.output)
print(f'Saved model to {Path(args.output).resolve()}')
