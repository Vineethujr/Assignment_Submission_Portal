# Technology Stack Options

## Option A — Beginner local MVP

**Frontend:** HTML/CSS/JavaScript

**Backend:** Flask

**Database:** SQLite

**Storage:** local `uploads/`

**Difficulty:** Low

**Cost:** Free

**Cloud concepts:** Client/server, database, file storage, REST; cloud behavior must be simulated or added later.

**Advantage:** Fastest way to understand the business workflow.

**Limitation:** Does not demonstrate managed cloud services strongly.

## Option B — Recommended student cloud version

**Frontend:** React + Vite

**Authentication:** Firebase Authentication

**Database:** Cloud Firestore

**Storage:** Firebase Cloud Storage

**Hosting:** Firebase Hosting

**Optional server-side:** Firebase Cloud Functions or FastAPI/Cloud Run

**Difficulty:** Medium

**Cost:** Core can be designed around no-cost Firebase usage; Cloud Functions is currently a pay-as-you-go feature rather than Spark/no-cost. citeturn415101search5

**Cloud concepts:** Strong coverage of managed authentication, database, object storage, hosting, CDN, serverless-ready design, Security Rules and environment-based configuration.

**Advantage:** Best balance for a student placement project.

**Limitation:** Deep backend REST control is optional rather than mandatory in the core path.

## Option C — Advanced cloud architecture

**Frontend:** React / Next.js

**Backend:** FastAPI

**Cloud:** AWS/Azure/GCP with API Gateway, serverless/container compute, managed database, object storage and monitoring.

**Difficulty:** High

**Cost:** May require billing depending on selected services.

**Cloud concepts:** Full control over API gateway, autoscaling, containers, queues, CDN, observability and IAM.

**Advantage:** Strong systems/cloud depth.

**Limitation:** More services, configuration and operational overhead.

### Recommended

Use **Option B** as the main project, keep the core portal deployable with Firebase's managed client services, and demonstrate the optional FastAPI + serverless architecture as an advanced extension. This follows the source specification's recommendation while preserving a practical no-paid-infrastructure path.
