---
slug: symfony-errors-locally
title: Symfony errors in a Sentry-style view, no account
description: Install sentry/sentry-symfony, turn it on for dev and set SENTRY_DSN to Buggregator. Exceptions show with stack trace, request and breadcrumbs.
query: sentry symfony
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/guides/symfony.html#errors-sentry
requires: null
related: [symfony-messenger-failed-messages, symfony-logs-in-a-live-view, symfony-dump-server-in-browser, sentry-breadcrumbs-before-the-error]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `sentry/sentry-symfony` and set `SENTRY_DSN=http://sentry@127.0.0.1:8000/1` in `.env.local`. Your Symfony exceptions then show up in Buggregator with the stack trace, the request and the breadcrumbs, on your machine and without a Sentry account. One catch: the bundle's recipe turns Sentry on for `prod` only, so turn it on for `dev` too.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the SDK

```bash
composer require sentry/sentry-symfony
```

### 3. Turn the bundle on for dev
In `config/bundles.php`:

```php
Sentry\SentryBundle\SentryBundle::class => ['dev' => true, 'prod' => true],
```

In `config/packages/sentry.yaml`, add a `when@dev:` block. Create the file if the recipe did not.

```yaml
when@dev:
    sentry:
        dsn: '%env(SENTRY_DSN)%'
        options:
            traces_sample_rate: 1.0
```

### 4. Set the DSN
Put it in `.env.local`, so it stays on your machine. If PHP runs in Docker Compose next to Buggregator, use the service name: `http://sentry@buggregator:8000/1`.

```dotenv
SENTRY_DSN=http://sentry@127.0.0.1:8000/1
```

### 5. Throw an error and open it
Throw an exception in a controller or a command. Open `http://127.0.0.1:8000`. The error shows the stack trace frame by frame with code around each line, the breadcrumbs before it, the request method, URL and headers, tags and loaded packages. Click a file path to open it in your IDE.

## Why it works
Buggregator speaks the same protocol as Sentry, so the Symfony SDK sends to it like to any Sentry server. The DSN decides where events go. The number at the end puts them in the `default` project. With `traces_sample_rate: 1.0` the SDK sends traces too, and they show up on the **Traces** tab.
