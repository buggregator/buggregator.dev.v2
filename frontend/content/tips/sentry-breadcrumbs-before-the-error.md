---
slug: sentry-breadcrumbs-before-the-error
title: See what happened right before the exception
description: Point your Laravel Sentry DSN at Buggregator. Each error shows its breadcrumbs, request, tags and stack trace on your laptop.
query: sentry breadcrumbs
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#what-you-see-in-the-ui
requires: null
related: [sentry-logs-on-your-machine, sentry-traces-as-waterfall, claude-code-sees-your-errors]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Set your Laravel app's Sentry DSN to Buggregator, and every exception arrives with its Sentry breadcrumbs: the timeline of user actions and system events that led up to the error. You see them next to the request, tags and stack trace, on your own laptop, with no Sentry account.

## Steps

### 1. Start Buggregator
On Linux and macOS, one command installs the binary. Then run it.

```bash
curl -fsSL https://raw.githubusercontent.com/buggregator/server/master/scripts/install.sh | sh
buggregator
```

### 2. Point the DSN at Buggregator
Install the Sentry Laravel SDK as its docs say (docs.sentry.io/platforms/php/guides/laravel), then change one line in `.env`.

```dotenv
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
```

Symfony and plain PHP use `SENTRY_DSN` with the same value. Laravel reads `SENTRY_DSN` only when `SENTRY_LARAVEL_DSN` is not set. In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 3. Keep each app apart
Put a project key in the DSN path instead of the number. In Laravel, change the same `SENTRY_LARAVEL_DSN` line; the docs show it as `SENTRY_DSN`:

```dotenv
SENTRY_DSN=http://sentry@127.0.0.1:8000/shop
```

The errors then go to the project `shop`, not `default`. Pick `shop` in the project selector in the sidebar to see them. Sentry PHP SDK 2.5 accepts only a number here, so keep `/1` on that version.

### 4. Open the error
Trigger the exception and open it at http://127.0.0.1:8000. **Breadcrumbs** is the timeline of user actions and system events leading up to it. **Request** shows the method, URL and headers. **Exceptions** has the stack trace frame by frame; click a frame to open it in your IDE.

## Why it works
Buggregator accepts the same protocol as the Sentry SDK, so the SDK sends it the full event, breadcrumbs included. You see it at once, without waiting for a remote Sentry. It is tested with the Sentry PHP SDK, versions 2.5, 3.22 and 4.x.
