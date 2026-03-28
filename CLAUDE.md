# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

App Template is a Wippy framework boilerplate providing MCP server scaffold, WebSocket support, and Temporal workflows.
Use it as a starting point for new services.

Load skill `wippy`

## Module Architecture

| Module         | Namespace         | What it owns                                              |
|----------------|-------------------|-----------------------------------------------------------|
| **Core**       | `app:`            | State store, Temporal, processes, HTTP gateway            |
| **HTTP**       | `app.http:`       | HTTP routers (public, API, WebSocket)                     |
| **Deps**       | `app.deps:`       | Framework dependencies (bootloader, security)             |
| **Env**        | `app.env:`        | Environment variables, public env endpoint                |
| **Security**   | `app.security:`   | Store access policy                                       |
| **MCP**        | `app.mcp:`        | MCP server scaffold (session store, ready for tools)      |
| **WS**         | `app.ws:`         | WebSocket hub, relay endpoint, broadcast                  |

## Shared Infrastructure

| Resource              | Kind              | Purpose                         |
|-----------------------|-------------------|---------------------------------|
| `app:db`              | `db.sql.postgres` | PostgreSQL (10 conn pool)       |
| `app:state_store`     | `store.memory`    | Runtime state (1000 items, 10m) |
| `app:temporal_client` | `temporal.client`  | Temporal server connection      |
| `app:temporal_worker` | `temporal.worker`  | Task queue `app-tasks`          |
| `app:processes`       | `process.host`    | 4-worker process executor       |
| `app:gateway`         | `http.service`    | HTTP server on :8080            |

## HTTP Routers

| Router       | Prefix        | Middleware         | Purpose           |
|--------------|---------------|--------------------|-------------------|
| `root`       | `/`           | ---                | Health check      |
| `api_public` | `/api/public` | cors, ratelimit    | Public endpoints  |
| `api`        | `/api/v1/app` | cors, ratelimit    | API               |
| `api_router` | `/api/v1`     | cors, ratelimit    | API               |
| `api_mcp`    | `/mcp`        | cors, ratelimit, sse | MCP SSE transport |
| `ws`         | `/ws`         | cors, ws_relay     | WebSocket         |

## Lua SQL Query Builder — Critical Rules

**These rules are mandatory. Violating them causes runtime errors.**

### INSERT queries

```lua
-- CORRECT: use set_map for INSERT
sql.builder.insert("table_name")
    :set_map({ col1 = val1, col2 = val2 })
    :run_with(db)
    :exec()

-- CORRECT: use columns/values for INSERT
sql.builder.insert("table_name")
    :columns("col1", "col2")
    :values(val1, val2)
    :run_with(db)
    :exec()

-- CORRECT: ON CONFLICT via suffix
sql.builder.insert("table_name")
    :set_map({ id = val })
    :suffix("ON CONFLICT (id) DO NOTHING")
    :run_with(db)
    :exec()

-- WRONG: :set() does NOT work on INSERT builder
sql.builder.insert("table_name")
    :set("col1", val1)  -- ERROR: "attempt to call a non-function object"

-- WRONG: sql.builder.expr() does NOT work inside :values()
:values(val1, sql.builder.expr("NOW()"))  -- NULL inserted instead of expression
```

### UPDATE queries

```lua
-- CORRECT: :set() works on UPDATE builder
sql.builder.update("table_name")
    :set("status", "active")
    :set("updated_at", sql.builder.expr("NOW()"))
    :where(sql.builder.eq({ id = some_id }))
    :run_with(db)
    :exec()
```

### SELECT queries

```lua
-- CORRECT: pass string column names
sql.builder.select("id", "name", "email")
    :from("users")
    :where(sql.builder.eq({ status = "active" }))
    :run_with(db)
    :query()

-- WRONG: sql.builder.expr() does NOT work in select()
sql.builder.select(sql.builder.expr("COUNT(*) AS cnt"))  -- ERROR
```

### Raw SQL (for expressions, complex queries)

```lua
-- PostgreSQL uses $1, $2 placeholders; params as a table
local rows, err = db:query(
    "SELECT expires_at < NOW() AS expired FROM invitations WHERE id = $1 LIMIT 1",
    { some_id }
)

local _, err = db:execute(
    "INSERT INTO invitations (id, expires_at) VALUES ($1, NOW() + INTERVAL '7 days')",
    { some_id }
)
```

### HTTP Response — No Chaining

```lua
-- WRONG: chaining set_status + write_json does NOT work
return res:set_status(400):write_json({ error = "bad" })  -- ERROR

-- CORRECT: separate calls
res:set_status(400)
return res:write_json({ error = "bad" })
```

## Frontend (Nuxt 4 SSR)

Stack: **Nuxt ^4.0.0**, Vue 3, PrimeVue 4 (explicit imports), Tailwind CSS 3, Pinia.

### Critical Nuxt 4 Rules

**PrimeVue: always import explicitly** — no `@primevue/nuxt-module`. Import components per-file:
`import Button from 'primevue/button'`. Plugin in `app/plugins/primevue.ts`.

**Use `<ClientOnly>` for dynamic UI** — wrap dynamic content in `<ClientOnly>`
with a `#fallback` skeleton to avoid hydration mismatches.

### Frontend Proxy

The Nuxt server proxy (`frontend/server/middleware/proxy.ts`) forwards API requests to the backend.
**When adding a new backend router, add its prefix to PROXY_PATHS:**

```typescript
const PROXY_PATHS = ['/api/', '/mcp/']
```

## Adding MCP Tools

1. Create tool function in `src/mcp/your_tool.lua`
2. Add `function.lua` + `mcp.tool` entries in `src/mcp/_index.yaml`
3. Tool is automatically registered with the MCP server

## Adding a New HTTP Module

1. Create source directory: `src/mymodule/`
2. Create `_index.yaml` with namespace, entries (functions, endpoints)
3. Create handler `.lua` files
4. **If module has its own router**, add prefix to frontend proxy PROXY_PATHS
5. **All `require()` modules must be listed in YAML `modules:`** for every function entry

## PostgreSQL Migrations

```lua
-- Use DROP + CREATE (not CREATE OR REPLACE) when changing view columns
db:execute("DROP VIEW IF EXISTS my_view")
db:execute("CREATE VIEW my_view AS SELECT ...")
```

## Configuration

Environment variables in `.env`:

| Variable                          | Purpose               |
|-----------------------------------|-----------------------|
| `DB_HOST/PORT/NAME/USER/PASSWORD` | PostgreSQL connection |
| `APP_BASE_URL`                    | Public app URL        |

## Local Development (Docker)

Use the dev compose overlay — it adds Traefik, mounts sources for live reload, and runs the frontend dev server with hot
reload.

```bash
make up        # start dev stack (docker-compose.dev.yml)
make down      # stop
make build     # rebuild & start
make logs      # tail all logs
```

### Dev URLs (via Traefik)

| URL                             | Service           |
|---------------------------------|-------------------|
| `http://app.localhost`          | Frontend          |
| `http://api.app.localhost`      | Backend API       |
| `http://temporal.app.localhost` | Temporal UI       |
| `http://adminer.app.localhost`  | Adminer (DB)      |
| `http://localhost:8888`         | Traefik dashboard |

### Useful commands

| Command            | What it does                          |
|--------------------|---------------------------------------|
| `make app-logs`    | Tail backend logs                     |
| `make app-bash`    | Shell into the app container          |
| `make app-restart` | Restart the backend                   |
| `make fe-logs`     | Tail frontend logs                    |
| `make fe-run`      | Run frontend locally (outside Docker) |
| `make db-shell`    | `psql` into PostgreSQL                |
| `make run`         | Run Wippy locally (outside Docker)    |

### Docker file structure

| File                          | Purpose                                                       |
|-------------------------------|---------------------------------------------------------------|
| `docker-compose.yml`          | Production stack (app, frontend, postgres, temporal, adminer) |
| `docker-compose.dev.yml`      | Dev overlay (traefik, source mounts, hot reload)              |
| `.docker/Dockerfile`          | App image (Wippy CLI + source)                                |
| `.docker/.wippy.yaml`         | Docker runtime config (Temporal address, DB refs)             |
| `.docker/db.yaml`             | PostgreSQL pool config for Docker                             |
| `frontend/.docker/Dockerfile` | Multi-stage Nuxt 4 SSR build                                  |
