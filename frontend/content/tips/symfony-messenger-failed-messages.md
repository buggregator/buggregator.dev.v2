---
slug: symfony-messenger-failed-messages
title: Symfony Messenger failures with their stack trace
description: Turn sentry-symfony on in dev and point SENTRY_DSN at Buggregator. A failing Messenger handler shows up as an error, tagged with the message class.
query: symfony messenger
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/guides/symfony.html#errors-sentry
requires: null
related: [symfony-errors-locally, laravel-queue-job-errors, symfony-logs-in-a-live-view, sentry-breadcrumbs-before-the-error]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `sentry/sentry-symfony`, turn it on for dev, and set `SENTRY_DSN=http://sentry@127.0.0.1:8000/1`. When a Messenger handler throws in your worker, the exception shows up in Buggregator with its stack trace. It sits next to your web errors and carries the message class as a tag.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the SDK and turn it on for dev
The recipe turns Sentry on for `prod` only. In `config/bundles.php`, turn the bundle on for dev too.

```bash
composer require sentry/sentry-symfony
```

```php
Sentry\SentryBundle\SentryBundle::class => ['dev' => true, 'prod' => true],
```

### 3. Point it at Buggregator
In `config/packages/sentry.yaml`, add a `when@dev:` block. The Messenger integration is on by default when Messenger is installed; the lines below only make it visible.

```yaml
when@dev:
    sentry:
        dsn: '%env(SENTRY_DSN)%'
        messenger:
            enabled: true
            capture_soft_fails: true
```

```dotenv
# .env.local
SENTRY_DSN=http://sentry@127.0.0.1:8000/1
```

In Docker Compose, use the Buggregator service name instead of `127.0.0.1`.

### 4. Run the worker and fail a message
Start the worker for your transport, for example `async`, and dispatch a message whose handler throws.

```bash
bin/console messenger:consume async -vv
```

### 5. Read the error
Open http://127.0.0.1:8000. The error shows the exception your handler threw, not the wrapper around it, with the stack trace. Its tags include `messenger.message_class` and `messenger.receiver_name`. A failure that will be retried is reported too, marked as handled. Set `capture_soft_fails: false` to see only the last failure.

## Why it works
sentry-symfony listens for Messenger's failed-message event in the worker. It unwraps the handler's exception, adds the message tags and sends each exception at once, so a long-running worker does not hold errors back. Buggregator speaks the Sentry protocol, so the DSN is the only thing that points elsewhere.
