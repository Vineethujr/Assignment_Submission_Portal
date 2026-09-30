# Failure Handling and Idempotency

| Failure | Graceful handling |
|---|---|
| File upload fails | Keep the selected file in the UI, show progress/error, retry upload without creating a submission record until upload succeeds |
| Database unavailable | Do not claim success; show retryable error and keep input state |
| Storage service fails | Do not write submission metadata; retry with bounded backoff |
| Auth token expires | Firebase Auth refreshes tokens; REST API returns 401 and UI can re-authenticate |
| Duplicate submit request | Generate a unique submission document ID and storage object ID; optional idempotency key should be added for production APIs |
| Internet drops during upload | Resumable upload task reports the error; allow retry rather than grading/marking partial upload as complete |
| Backend server fails | Stateless API can be restarted/replaced; source of truth remains managed database/object storage |

## Retry strategy

Use exponential backoff with jitter for transient 5xx/network failures. Do not retry deterministic validation errors such as unsupported file types or marks above the maximum.

## Idempotency

An idempotent submission endpoint should accept an idempotency key and store the mapping `key -> submissionId`. A repeated request with the same key returns the existing submission instead of creating a duplicate object/document.

The current browser MVP uses separate unique storage paths and Firestore documents, while the optional FastAPI service can be extended with an `Idempotency-Key` header for production-grade retry safety.
