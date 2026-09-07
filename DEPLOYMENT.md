# Deployment status and configuration

Frontend: Vercel project `function-platform`, source directory `bilmman`.
Backend: Render configuration in `render.yaml`, source directory `function_backend`.
Deployment branch: `main`.

Render project `Finaris` and free database `finaris-db` have been created. The database expires October 7, 2026. Backend deployment still requires connecting Render to the private GitHub repository. The deployed frontend is https://function-platform.vercel.app.

## Finish connecting the services

1. Sign in to Render and import the private repository `JavohirIkromov2009/Finaris` as a Blueprint, selecting the deployment branch.
2. Set `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` to the exact Vercel production origin, with no trailing slash.
3. After Render reports the backend healthy, set Vercel's production `REACT_APP_API_URL` to the actual Render origin plus `/api`, then redeploy the frontend. The initial frontend deploy uses `/api`; API features are unavailable until this is connected.
4. Verify `/api/subjects/`, registration/login, test submissions, and feedback from the deployed frontend.

## Storage requirements

The Blueprint uses free Render web service and PostgreSQL plans. Render's free PostgreSQL database expires after 30 days; it needs an upgrade or replacement for continued use.

Uploaded profile images and payment receipts still use Django's local filesystem. Render's free web-service filesystem is ephemeral and the current production URL configuration does not serve uploaded media. Before enabling these features in production, connect durable object storage (or a paid persistent disk plus appropriate authenticated media serving). Do not upload real receipts to this incomplete deployment.

Local `.env`, SQLite databases, and uploaded files are excluded from deployment. Existing local users, payment configuration, and uploads have not been migrated. Set payment configuration privately in Render if manual payments are needed.

## Verification

- React production build passed with existing lint warnings.
- Django system check and static collection passed.
- The outdated feedback and client-score tests now follow the current API contract: multipart feedback requires an image; unverified scores are rejected without recording an attempt.
- Vercel could not connect the private GitHub repository automatically; the deployment uses the CLI. Future Git pushes will not automatically deploy the frontend until the integration is connected.
