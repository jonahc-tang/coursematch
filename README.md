# CourseMatch Optimizer: self-hosted version

Contents
- `index.html`: the whole app, with clearing prices, the course list and the Spring 2027 Penn Course Review snapshot built in. It works on any static host and opens straight from your disk.
- `functions/api/pcr/[code].js`: a small proxy for the "Refresh from Penn Course Review" button. Browsers block a page on your own domain from reading penncoursereview.com directly, so this function fetches the data server-side. It only runs on Cloudflare Pages.

Differences from the Claude-hosted version
- Plans are saved in each visitor's browser, not in an account. Use Settings → Back up / Restore to move a plan between devices.
- Without the proxy, the refresh button tells visitors to paste data from a course's detail panel. The built-in snapshot still works.

## Option A: Cloudflare Pages (free, includes live refresh)
1. Create a GitHub repository and upload this folder's contents, keeping the `functions/` folder structure.
2. In the Cloudflare dashboard, go to Workers & Pages → Create → Pages → Connect to Git, and pick the repository.
3. Build settings: framework preset None, leave the build command empty, and set the output directory to `/`.
4. Deploy. The site goes live at `https://<project>.pages.dev`, and `/api/pcr/OIDD-6360` should return JSON.

To limit access to classmates, add a Cloudflare Zero Trust → Access application for that domain. Use a policy that allows emails ending in `@wharton.upenn.edu`, and choose one-time PIN login. The free plan covers up to 50 users.

## Option B: quickest, without live refresh
Drag this folder onto https://app.netlify.com/drop, or push it to a GitHub repository with GitHub Pages turned on. The `functions/` folder is ignored there, and everything else works.

## Loading your own plan
Open the site, go to Settings → Restore from backup, and choose `my-plan.json`. Your shortlist is not built into `index.html`, so it stays private.

## Updating data
When new clearing prices or a new course list come out, ask Claude to rebuild `index.html` from the updated workbook, then replace the file in the repository.
