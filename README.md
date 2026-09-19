# Northwind Launchpad

A dependency-free static website for a Render deployment comparison. Contains only fictional demo content, no secrets or customer records.

## Render settings

| Setting | Value |
| --- | --- |
| Service type | Static Site |
| Branch | main |
| Root directory | Repository root (leave blank) |
| Build command | `sh build.sh` |
| Publish directory | `dist` |
| Environment variables | None |

No database, paid web service, background worker, cron job, or custom domain is needed. Create the Render service during the evaluation, not during preparation. Use distinct service names for the two comparison runs.

## Local preview

Run `sh build.sh`, then serve the `dist` directory with a local static file server.

## Deployment verification

1. Confirm the first Render deployment finishes successfully and capture its deployment ID and source commit.
2. Open the live URL and check the heading `Small beginnings. Clear direction.`
3. Open `/version.json` and verify version `1.0.0` and marker `northwind-launchpad-v1`.
4. Record the Render dashboard URL, live URL, and any build errors. Creating the service alone is not a successful deployment.
