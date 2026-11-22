---
slug: laravel-queue-job-errors
title: Laravel queue job errors next to web errors
description: Set SENTRY_LARAVEL_DSN for your queue worker too. A failing job's exception lands in Buggregator with the job class, queue and attempt as a breadcrumb.
query: laravel failed jobs
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#laravel
requires: null
related: [laravel-errors-without-sentry-account, sentry-breadcrumbs-before-the-error, sentry-traces-as-waterfall, laravel-logs-in-a-live-view]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `sentry/sentry-laravel` and set `SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1` in `.env`. When a queued job throws, its exception lands in Buggregator on the same page as your web errors. The breadcrumb "Processing queue job" names the job class, the queue, the connection and the attempt number.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the Sentry SDK

```bash
composer require sentry/sentry-laravel
```

In Laravel 11 and newer, let Sentry handle exceptions in `bootstrap/app.php`:

```php
use Illuminate\Foundation\Configuration\Exceptions;
use Sentry\Laravel\Integration;

->withExceptions(function (Exceptions $exceptions) {
    Integration::handles($exceptions);
})
```

### 3. Set the DSN
One line in `.env`. The worker reads the same file. In Docker Compose, use the service name: `http://sentry@buggregator:8000/1`.

```dotenv
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
```

### 4. Restart the worker
A running worker keeps the config it started with.

```bash
php artisan queue:restart
php artisan queue:work
```

### 5. Let a job fail
Dispatch a job that throws. Open `http://127.0.0.1:8000`. The exception shows its stack trace, and the breadcrumbs show the job it came from. Web errors and job errors sit in one list.

## Why it works
Laravel reports the exception a job throws, and the Sentry SDK sends it like any other error. The SDK clears breadcrumbs when a job starts and adds one with the job's details, so the error shows only what happened in that job. It also sends the event as soon as the job fails, so a long-running worker does not hold it back.
