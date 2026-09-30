# Cloud Computing Concepts Demonstrated

| Concept | Where it appears |
|---|---|
| Cloud Computing | Firebase-hosted web app, managed Firestore and Cloud Storage |
| SaaS | The portal is consumed as a web application by students/teachers |
| PaaS | Firebase Hosting and managed Firebase services remove server administration |
| IaaS | Optional AWS/Azure/GCP mapping; not required for the core demo |
| Cloud Database | Firestore collections for users, courses, assignments and submissions |
| Object Storage | Firebase Cloud Storage for PDF/DOCX/images |
| Authentication | Firebase Auth email/password sign-in |
| Authorization | Firestore/Storage Security Rules and role checks |
| RBAC | `student`, `teacher`, `admin` roles |
| REST API | Optional FastAPI service under `backend/` |
| Client-server architecture | React frontend communicates with managed cloud services and optional REST API |
| Serverless | Optional Cloud Functions v2 event processing |
| Scalability | Managed services + stateless frontend; optional serverless/Cloud Run backend |
| Elasticity | Serverless/managed infrastructure can scale without manually provisioning VMs |
| Availability | Hosted application and managed storage/database |
| Load balancing | Advanced architecture option using API Gateway/load-balanced backend |
| CDN | Firebase Hosting uses a global CDN |
| API Gateway | Advanced architecture option; front door for REST/serverless APIs |
| Environment variables | `frontend/.env`, `backend/.env` |
| Secrets management | Service-account JSON remains outside Git; production should use Secret Manager |
| Logging | Browser console + optional Cloud Functions logger + platform logs |
| Monitoring | Firebase/GCP usage and logging dashboards; can be extended with alerts |
| Backup | Firestore/Storage backup and export strategy should be enabled for production |
| CI/CD | GitHub Actions example in `.github/workflows/ci.yml` |
| Cloud deployment | Firebase Hosting; optional Functions and FastAPI/Cloud Run |

Firebase Hosting serves static web assets behind a global CDN and SSL, while Firebase Authentication supports email/password authentication. Cloud Storage is secured by Security Rules, and Firestore can use Authentication + Rules for serverless authorization. citeturn415101search4turn415101search0turn415101search7turn196755search3

Cloud Functions v2 is included as an optional paid-tier enhancement. Firebase currently lists Cloud Functions under the pay-as-you-go plan, so the core Firebase client application is deliberately usable without requiring Functions. citeturn415101search5
