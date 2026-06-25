Upgrade plan: Vite 8
====================

Goal: safely upgrade the workspace from Vite 7 → Vite 8 and resolve incompatible dev-dependencies.

High-level approach
- Create a feature branch `upgrade/vite-8`.
- Update `package.json` to set `vite` to `^8` and upgrade plugins that declare Vite peer deps.
- Run `npm install` in CI or locally using `npm ci` and fix conflicts iteratively.
- Run the app, tests and lint; fix runtime or build regressions.
- Open a PR and request reviewers; run the protected `production` environment migration only after approval.

Steps (local)
1. Create branch:

   ```bash
   git checkout -b upgrade/vite-8
   ```

2. Update `package.json`:
   - set `vite` to `^8`
   - bump `@vitejs/plugin-react-swc` to a version that supports Vite 8 (e.g. ^5 if available)
   - identify and update/remove any packages that require Vite <8 (example: `lovable-tagger`).

3. Try install and resolve peer deps:

   ```bash
   npm install
   # if ERESOLVE appears, inspect the conflict and either upgrade the package or replace it
   ```

4. If a package has no Vite-8 compatible release, options:
   - replace the package with an alternative
   - open an issue/PR against that package
   - vendor or fork minimal code into the repo (last resort)

5. Run the dev server and tests:

   ```bash
   npm run dev
   npm run test
   npm run build
   ```

6. Smoke test the app and verify critical flows (orders, admin pages, membership flows).

7. Commit changes and open a PR with a clear summary of breaking changes and migration steps.

CI guidance
- Run the same `npm ci` in the `upgrade/vite-8` branch on CI and make sure the test matrix passes.
- Prefer to run dependency updates in a separate commit so CI diffs are easier to review.

Rollout
- Merge to `main` only after reviewers sign off.
- If `auto_migrate.yml` is configured to run on `main`, ensure `SUPABASE_DB_URL` secret and `production` approvals are set before merging migrations.

Notes / Known blockers
- `lovable-tagger` currently requires Vite <8 — you may need to remove or update it.
- Some Radix/other UI libs may have peer constraints; prefer updating plugin packages (`@vitejs/plugin-react-swc`) first.

If you want, I can attempt an automated branch that updates `package.json`, runs `npm install` and pushes the branch for review — confirm and I'll proceed.
