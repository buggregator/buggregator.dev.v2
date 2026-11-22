---
slug: python-script-errors-sentry
title: Python script errors with sentry-sdk, on your machine
description: Init sentry-sdk with a DSN that points at Buggregator. Crashes and caught errors of your scripts and workers show up in a local UI, with their logs.
query: sentry python
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#python
requires: "v2.10.0"
related: [django-errors-and-traces, python-cron-monitor-decorator, sentry-dsn-for-local-dev, python-opentelemetry-fastapi]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Run `pip install sentry-sdk` and call `sentry_sdk.init(dsn="http://sentry@127.0.0.1:8000/1")` at the top of your script. A crash is then reported to Buggregator before the script exits, with its stack trace. In a worker loop, catch the error, call `sentry_sdk.capture_exception()` and keep going. Everything shows up on the Sentry page at http://127.0.0.1:8000, with no Sentry account.

## Steps

### 1. Start Buggregator
Errors arrive on the HTTP port 8000, the same port as the UI.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Init the SDK at the top of the script
`enable_logs=True` also sends the logs you write with `sentry_sdk.logger`. When the script runs in Docker Compose, replace `127.0.0.1` with the Buggregator service name.

```python
import sentry_sdk

sentry_sdk.init(
    dsn="http://sentry@127.0.0.1:8000/1",
    enable_logs=True,
)
```

### 3. Let a one-off script crash
You add nothing for crashes. The SDK reports an uncaught exception, and it sends what is still queued when Python exits.

```python
import json

with open("orders.json") as f:
    orders = json.load(f)

for order in orders:
    total = order["price"] * order["qty"]  # a KeyError here is reported
```

### 4. Report errors in a worker and keep it running
In a loop that must not stop, catch the error and report it yourself.

```python
import sentry_sdk

def handle(job):
    ...

for job in queue:
    sentry_sdk.logger.info("Processing job {job_id}", job_id=job.id)
    try:
        handle(job)
    except Exception:
        sentry_sdk.capture_exception()
```

### 5. Open the Sentry page
Open http://127.0.0.1:8000, then **Sentry**. The **Exceptions** tab lists each error with its frames, file paths, line numbers and code around each line. The **Logs** tab shows the lines from `sentry_sdk.logger`.

## Why it works
Buggregator accepts the protocol of the Sentry SDKs on port 8000, including bodies `sentry-python` compresses with Brotli. The DSN is the only thing that tells the SDK where to send. Keep the `1` at the end: the Python SDK refuses a name there. To put a script into its own project, use the project key before `@`, as in `http://billing@127.0.0.1:8000/1`, for a project listed in Buggregator's `buggregator.yaml`.
