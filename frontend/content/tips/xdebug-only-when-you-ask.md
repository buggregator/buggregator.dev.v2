---
slug: xdebug-only-when-you-ask
title: Start Xdebug only for the request you want
description: Set xdebug.start_with_request=trigger. Xdebug starts only when a request carries XDEBUG_TRIGGER, and that session goes to Buggregator.
query: xdebug start_with_request
feature: Xdebug
feature_page: /features/xdebug
docs: https://docs.buggregator.dev/config/xdebug.html#_3-point-xdebug-at-buggregator
requires: "v2.6.0"
related: [claude-code-steps-through-php, xdebug-trace-find-slow-call, claude-code-sees-your-errors]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Set `xdebug.start_with_request=trigger` in `php.ini`. Xdebug then starts only for a request that carries `XDEBUG_TRIGGER` as a GET or POST parameter, a cookie, or an environment variable, and that one session goes to Buggregator's Xdebug proxy. Every other request runs without the debugger.

## Steps

### 1. Turn the proxy on
The proxy is off by default. Add `MCP_ENABLED=true` too if you want an AI assistant to read the session; otherwise the first line is enough.

```bash
XDEBUG_PROXY_ENABLED=true
MCP_ENABLED=true
```

If your IDE also listens on port 9003, move the IDE to 9004 (PhpStorm: Settings → PHP → Debug → Xdebug → Debug port). The proxy passes the session on to it.

### 2. Set the trigger in php.ini
A typical `php.ini` for Buggregator. The last line is the one that limits debugging to triggered requests.

```ini
xdebug.mode=debug
xdebug.client_host=127.0.0.1
xdebug.client_port=9003
xdebug.start_with_request=trigger
```

In Docker, set `xdebug.client_host` to the Buggregator service name, for example `buggregator`.

### 3. Send the trigger
Add `XDEBUG_TRIGGER` to the one request you want to debug: as a GET or POST variable, or as a cookie. For a CLI script, set the `XDEBUG_TRIGGER` environment variable. Xdebug does not look at the value, unless you set `xdebug.trigger_value`; then only a matching value starts it.

### 4. Tell the script where to stop
Without an IDE, put this line where you want to stop, or set a breakpoint on the Xdebug page.

```php
xdebug_break();
```

In trigger mode, Xdebug's docs say `xdebug_break()` also starts a session on its own.

## Why it works
The trigger rules are Xdebug's own: in trigger mode it checks for `XDEBUG_TRIGGER` in `$_ENV`, `$_GET`, `$_POST` and `$_COOKIE` when the request starts (https://xdebug.org/docs/all_settings#start_with_request). A triggered request connects to Buggregator on port 9003. Buggregator passes it to your IDE or, with no IDE, drives it from the Xdebug page.
