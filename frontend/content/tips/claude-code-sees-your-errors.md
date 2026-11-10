---
slug: claude-code-sees-your-errors
title: Claude Code reads your app's errors over MCP
description: Add Buggregator as an MCP server in Claude Code. It lists your Sentry errors, opens stack traces and reads dumps and profiles. No copy-paste.
query: claude code mcp
feature: MCP
feature_page: /features/mcp-api
docs: https://docs.buggregator.dev/config/mcp.html#claude-code
requires: "v2.6.0"
related: [cursor-sees-your-errors, claude-code-steps-through-php, xdebug-trace-find-slow-call, sentry-breadcrumbs-before-the-error]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Start Buggregator with `MCP_ENABLED=true`, then add it as a Claude Code MCP server with one command. Claude Code can then list the events Buggregator caught, open a Sentry error with its stack trace, and read your dumps and profiles, so you stop pasting stack traces into the chat.

## Steps

### 1. Turn MCP on
MCP is off by default. Set the environment variable, or put the same setting in `buggregator.yaml`.

```bash
MCP_ENABLED=true
```

```yaml
mcp:
  enabled: true
```

### 2. Add Buggregator to Claude Code
Run this in your project. `buggregator` is the path to the binary: the name is enough when it is on your PATH, otherwise use the full path.

```bash
claude mcp add buggregator -- buggregator mcp
```

Buggregator must be running with MCP on before Claude Code connects.

### 3. Use HTTP if Buggregator runs in Docker
In Docker, use the HTTP transport on port 8001 instead.

```yaml
services:
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:8001:8001    # MCP HTTP port
    environment:
      MCP_ENABLED: "true"
      MCP_TRANSPORT: http
      MCP_ADDR: ":8001"
```

```bash
claude mcp add --transport http buggregator http://localhost:8001/mcp
```

If you set `MCP_AUTH_TOKEN`, pass the token as an `Authorization: Bearer` header, as the MCP docs show. Without it, the server answers 401.

### 4. Ask in plain words
Claude Code picks the tools itself. For example:

```text
"Show me the latest Sentry errors"
"What's the stack trace for this exception?"
"Analyze the profiling data and find the slowest functions"
```

## Why it works
The `buggregator mcp` subcommand bridges Claude Code's stdio to the running Buggregator through a Unix socket. Tools such as `events_list` and `sentry_event` return the event list and a clean error record: message, exception chain with stack traces, environment. Dumps come back as plain text without HTML, so Claude Code reads values, not markup.
