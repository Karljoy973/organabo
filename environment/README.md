# Organabo environment

Docker Compose environment for the Organabo stack. The frontend is built inside
Docker from the pnpm workspace at the repo root (build context `..`), so no local
Node.js toolchain is required.

## Services

| Service    | Description                                                                  | URL / port                                     |
| ---------- | ---------------------------------------------------------------------------- | ---------------------------------------------- |
| `frontend` | SPA (Babylon.js) built with Vite+, served statically by nginx                | http://localhost:5173                          |
| `db`       | PostgreSQL 18 (alpine), data persisted in the named volume `pgdata`          | localhost:5432                                 |
| `api`      | Go ConnectRPC API (Postgres backend) — **disabled by default**, see below    | localhost:8080                                 |
| `storage`  | SeaweedFS 4.33 (`weed mini`) — S3-compatible object store for glTF/GLB blobs | localhost:8333 (S3), localhost:9333 (admin UI) |

All images used (`nginx:alpine`, `postgres:18-alpine`,
`ghcr.io/voidzero-dev/vite-plus`, `chrislusf/seaweedfs`) are multi-arch
(`linux/amd64` and `linux/arm64` everywhere; SeaweedFS also ships
`linux/arm/v7`), so the same compose file deploys from a Raspberry Pi to a kube
cluster.

## Configuration

Variables are read from a `.env` file next to `compose.yml` (all optional, see
`.env.example` for defaults):

| Variable             | Default            | Used by                                        |
| -------------------- | ------------------ | ---------------------------------------------- |
| `POSTGRES_USER`      | `organabo`         | `db`, `api`                                    |
| `POSTGRES_PASSWORD`  | `organabo`         | `db`, `api`                                    |
| `POSTGRES_DB`        | `organabo`         | `db`, `api`                                    |
| `POSTGRES_PORT`      | `5432`             | host port for `db`                             |
| `FRONTEND_PORT`      | `5173`             | host port for `frontend`                       |
| `API_PORT`           | `8080`             | host port for `api`                            |
| `SEAWEED_ACCESS_KEY` | `organabo`         | `storage` (S3 access key)                      |
| `SEAWEED_SECRET_KEY` | `organabo`         | `storage` (S3 secret key)                      |
| `SEAWEED_BUCKETS`    | `models,artifacts` | `storage` (buckets pre-created at first start) |
| `SEAWEED_S3_PORT`    | `8333`             | host port for `storage` (S3 API)               |
| `SEAWEED_ADMIN_PORT` | `9333`             | host port for `storage` (admin UI)             |

To customize: `cp .env.example .env` and edit `.env` (`.env` is git-ignored).

## Common commands

Run from this directory, or from the repo root with `-f environment/compose.yml`:

```sh
# Build and start the default stack (frontend + db)
docker compose up -d --build

# Stop and remove containers (add -v to also drop the pgdata volume)
docker compose down

# Follow logs of all services (or one: docker compose logs -f frontend)
docker compose logs -f

# Open a psql session in the database
docker compose exec db psql -U organabo
# or, with POSTGRES_USER set in .env:
docker compose exec db psql -U ${POSTGRES_USER}
```

The frontend is then available at http://localhost:5173.

## Storage service (SeaweedFS)

`storage` runs [SeaweedFS](https://github.com/seaweedfs/seaweedfs) 4.33 in
single-node `weed mini` mode: master + volume server + filer + S3 gateway +
WebDAV + admin UI in one process. It is the S3 backend planned for the `models`
and `artifacts` buckets (glTF/GLB blobs).

- S3 endpoint: `http://localhost:8333` (from other containers:
  `http://storage:8333`)
- Admin UI: `http://localhost:9333`
- Credentials: `SEAWEED_ACCESS_KEY` / `SEAWEED_SECRET_KEY` (defaults are for
  local development only, see security note below)
- Buckets `models` and `artifacts` are created on first start (comma-separated
  list in `SEAWEED_BUCKETS`); data persists in the named volume `weeddata`

Quick check with the AWS CLI:

```sh
aws --endpoint-url http://localhost:8333 s3 ls
```

When `apps/api` lands, the Go BlobStore should talk to `http://storage:8333`
with path-style addressing (e.g. via the AWS SDK for Go v2 configured with a
custom endpoint and static credentials).

## API service (profile)

The `api` service is fully wired in `compose.yml` but **disabled by default**:
it is only started when the `api` Compose profile is explicitly enabled. The
planned Go API (ConnectRPC, port 8080, Postgres via sqlc/goose/pgx) will live in
`apps/api`, which does not exist yet.

To enable it once `apps/api` exists, create `apps/api/Dockerfile`, then:

```sh
docker compose --profile api up -d --build
```

The `api` service waits for `db` to pass its healthcheck
(`depends_on: condition: service_healthy`) and connects via `DATABASE_URL`.

> **Warning**: running `docker compose --profile api up -d --build` **before**
> `apps/api/Dockerfile` exists will fail the build — the service points at a
> Dockerfile that is not there yet. That is expected: keep the profile off until
> the API lands.

## Security note

The default credentials (`organabo` / `organabo`) are for **local development
only**. For anything exposed beyond your machine, copy `.env.example` to `.env`
and change at least `POSTGRES_PASSWORD` (and preferably `POSTGRES_USER` and
`POSTGRES_DB`).
