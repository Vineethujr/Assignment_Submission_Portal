# CI/CD

The included GitHub Actions workflow runs on pushes and pull requests to `main`.

- Frontend: install dependencies, run Vitest tests, build Vite production bundle.
- Functions: install dependencies and run unit tests.
- Python: compile backend and AI-service source to catch syntax errors.

For a production pipeline, add:

1. Firebase Rules unit tests against emulators.
2. Dependency vulnerability scanning.
3. Build artifact retention.
4. Staging Firebase project deployment on merge.
5. Manual approval before production deployment.
6. Secret manager integration rather than repository secrets for long-lived cloud credentials where supported.
