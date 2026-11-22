---
slug: laravel-inspector-locally
title: Inspector transactions from Laravel, locally
description: Install inspector-laravel and set INSPECTOR_URL to Buggregator. Each request shows its duration, memory and a timeline, and nothing goes to the cloud.
query: inspector dev
feature: Profiler
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/inspector.html#laravel
requires: null
related: [laravel-profiler-in-two-commands, laravel-opentelemetry-traces, sentry-traces-as-waterfall]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install the Inspector package for Laravel and set `INSPECTOR_URL=http://inspector@127.0.0.1:8000` in `.env`. Each monitored request then lands in Buggregator instead of Inspector's cloud: its duration, peak memory, result and a timeline of what ran inside it.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the package

```bash
composer require inspector-apm/inspector-laravel
```

### 3. Point it at Buggregator
Four lines in `.env`. The keys can be any value unless you set a secret key on the server.

```dotenv
INSPECTOR_URL=http://inspector@127.0.0.1:8000
INSPECTOR_API_KEY=test
INSPECTOR_INGESTION_KEY=1test
INSPECTOR_ENABLE=true
```

In Docker Compose, use the service name: `INSPECTOR_URL=http://inspector@buggregator:8000`.

### 4. Attach the middleware
To monitor HTTP requests, add Inspector's middleware to your route groups. In Laravel 11 and newer, in `bootstrap/app.php`:

```php
use Inspector\Laravel\Middleware\WebRequestMonitoring;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('web', WebRequestMonitoring::class)
            ->appendToGroup('api', WebRequestMonitoring::class);
    })
    ->create();
```

In Laravel 10 and older, add the same class to the `web` and `api` groups in `app/Http/Kernel.php`.

### 5. Load a page and open it
Open `http://127.0.0.1:8000`. Each transaction shows its name, type, duration in milliseconds, peak memory, result, the HTTP method, URI and host, and a timeline of the work inside the request.

## Why it works
The Inspector SDK sends its data to the URL in `INSPECTOR_URL`. Buggregator accepts the same protocol on port 8000 and shows the transaction next to your errors, logs and dumps. To send to another project, put its key after `inspector:` in the URL, for example `http://inspector:shop@127.0.0.1:8000` (server 2.11.0 or newer).
