---
slug: mcp-agent-builds-mock-api
title: Let your AI agent build the mock API for you
description: Turn on Buggregator's MCP server and ask your agent for a mock endpoint. It previews a template with fake data, saves the rule and you call /mock.
query: mcp mock server
feature: Mock server
feature_page: /features/mock-server
docs: https://docs.buggregator.dev/config/mock-templates.html#mcp-tools-for-ai-agents
requires: "v2.6.0"
related: [mock-api-with-fake-data, mock-api-from-openapi-spec, claude-code-sees-your-errors, cursor-sees-your-errors]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Start Buggregator with `MCP_ENABLED=true` and connect your AI agent to it. Then ask in plain words for the endpoint you need. The agent reads the list of fake data generators, tries a template on a sample request, and saves the mock rule. Your app calls it under `http://127.0.0.1:8000/mock/...` and gets fake data back.

## Steps

### 1. Turn MCP on
MCP is off by default. Set the environment variable, or `mcp.enabled: true` in `buggregator.yaml`.

```bash
MCP_ENABLED=true
```

### 2. Connect your agent
For Claude Code, run this in your project. `buggregator` is the path to the binary. For other MCP clients, see the MCP docs.

```bash
claude mcp add buggregator -- buggregator mcp
```

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

### 3. Ask for the endpoint
Say what the API should return. For example:

```text
"Create a mock for GET /users/{id} that returns the id from the path,
a fake name and a fake email as JSON. Preview it before you save it."
```

The agent uses `mock_template_helpers` to find generators, `mock_rule_preview` to run the template on a sample request without saving, and `mock_rule_create` to save it.

### 4. Turn a 404 into a rule
If your app already called a path that has no rule, ask the agent to look at `mock_requests_list` and create a rule from that request. It uses `mock_rule_from_request`.

### 5. Call the mock
The rule also appears on the **Mock server** page, where you can edit it.

```bash
curl http://127.0.0.1:8000/mock/users/42
```

## Why it works
Buggregator's MCP server exposes the mock server as tools: list, read, preview, create, update and delete rules, and import an OpenAPI spec. A preview gives the same answer as the REST API's preview and saves nothing, so the agent sees a template error before the rule exists. To let the agent only read and preview, set `MCP_MOCK_WRITE=false`.
