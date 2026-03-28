Wippy is a single-binary application runtime built on the actor model. It runs Lua code in isolated processes with
message passing — no shared memory, no locks. Three compute models exist: functions (stateless, request-scoped),
processes (long-lived actors with state), and workflows (durable actors backed by Temporal that survive crashes). The
system is designed so that agents can generate code, register it, and improve applications without redeployment.

Mental Model
Everything in Wippy is a registry entry. Entries have an ID (namespace:name), a kind (which determines behavior),
metadata, and data. YAML files are one way to declare entries, but the registry is the runtime source of truth and
entries can be created, updated, or deleted while the system is running.

# Important Rules

1. Use named logger
2. Use query builder for SQL if possible (https://wippy.ai/llm/path/en/lua/storage/sql)
3. Do not forget docs, to get to know the system better

### Entry Kinds

| Kind                  | Purpose                                  |
|-----------------------|------------------------------------------|
| `function.lua`        | Stateless Lua function entry point       |
| `process.lua`         | Long-running Lua process (actor)         |
| `process.service`     | Supervised process with restart policy   |
| `process.host`        | Process execution environment            |
| `library.lua`         | Shared Lua library (use with `imports`)  |
| `http.service`        | HTTP server (binds port)                 |
| `http.router`         | Route prefix grouping with middleware    |
| `http.endpoint`       | HTTP endpoint (method + path)            |
| `queue.driver.memory` | In-memory queue driver                   |
| `queue.queue`         | Queue declaration                        |
| `queue.consumer`      | Message handler with concurrency control |
| `store.memory`        | In-memory key-value store                |
| `db.sql.sqlite`       | SQLite database connection               |
| `security.policy`     | Access control policy                    |
| `env.variable`        | Environment variable binding             |
| `env.storage.file`    | File-based env storage (.env)            |
| `env.storage.router`  | Environment variable router              |
| `temporal.client`     | Temporal server connection               |
| `temporal.worker`     | Temporal workflow/activity worker        |
| `workflow.lua`        | Durable Temporal workflow definition     |

# Project Structure

```
myapp/
├── .wippy.yaml          # Runtime configuration
├── wippy.lock           # Source directories config
├── .wippy/              # Installed modules
└── src/                 # Application source
    ├── _index.yaml      # Entry definitions
    ├── api/
    │   ├── _index.yaml
    │   └── *.lua
    └── workers/
        ├── _index.yaml
        └── *.lua
```

### Error Handling

```lua
-- errors global is available without require()

-- Create structured errors (MUST use single-table argument)
local err = errors.new({message = "user not found", kind = errors.NOT_FOUND})
local err = errors.new({message = "invalid input", kind = errors.INVALID})

-- WRONG: two-argument form silently breaks
-- errors.new(errors.INVALID, "message")  -- DO NOT USE

-- Error methods
err:kind()      -- Error category
err:message()   -- Error message
err:retryable() -- Boolean: can retry?
err:details()   -- Additional context table
err:stack()     -- Stack trace

-- Error wrapping
errors.wrap(err, "context message")

-- Error kinds (constants)
-- Typically retryable: TIMEOUT, RATE_LIMITED, UNAVAILABLE
-- Non-retryable: INVALID, NOT_FOUND, PERMISSION_DENIED, INTERNAL, UNKNOWN
```

## Process Model

Processes follow actor-model concurrency without shared state. State machine: Ready -> Running -> Blocked/Idle ->
Complete.

```lua
-- Spawning processes
local pid, err = process.spawn(id, host, ...)
local pid, err = process.spawn_monitored(id, host, ...)

-- Registry for service discovery
process.registry.register("name")       -- Register current process
process.registry.lookup("name")         -- Find process by name

-- Message passing (fire-and-forget, ordered per sender)
process.send(pid, topic, payload)

-- Receive messages with select
channel.select{
    {case = mailbox:case_receive(), handler = function(msg) ... end},
    {case = timer:case_receive(), handler = function() ... end},
}
```

### Functions Module

Functions are synchronous, stateless entry points.

```lua
local funcs = require("funcs")

-- Synchronous call
local result, err = funcs.call("app.api:function_name", arg1, arg2)

-- Asynchronous call
local future = funcs.async("app.process:analyze", data)
local ch = future:response()
local result, ok = ch:receive()

-- With context
local exec = funcs.new()
    :with_context({trace_id = "abc-123"})
    :call("app.api:process", data)
```

### Store Module

Key-value storage with TTL support.

```lua
local store = require("store")

local cache = store.get("app:cache")
cache:set("key", value, 3600)  -- TTL in seconds (0 = no expiry)
local val = cache:get("key")
cache:has("key")               -- Check existence
cache:delete("key")
cache:release()                -- Return to pool
```

### Logger Module

```lua
local log = logger:named("component")

log:debug("message", {key = value})
log:info("message", {key = value})
log:warn("message", {key = value})
log:error("message", {key = value})

-- Child logger with persistent fields
local child = log:with({request_id = "abc"})
```

### HTTP Handler Pattern

```lua
function handler(req, res)
    -- Request methods
    req:method()           -- GET, POST, etc.
    req:path()             -- Request path
    req:param("id")        -- Path parameter {id}
    req:query("page")      -- Query string parameter
    req:header("X-Token")  -- Request header
    req:headers()          -- All headers
    req:body()             -- Request body
    req:cookie("session")  -- Cookie value
    req:remote_addr()      -- Client IP

    -- Response methods
    res:set_status(200)
    res:set_header("Content-Type", "application/json")
    res:set_cookie("session", "value", {http_only = true})
    res:write(json.encode({ok = true}))
    res:redirect("/other", 302)
end
```

## API Endpoints

- Browse structure: https://wippy.ai/llm/toc
- Search: https://wippy.ai/llm/search?q=your+query
- Fetch page: https://wippy.ai/llm/path/en/<path>
- Batch fetch: https://wippy.ai/llm/context?paths=path1,path2
- Get chunk: https://wippy.ai/llm/chunk/<id>
- Related content: https://wippy.ai/llm/related/<id>
- Full docs dump: https://wippy.ai/llms-full.txt

## Documentation

### Getting Started

- [What is Wippy](https://wippy.ai/llm/path/en/start/about)
- [Installation](https://wippy.ai/llm/path/en/start/installation)
- [Project Structure](https://wippy.ai/llm/path/en/start/structure)

### Guides

- [CLI](https://wippy.ai/llm/path/en/guides/cli)
- [Configuration](https://wippy.ai/llm/path/en/guides/configuration)
- [Linter](https://wippy.ai/llm/path/en/guides/linter)
- [Language Server](https://wippy.ai/llm/path/en/guides/lsp)
- [Dependency Management](https://wippy.ai/llm/path/en/guides/dependency-management)
- [Entry Kinds](https://wippy.ai/llm/path/en/guides/entry-kinds)
- [Observability](https://wippy.ai/llm/path/en/guides/observability)
- [Queue Consumers](https://wippy.ai/llm/path/en/guides/queue-consumers)
- [Supervision](https://wippy.ai/llm/path/en/guides/supervision)
- [Publishing](https://wippy.ai/llm/path/en/guides/publishing)

### Core Concepts

- [Compute Units](https://wippy.ai/llm/path/en/concepts/compute-units)
- [Registry](https://wippy.ai/llm/path/en/concepts/registry)
- [Process Model](https://wippy.ai/llm/path/en/concepts/process-model)
- [Functions](https://wippy.ai/llm/path/en/concepts/functions)
- [Workflows](https://wippy.ai/llm/path/en/concepts/workflows)

### Lua Runtime

- [Overview](https://wippy.ai/llm/path/en/lua/overview)
- [Types](https://wippy.ai/llm/path/en/lua/types)
- [Entries](https://wippy.ai/llm/path/en/lua/entries)

#### Core

- [Base](https://wippy.ai/llm/path/en/lua/core/base)
- [Errors](https://wippy.ai/llm/path/en/lua/core/errors)
- [Time](https://wippy.ai/llm/path/en/lua/core/time)
- [Channels](https://wippy.ai/llm/path/en/lua/core/channel)
- [Process](https://wippy.ai/llm/path/en/lua/core/process)
- [Functions](https://wippy.ai/llm/path/en/lua/core/funcs)
- [Future](https://wippy.ai/llm/path/en/lua/core/future)
- [Stream](https://wippy.ai/llm/path/en/lua/core/stream)
- [Context](https://wippy.ai/llm/path/en/lua/core/context)
- [Events](https://wippy.ai/llm/path/en/lua/core/events)
- [Registry](https://wippy.ai/llm/path/en/lua/core/registry)
- [Contract](https://wippy.ai/llm/path/en/lua/core/contract)

#### Data Formats

- [JSON](https://wippy.ai/llm/path/en/lua/data/json)
- [YAML](https://wippy.ai/llm/path/en/lua/data/yaml)
- [Base64](https://wippy.ai/llm/path/en/lua/data/base64)
- [Compress](https://wippy.ai/llm/path/en/lua/data/compress)
- [Payload](https://wippy.ai/llm/path/en/lua/data/payload)
- [Excel](https://wippy.ai/llm/path/en/lua/data/excel)

#### HTTP & Web

- [HTTP](https://wippy.ai/llm/path/en/lua/http/http)
- [HTTP Client](https://wippy.ai/llm/path/en/lua/http/client)
- [WebSocket](https://wippy.ai/llm/path/en/lua/http/websocket)
- [HTML](https://wippy.ai/llm/path/en/lua/http/html)

#### Storage

- [SQL](https://wippy.ai/llm/path/en/lua/storage/sql)
- [Store](https://wippy.ai/llm/path/en/lua/storage/store)
- [Filesystem](https://wippy.ai/llm/path/en/lua/storage/filesystem)
- [Cloud Storage](https://wippy.ai/llm/path/en/lua/storage/cloud)
- [Queue](https://wippy.ai/llm/path/en/lua/storage/queue)

#### System

- [System](https://wippy.ai/llm/path/en/lua/system/system)
- [Environment](https://wippy.ai/llm/path/en/lua/system/env)
- [Logger](https://wippy.ai/llm/path/en/lua/system/logger)
- [I/O](https://wippy.ai/llm/path/en/lua/system/io)
- [Metrics](https://wippy.ai/llm/path/en/lua/system/metrics)
- [OS Time](https://wippy.ai/llm/path/en/lua/system/ostime)
- [TTY](https://wippy.ai/llm/path/en/lua/system/tty)

#### Text & Templates

- [Text](https://wippy.ai/llm/path/en/lua/text/text)
- [Template](https://wippy.ai/llm/path/en/lua/text/template)
- [TreeSitter](https://wippy.ai/llm/path/en/lua/text/treesitter)

#### Security

- [Security](https://wippy.ai/llm/path/en/lua/security/security)
- [Crypto](https://wippy.ai/llm/path/en/lua/security/crypto)
- [Hash](https://wippy.ai/llm/path/en/lua/security/hash)
- [UUID](https://wippy.ai/llm/path/en/lua/security/uuid)

#### Dynamic

- [Eval](https://wippy.ai/llm/path/en/lua/dynamic/eval)
- [Exec](https://wippy.ai/llm/path/en/lua/dynamic/exec)
- [Expression](https://wippy.ai/llm/path/en/lua/dynamic/expression)

### WASM Runtime

- [Overview](https://wippy.ai/llm/path/en/wasm/overview)
- [Functions](https://wippy.ai/llm/path/en/wasm/functions)
- [Host Functions](https://wippy.ai/llm/path/en/wasm/hosts)
- [Processes](https://wippy.ai/llm/path/en/wasm/processes)

### Framework

- [Overview](https://wippy.ai/llm/path/en/framework/overview)
- [LLM](https://wippy.ai/llm/path/en/framework/llm)
- [Agents](https://wippy.ai/llm/path/en/framework/agents)
- [Testing](https://wippy.ai/llm/path/en/framework/testing)
- [Dataflow](https://wippy.ai/llm/path/en/framework/dataflow)
- [Relay](https://wippy.ai/llm/path/en/framework/relay)
- [Views](https://wippy.ai/llm/path/en/framework/views)
    - [Facade](https://wippy.ai/llm/path/en/framework/facade)

### Temporal

- [Overview](https://wippy.ai/llm/path/en/temporal/overview)
- [Activities](https://wippy.ai/llm/path/en/temporal/activities)
- [Workflows](https://wippy.ai/llm/path/en/temporal/workflows)

### System Components

- [Process Host](https://wippy.ai/llm/path/en/system/process-host)
- [Terminal](https://wippy.ai/llm/path/en/system/terminal)
- [Database](https://wippy.ai/llm/path/en/system/database)
- [Store](https://wippy.ai/llm/path/en/system/store)
- [Queue](https://wippy.ai/llm/path/en/system/queue)
- [Filesystem](https://wippy.ai/llm/path/en/system/filesystem)
- [Cloud Storage](https://wippy.ai/llm/path/en/system/cloudstorage)
- [Environment](https://wippy.ai/llm/path/en/system/env)
- [Template](https://wippy.ai/llm/path/en/system/template)
- [Security](https://wippy.ai/llm/path/en/system/security)
- [Exec](https://wippy.ai/llm/path/en/system/exec)

### HTTP

- [Server](https://wippy.ai/llm/path/en/http/server)
- [Router](https://wippy.ai/llm/path/en/http/router)
- [Endpoint](https://wippy.ai/llm/path/en/http/endpoint)
- [Middleware](https://wippy.ai/llm/path/en/http/middleware)
- [Static Files](https://wippy.ai/llm/path/en/http/static)
- [WebSocket Relay](https://wippy.ai/llm/path/en/http/websocket-relay)
- [Server-Sent Events](https://wippy.ai/llm/path/en/http/sse)

### Tutorials

- [Hello World](https://wippy.ai/llm/path/en/tutorials/hello-world)
- [CLI Applications](https://wippy.ai/llm/path/en/tutorials/cli)
- [Echo Service](https://wippy.ai/llm/path/en/tutorials/echo-service)
- [Channels](https://wippy.ai/llm/path/en/tutorials/channels)
- [Processes](https://wippy.ai/llm/path/en/tutorials/processes)
- [Supervision](https://wippy.ai/llm/path/en/tutorials/supervision)
- [Task Queue](https://wippy.ai/llm/path/en/tutorials/task-queue)
- [Authentication](https://wippy.ai/llm/path/en/tutorials/auth)
- [Rust WASM](https://wippy.ai/llm/path/en/tutorials/rust-wasm)
- [LLM Agent](https://wippy.ai/llm/path/en/tutorials/llm-agent)
- [Micro AGI](https://wippy.ai/llm/path/en/tutorials/micro-agi)

### Internals

- [Architecture](https://wippy.ai/llm/path/en/internals/architecture)
- [Registry](https://wippy.ai/llm/path/en/internals/registry)
- [Scheduler](https://wippy.ai/llm/path/en/internals/scheduler)
- [Dispatch](https://wippy.ai/llm/path/en/internals/dispatch)
- [Events](https://wippy.ai/llm/path/en/internals/events)
- [Modules](https://wippy.ai/llm/path/en/internals/modules)
- [Kinds](https://wippy.ai/llm/path/en/internals/kinds)

### About

- [Contributing](https://wippy.ai/llm/path/en/about/contributing)
- [License](https://wippy.ai/llm/path/en/about/license)

### LLM

- [Platform Brief](https://wippy.ai/llm/path/en/start/llm-brief)

## CLI Operations Reference

### Development

```bash
wippy run                    # Start the runtime (HTTP on :8080)
wippy run -c                 # Start with colorful console logging
wippy run -v                 # Start with verbose debug logging
```

### Code Quality

```bash
wippy lint                   # Check Lua code for errors
wippy lint --level warning   # Show warnings and errors
wippy lint --level hint      # Show all diagnostics
wippy lint --rules           # Enable style lint rules
```

### Registry Inspection

```bash
wippy registry list                        # List all entries
wippy registry list --kind "function.lua"  # List Lua functions
wippy registry list --kind "process.lua"   # List processes
wippy registry show cve.sync:cve_sync            # Show entry details
```

### Dependency Management

```bash
wippy init                   # Initialize new lock file
wippy install                # Install dependencies from lock file
wippy update                 # Update dependencies
wippy add <module>           # Add a module dependency
```
