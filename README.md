# CourseMatch Optimizer: self-hosted version

Contents
- `public/index.html`: the whole app, with clearing prices, the course list and the Spring 2027 Penn Course Review snapshot built in. It also works on any static host or opened from disk.
- `worker.js`: a Cloudflare Worker that serves `public/` and proxies Penn Course Review at `/api/pcr/<COURSE-ID>`. Browsers block a page on your own domain from reading penncoursereview.com directly, so the Worker fetches it server-side for the "Refresh from Penn Course Review" button.
- `wrangler.jsonc`: deployment config. Cloudflare Workers Builds runs `npx wrangler deploy` on every push to `main`.

Differences from the Claude-hosted version
- Plans are saved in each visitor's browser, not in an account. Use Settings → Back up / Restore to move a plan between devices.
- The goal finder uses keyword matching here, since asking Claude only works on the Claude-hosted page.

## Deploying on Cloudflare (Workers)
1. Workers & Pages → Create → Import a repository, and pick this repository.
2. Leave the build command empty and the deploy command as `npx wrangler deploy`.
3. Every push to `main` redeploys. Check that `https://<your-worker>.workers.dev/api/pcr/OIDD-6360` returns JSON.

To limit access to classmates, add a Cloudflare Zero Trust → Access application for the site's domain. Use a policy that allows emails ending in `@wharton.upenn.edu`, with one-time PIN login. The free plan covers up to 50 users.

## Loading your own plan
Open the site, go to Settings → Restore from backup, and choose your `my-plan.json`.

## Updating data
Replace `public/index.html` with a newly built copy and push.
