---
slug: laravel-errors-without-sentry-account
title: Laravel errors in Sentry's UI style, no Sentry account
description: Set SENTRY_LARAVEL_DSN to Buggregator. Each Laravel exception shows locally with its stack trace, request and breadcrumbs. No account, no limits.
query: sentry laravel
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#laravel
requires: null
related: [sentry-breadcrumbs-before-the-error, sentry-traces-as-waterfall, laravel-queue-job-errors, laravel-logs-in-a-live-view]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `sentry/sentry-laravel` and set one line in `.env`: `SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1`. Every exception your Laravel app reports then shows up in Buggregator on your machine, with the stack trace, the request and the breadcrumbs that led to it. No Sentry account is needed.

## Steps

### 1. Start Buggregator
```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the SDK
```bash
composer require sentry/sentry-laravel
```

### 3. Set the DSN
One line in `.env`. Keep the number at the end: events then go to the `default` project, which the UI shows from the start.

```dotenv
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
```

In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 4. Hook it into Laravel 11 and later
Laravel 11 and later need one line in `bootstrap/app.php`. Without it, exceptions are not reported:

```php
->withExceptions(function (Exceptions $exceptions): void {
    \Sentry\Laravel\Integration::handles($exceptions);
})
```

### 5. Throw and look
Throw an exception in a route and open the page, then open http://127.0.0.1:8000. The error shows the stack trace frame by frame with code around each line, the request method, URL and headers, the breadcrumbs before the error, tags and loaded packages.

## Why it works
The Sentry SDK sends each exception over HTTP to the address in the DSN. Buggregator speaks the same protocol on port 8000, so the SDK sends to it as it would to Sentry, and Buggregator stores and shows the event. Your error handling code stays the same; only the DSN changes.
