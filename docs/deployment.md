# Deployment Guide

## Approach A — Free-tier / student-friendly Firebase core

The core app uses Firebase Authentication, Cloud Firestore, Cloud Storage and Firebase Hosting. Firebase currently describes the Spark plan as a no-cost plan and lists Authentication/Firestore/Storage/Hosting capabilities; Cloud Functions is not included in the no-cost plan. citeturn415101search5

### One-time setup

```bash
npm install
npm --prefix frontend install
npm --prefix functions install
npm install -g firebase-tools
firebase login
firebase use --add
```

Create a Firebase project and a Web App. Enable:

- Authentication → Email/Password
- Firestore Database
- Cloud Storage
- Hosting

Copy the web configuration into `frontend/.env` using the same variable names as `frontend/.env.example`.

### Deploy core services

```bash
npm run build
firebase deploy --only firestore:rules,firestore:indexes,storage,hosting
```

Firebase Hosting can be deployed with the Firebase CLI and provides `web.app` / `firebaseapp.com` hosting plus HTTPS and CDN delivery. citeturn415101search4

### Create a teacher

The registration page intentionally creates students only. This prevents a public sign-up from self-assigning the teacher role. For a demo project, create a teacher through an administrator workflow or run `npm run seed` with a service account that is kept outside Git.

## Approach B — Advanced cloud architecture

### AWS mapping

| Portal component | AWS equivalent |
|---|---|
| Frontend | S3 + CloudFront |
| API | API Gateway |
| Backend | Lambda / App Runner / EC2 |
| Database | DynamoDB / RDS |
| Files | S3 |
| Authentication | Cognito |
| Logs | CloudWatch |

### Azure mapping

| Portal component | Azure equivalent |
|---|---|
| Frontend | Static Web Apps / Blob Storage |
| API | API Management + Functions / Container Apps |
| Database | Cosmos DB / Azure Database for PostgreSQL |
| Files | Blob Storage |
| Authentication | Microsoft Entra External ID |
| Monitoring | Azure Monitor / Application Insights |

### GCP mapping

| Portal component | GCP equivalent |
|---|---|
| Frontend | Cloud Storage + Cloud CDN or Firebase Hosting |
| API | API Gateway |
| Backend | Cloud Run / Cloud Functions |
| Database | Firestore / Cloud SQL |
| Files | Cloud Storage |
| Authentication | Firebase Authentication / Identity Platform |
| Logs | Cloud Logging |

The optional `backend/` service includes a Dockerfile suitable for a managed container platform such as Cloud Run. This path may require billing depending on the chosen service/plan; it is therefore not required for the no-cost core demonstration.
