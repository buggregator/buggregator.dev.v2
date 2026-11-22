---
slug: mcp-agent-reads-your-profile
title: Your AI agent reads the profile and names the slow function
description: Connect Cursor or Claude Code to Buggregator over MCP and send an XHProf profile. Ask what is slow, and the agent reads the top functions and call graph.
query: cursor mcp
feature: MCP
feature_page: /features/mcp-api
docs: https://docs.buggregator.dev/config/mcp.html#profiler
requires: "v2.6.0"
related: [cursor-sees-your-errors, claude-code-sees-your-errors, laravel-profiler-in-two-commands]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Turn on Buggregator's MCP server, connect your AI agent to it, and send one XHProf profile of the slow request. Then ask «what is slow in the last profile?». The agent calls `profiler_summary`, `profiler_top` and `profiler_call_graph`, and answers with the function that takes the time and the path that leads to it.

## Steps

### 1. Turn MCP on
MCP is off by default. In Docker, use the HTTP transport on port 8001.

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

### 2. Connect your agent
In Cursor, add the server to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "buggregator": {
      "url": "http://localhost:8001/mcp"
    }
  }
}
```

In Claude Code, one command does it:

```bash
claude mcp add --transport http buggregator http://localhost:8001/mcp
```

### 3. Send a profile
Install the XHProf extension and a profiler package. For Laravel, `composer require --dev maantje/xhprof-buggregator-laravel`, then turn it on in `.env`:

```dotenv
XHPROF_ENABLED=true
PROFILER_ENDPOINT=http://127.0.0.1:8000/api/profiler/store
```

Load the slow page once. Turn profiling off afterwards: it slows every request down.

### 4. Ask in plain words
The agent picks the tools itself. For example:

```text
"Which function is slowest in the last profile?"
"What uses the most memory in that request?"
"Show the call path to the slowest function"
```

## Why it works
`events_list` with type `profiler` finds the profile. `profiler_summary` gives the totals plus the slowest function, the biggest memory user and the most called one. `profiler_top` ranks functions by CPU, wall time, memory or calls, inclusive or exclusive. `profiler_call_graph` returns only the significant call paths, so the agent can say why a function is slow, not only which one.
