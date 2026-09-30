# syntax=docker/dockerfile:1

# --- build stage: official Vite+ toolchain image (vp CLI preinstalled) ---
FROM ghcr.io/voidzero-dev/vite-plus:1.0.0 AS build
WORKDIR /app

# Manifests of every lockfile importer first, so the dependency layer is cached.
# .node-version* glob: file is optional (Node pinned via engines.node >=22.18.0).
COPY --chown=vp:vp package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version* ./
COPY --chown=vp:vp apps/frontend/package.json apps/frontend/
COPY --chown=vp:vp packages/utils/package.json packages/utils/
RUN vp install --frozen-lockfile

# Sources, then build. vp provisions the exact Node.js from engines.node.
COPY --chown=vp:vp . .
RUN vp run frontend#build

# --- runtime stage: static SPA served by nginx ---
FROM nginx:alpine AS runtime
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
