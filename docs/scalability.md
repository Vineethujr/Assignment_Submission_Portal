# Scalability and Elasticity

| Scale | Practical architecture |
|---|---|
| 10 students | Firebase Hosting + Auth + Firestore + Storage; no separate backend required |
| 1,000 students | Same managed core, add compound indexes, optimized queries, monitoring, App Check and optional REST/Functions layer |
| 100,000 students | CDN-hosted frontend, API Gateway, stateless autoscaling backend/serverless functions, managed database with carefully designed indexes, object storage, caching, queues and background workers |

## 100,000 submissions near a deadline

1. Frontend assets come from a CDN, reducing origin load.
2. Students authenticate without a single custom auth server.
3. Files are uploaded directly to object storage where possible, so large binaries do not have to pass through one application server.
4. Firestore stores small metadata documents rather than file binaries.
5. Serverless/event-driven workers process non-critical tasks such as versioning, analytics, notifications and malware scanning asynchronously.
6. A queue absorbs burst traffic and smooths downstream load.
7. Stateless APIs can scale horizontally behind an API gateway/load balancer.
8. Hot dashboard results can be cached or pre-aggregated.
9. Monitoring and alerting help detect quota exhaustion, error spikes and latency changes.

Cloud Functions 2nd gen is built on Cloud Run/Eventarc and supports modern event triggers, but Firebase currently lists Cloud Functions outside the Spark no-cost plan; therefore the high-scale serverless layer is an optional advanced deployment rather than a dependency of the free-tier core. citeturn501699search1turn415101search5
