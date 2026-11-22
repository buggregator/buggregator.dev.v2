---
slug: sentry-locally-without-self-hosting
title: Sentry for local dev without self-hosting Sentry
description: Run one Buggregator container and point your Sentry DSN at it. Your app keeps the same Sentry SDK; errors, traces and logs show up on your machine.
query: sentry self hosted
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#configuration
requires: null
related: [laravel-errors-without-sentry-account, sentry-dsn-for-local-dev, projects-per-service, sentry-traces-as-waterfall]
checked: { date: 2026-11-22, version: v2.13.0 }
---
For local development you do not need to host a Sentry server. Run one Buggregator container and set your DSN to `http://sentry@127.0.0.1:8000/1`. Your app keeps the Sentry SDK it already uses, and its errors, traces and logs show up in Buggregator on your machine. Only the DSN changes.

## Steps

### 1. Start Buggregator
One container, one port for the UI and for the SDK. No account and no sign-up.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Change the DSN
The DSN goes into your app's config. Any key before `@` works. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `http://sentry@buggregator:8000/1`.

```dotenv
# your app's .env
SENTRY_DSN=http://sentry@127.0.0.1:8000/1
# Laravel reads this one
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
```

### 3. Send traces too
Set the trace sample rate to `1.0`, or traces are sampled away and never sent. In Python:

```python
import sentry_sdk

sentry_sdk.init(
    dsn="http://sentry@127.0.0.1:8000/1",
    traces_sample_rate=1.0,
    enable_logs=True,
)
```

### 4. Give each service its own project
With the PHP SDK, put a project key in the DSN path: `http://sentry@127.0.0.1:8000/shop`. SDKs that accept only a number there take the key before `@` instead, for a project that already exists:

```dotenv
SENTRY_DSN=http://billing@127.0.0.1:8000/1
```

### 5. Open the Sentry page
Throw an error and open http://127.0.0.1:8000. Each exception shows its stack trace with code context, breadcrumbs, request, device and app info, tags and loaded modules. The **Sentry** page has tabs for Exceptions, Traces, Logs and Metrics.

### 6. Keep data across restarts
By default Buggregator keeps everything in memory. To keep it, give it a database file. This setting is for Buggregator, not for your app.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -e DATABASE_DSN=/data/buggregator.db \
  -v buggregator-data:/data \
  ghcr.io/buggregator/server:latest
```

## Why it works
Buggregator accepts the protocol Sentry SDKs speak. The SDK reads the host from the DSN and sends its events there, so pointing the DSN at port 8000 is all it takes. Buggregator stores errors, messages, transactions with their spans, and logs. It does not store sessions, client reports, profiles, replays, attachments or minidumps. To go back, set the DSN to its old value.
