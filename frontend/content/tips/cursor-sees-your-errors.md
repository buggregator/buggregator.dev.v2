---
slug: cursor-sees-your-errors
title: Cursor reads the exception you just hit
description: Connect Cursor to Buggregator over MCP. It reads the stack trace, dumps and profiles your app sent, straight from your local Buggregator.
query: cursor mcp
feature: MCP
feature_page: /features/mcp-api
docs: https://docs.buggregator.dev/config/mcp.html#cursor
requires: "v2.6.0"
related: [claude-code-sees-your-errors, claude-code-steps-through-php, sentry-breadcrumbs-before-the-error]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Start Buggregator with `MCP_ENABLED=true` and add `buggregator mcp` as an MCP server in Cursor settings. With this Cursor MCP setup, Cursor reads the Sentry error you just hit, with its stack trace, plus your variable dumps and profiles, from the Buggregator on your machine.

## Steps

### 1. Turn MCP on
MCP is off by default. Start Buggregator with this variable, or set `mcp.enabled: true` in `buggregator.yaml`.

```bash
MCP_ENABLED=true
```

### 2. Add the MCP server in Cursor
Open Cursor settings and add an MCP server with this command. `buggregator` is the binary: the name works when it is on your PATH, otherwise give the full path.

```text
Command: buggregator mcp
```

### 3. Use the HTTP URL if Buggregator runs in Docker
Run Buggregator with the HTTP transport and give Cursor the URL instead of the command.

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

```text
http://localhost:8001/mcp
```

### 4. Ask about the error
Trigger the error, then ask Cursor about it. The assistant picks the tools.

```text
"Show me the latest Sentry errors"
"What's the stack trace for this exception?"
"What value was dumped in the last VarDumper event?"
```

## Why it works
Buggregator has a built-in MCP server. `sentry_event` returns an error's message, severity, exception chain with stack traces and environment; `vardump_get` returns a dump as plain text; `profiler_summary` and `profiler_top` give the slowest functions. Cursor reads the data your app already sent, so nothing is copied by hand.
