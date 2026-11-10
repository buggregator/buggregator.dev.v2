---
slug: claude-code-steps-through-php
title: Claude Code sets a breakpoint and steps through PHP
description: Turn on Buggregator's Xdebug proxy and MCP. With no IDE attached, Claude Code sets a breakpoint, waits for the request, reads variables and steps.
query: claude code debugging
feature: Xdebug
feature_page: /features/xdebug
docs: https://docs.buggregator.dev/config/xdebug.html#mcp-tools
requires: "v2.7.0"
related: [claude-code-sees-your-errors, xdebug-only-when-you-ask, xdebug-trace-find-slow-call, cursor-sees-your-errors]
checked: { date: 2026-11-10, version: v2.8.0 }
---
For Claude Code debugging of PHP, turn on Buggregator's Xdebug proxy and its MCP server, and leave the IDE out. Claude Code can then set a breakpoint, wait for the request to stop there, read the variables and step through the code, while you watch each step on the Xdebug page.

## Steps

### 1. Turn on the proxy and MCP
Both are off by default.

```bash
XDEBUG_PROXY_ENABLED=true
MCP_ENABLED=true
```

Nothing else to set: the default mode, `auto`, lets Buggregator drive a session when no IDE answers.

### 2. Point Xdebug at Buggregator
A typical `php.ini`. In Docker, set `xdebug.client_host` to the Buggregator service name, for example `buggregator`.

```ini
xdebug.mode=debug
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
xdebug.start_with_request=trigger
```

### 3. Connect Claude Code
Add Buggregator as an MCP server. If Buggregator runs in Docker, use the HTTP transport on port 8001 instead, as the MCP docs show.

```bash
claude mcp add buggregator -- buggregator mcp
```

### 4. Ask it to debug
Say what you want in plain words. The assistant picks the tools: it saves a breakpoint, sends the request, waits for the pause and reads the variables.

```text
"Set a breakpoint where the order total is computed, run the checkout, and tell me why it's negative."
  → xdebug_breakpoint_set → runs the request (curl) → xdebug_wait → xdebug_variables
```

With no breakpoint and no `xdebug_break();` in the code, the script runs to the end and does not stop.

### 5. Watch on the Xdebug page
Open **Xdebug** in the sidebar. **Agent activity** lists the MCP calls the assistant made in this session, including refused ones.

## Why it works
The proxy sits between Xdebug and your IDE. When no IDE answers, Buggregator drives the session itself, and the MCP tools `xdebug_step`, `xdebug_continue` and `xdebug_stop` send the same commands as the buttons on the page. These control tools are on by default; `xdebug.allow_control: false` keeps the assistant read-only, and stepping is refused while an IDE drives.
