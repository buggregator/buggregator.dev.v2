---
slug: laravel-xdebug-in-docker
title: Xdebug in Docker for Laravel, no IDE path mapping
description: Run Buggregator's Xdebug proxy next to your Laravel container. Step through a request in the browser, with breakpoints set by container paths.
query: xdebug docker
feature: Xdebug
feature_page: /features/xdebug
docs: https://docs.buggregator.dev/config/xdebug.html#docker
requires: "v2.7.0"
related: [xdebug-only-when-you-ask, claude-code-steps-through-php, laravel-sail-one-service, xdebug-trace-find-slow-call]
checked: { date: 2026-11-22, version: v2.13.0 }
---
When Laravel runs in Docker, point Xdebug at a Buggregator container instead of your IDE. Buggregator then drives the session itself, and you step through the request on its **Xdebug** page in the browser. There is no IDE, so there are no path mappings to set: you write breakpoints with the paths PHP sees inside the container.

## Steps

### 1. Add Buggregator with the proxy on
In your `docker-compose.yml`, under `services:`. The proxy is off by default. `XDEBUG_PROXY_ADDR: 0.0.0.0:9003` lets other containers reach it; the default `127.0.0.1:9003` cannot be reached from them. `standalone` mode means Buggregator never calls an IDE.

```yaml
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - 127.0.0.1:8000:8000
    environment:
      XDEBUG_PROXY_ENABLED: "true"
      XDEBUG_PROXY_ADDR: 0.0.0.0:9003
      XDEBUG_PROXY_MODE: standalone
```

Port 9003 is not published: PHP reaches it over the Docker network.

### 2. Point Xdebug in the PHP container at it
In the `php.ini` of your Laravel container, use the Buggregator service name as the host.

```ini
xdebug.mode=debug
xdebug.client_host=buggregator
xdebug.client_port=9003
xdebug.discover_client_host=0
xdebug.start_with_request=trigger
```

Keep `xdebug.discover_client_host=0`. With `1`, Xdebug connects to the address the request came from, and the session skips Buggregator.

### 3. Tell the script where to stop
Open `http://127.0.0.1:8000` and the **Xdebug** page. In **Breakpoints**, type a file and line as PHP sees it inside the container, for example `/var/www/html/app/Http/Controllers/OrderController.php:42`. Or put this line in the code:

```php
xdebug_break();
```

Without a breakpoint or `xdebug_break()`, the script runs to the end and does not stop.

### 4. Send the request with the trigger
Add `XDEBUG_TRIGGER` as a query parameter or a cookie. Only that request starts a session.

```bash
curl 'http://localhost/orders/42?XDEBUG_TRIGGER=1'
```

### 5. Step in the browser
The session shows as **Paused** on the Xdebug page, with the code, the variables and the call stack. Use **Step over**, **Step into**, **Step out** and **Continue**. Click **Release** when you are done: the request finishes normally.

A session paused with no command for 10 minutes is released on its own, so a PHP-FPM worker is not held forever.

## Why it works
Xdebug connects out to the host and port in `php.ini`. Here that is the Buggregator container on port 9003, reached by its service name. With no IDE to pass the session to, Buggregator sends the step commands itself and shows the paused state on the Xdebug page. The proxy has no login of its own, so keep its port inside your Docker network.
