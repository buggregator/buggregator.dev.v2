---
slug: django-errors-and-traces
title: Django errors, traces and logs on your machine
description: Point sentry-sdk at Buggregator with traces and logs on. Django errors, request traces and log records show up locally, with no Sentry account.
query: sentry django
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/guides/django.html#errors-traces-and-logs-sentry
requires: "v2.6.0"
related: [django-mail-to-local-inbox, sentry-traces-as-waterfall, sentry-logs-on-your-machine, python-opentelemetry-fastapi]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `sentry-sdk`, call `sentry_sdk.init()` in `settings.py` with a DSN that points at Buggregator, and turn on traces and logs. Django errors, request traces and your `logging` records then show up in a local UI. You need no Sentry account, and nothing leaves your machine.

## Steps

### 1. Start Buggregator
Run the container. Port 8000 is the web UI and also takes Sentry data.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  -p 127.0.0.1:9913:9913 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the SDK and init it
Run `pip install sentry-sdk`. Then add this to `settings.py`. The SDK turns on its Django integration by itself.

```python
import sentry_sdk

sentry_sdk.init(
    dsn="http://sentry@127.0.0.1:8000/1",
    traces_sample_rate=1.0,
    enable_logs=True,
)
```

`traces_sample_rate=1.0` sends every trace, not a sample. In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 3. Let INFO records through
With `enable_logs=True`, records from Python's standard `logging` go to Buggregator, at INFO and above. But Python's default level is WARNING, so INFO records are dropped before the SDK sees them. Set the root level in `settings.py`:

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "root": {"level": "INFO"},
}
```

### 4. Check it
Open http://127.0.0.1:8000. Then run this in `python manage.py shell`:

```python
import logging, sentry_sdk

logging.getLogger("app").warning("Hello from Django")
try:
    1 / 0
except ZeroDivisionError:
    sentry_sdk.capture_exception()
sentry_sdk.flush()
```

You see a Sentry error `ZeroDivisionError`. On the Sentry page, the **Logs** tab shows «Hello from Django». Load a few pages of your app, then open the **Traces** tab to see each request as a waterfall of spans.

## Why it works
Buggregator accepts the same protocol the Sentry SDK uses. It stores errors, traces and logs, and shows them on the Sentry page. The DSN is the only thing that tells the SDK where to send, so your Django code does not change.
