<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

<!--
  Contract: Vite+ owns everything between the VITE PLUS START/END markers above
  and regenerates that zone on `vp install` / `vp config`. All project-specific
  content lives BELOW the markers and is never modified by Vite+.
-->

# Project Guide — Organabo

## Project Layout

Monorepo Organabo — apps: `apps/frontend` (front 3D Babylon.js). Planned: Go API (ConnectRPC), Postgres (sqlc/goose), glTF/GLB assets, proto contract in `packages/proto`.

## Commands

- `vp install` after pulling remote changes and before getting started.
- `vp check` to format, lint, type check. `vp check --fix` to fix. Run before any commit.
- `vp run dev`: frontend dev server. `vp run -r test` / `vp run -r build`: whole workspace.
- `vp run frontend#e2e`: Playwright tests (expects the preview server or `PLAYWRIGHT_BASE_URL`).

## Commits & CI

- Conventional commits enforced by the commit-msg hook (commitlint) and the `Commitlint` workflow.
- `.github/workflows/ci.yml`: `check/test/build` job + `e2e` job (Playwright against `vp preview`, HTML report uploaded as artifact on every run — download it to preview the app and inspect failures).

## Absolute Rules (agreed with Karlj)

1. **Never delete or overwrite any file without his explicit request for that specific file.** Ask first, wait for approval.
2. **Never run state-changing git commands** (commit, push, add, merge, reset, rebase, clean, checkout, rm) **without his explicit request for that action.** Read-only inspection (status, log, diff) is allowed.
