---
slug: xdebug-in-the-browser-no-ide
title: Step through PHP in the browser, no IDE setup
description: Turn on Buggregator's Xdebug proxy in standalone mode. Your script stops at a breakpoint, and you read variables and step over lines on the Xdebug page.
query: xdebug
feature: Xdebug
feature_page: /features/xdebug
docs: https://docs.buggregator.dev/config/xdebug.html#debug-without-an-ide
requires: "v2.7.0"
related: [xdebug-only-when-you-ask, laravel-xdebug-in-docker, claude-code-steps-through-php, xdebug-trace-find-slow-call]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Start Buggregator with its Xdebug proxy on and `XDEBUG_PROXY_MODE=standalone`, then point Xdebug at port 9003. When your PHP script reaches a breakpoint or `xdebug_break()`, it pauses, and the **Xdebug** page in the browser shows the code, the variables and the call stack. Step over, step into, continue or stop with the buttons. No IDE and no path mappings to set up.

## Steps

### 1. Start Buggregator with the Xdebug proxy
The proxy is off by default. These settings are for Buggregator. `standalone` means Buggregator drives every session itself and never calls an IDE. Inside the container the proxy must listen on `0.0.0.0`.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:9003:9003 \
  -e XDEBUG_PROXY_ENABLED=true \
  -e XDEBUG_PROXY_ADDR=0.0.0.0:9003 \
  -e XDEBUG_PROXY_MODE=standalone \
  ghcr.io/buggregator/server:latest
```

The proxy has no login of its own: keep port 9003 on 127.0.0.1. If an IDE on your machine already listens on 9003, stop it listening first: only one program can hold the port.

### 2. Tell the script where to stop
Put `xdebug_break();` in the code, or add a breakpoint on the **Xdebug** page: type the file and line in **Breakpoints**, for example `/app/src/Cart.php:42`. The path is the one PHP sees, inside its container. Type `*` to stop on every exception.

```php
xdebug_break();
```

### 3. Run PHP with Xdebug
These are Xdebug settings, on the PHP side.

```bash
php -d xdebug.mode=debug -d xdebug.start_with_request=yes \
  -d xdebug.client_host=127.0.0.1 -d xdebug.client_port=9003 \
  script.php
```

For a web app, put the same values in `php.ini`. When PHP runs in a container next to Buggregator, set `xdebug.client_host` to the Buggregator service name.

### 4. Step through it
Open http://127.0.0.1:8000, then **Xdebug**. The session is **Paused**. You see the source around the paused line, the variables (objects and arrays open when you expand them) and the call stack. The buttons:

| Button | What happens |
|--------|--------------|
| **Continue** | Runs to the next breakpoint or `xdebug_break()`, or to the end |
| **Step over** | The next line; runs a function call without stopping in it |
| **Step into** | The next line; goes into a function call |
| **Step out** | Runs to the end of the current function |
| **Release** | Lets the script finish without stopping again |
| **Stop** | Ends the request now |

## Why it works
Xdebug connects to the debugger at `client_host:client_port` and waits for commands. Buggregator takes that connection and sends the commands itself when you click a button. A session paused with no command for 10 minutes is released, so a forgotten tab does not hold a PHP worker forever.
