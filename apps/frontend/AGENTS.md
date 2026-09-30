# frontend — Agent Guide

Vite+ app (Babylon.js). Playwright e2e tests in `e2e/`.

## Commands

- `vp run frontend#dev`: dev server.
- `vp run frontend#build`: production build (`tsc` then `vp build`).
- `vp run frontend#preview`: serves the build (`dist/`) on port 4173.
- `vp run frontend#e2e`: Playwright tests. Expects `PLAYWRIGHT_BASE_URL` (default `http://localhost:4173`): build + preview first, or run against `vp dev` with `PLAYWRIGHT_BASE_URL=http://localhost:5173`.

## Playwright

- Config: `playwright.config.ts` — Chromium only, trace/screenshot/video on failure, HTML report in `playwright-report/`.
- In CI, the `e2e` job of `ci.yml` builds, installs Chromium, starts `vp preview`, runs the tests and uploads the HTML report as an artifact on every run — download it to preview the app and inspect any abnormal state.
- Local artifacts `playwright-report/`, `test-results/`, `preview.log` are git-ignored.
