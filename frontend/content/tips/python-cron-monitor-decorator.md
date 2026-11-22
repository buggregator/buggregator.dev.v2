---
slug: python-cron-monitor-decorator
title: Python cron jobs with Sentry's @monitor, locally
description: Point sentry_sdk at Buggregator and keep your @monitor decorator. Every run shows up, and Buggregator marks missed and hung runs. No Sentry account.
query: sentry cron monitoring
feature: Crons
feature_page: /features/cron-monitoring
docs: https://docs.buggregator.dev/config/crons.html#sentry-crons
requires: "v2.13.0"
related: [cron-script-ping-url, laravel-scheduler-missed-runs, django-errors-and-traces]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Set the Sentry DSN in your Python job to `http://sentry@127.0.0.1:8000/1` and keep the `@monitor` decorator from `sentry_sdk.crons`. Each run then shows up in Buggregator under **Sentry → Crons**: started, finished, failed. Give the monitor a schedule and Buggregator also marks runs that never started and runs that never finished.

## Steps

### 1. Start Buggregator with a database file
The default database lives in memory, so jobs and their runs are gone after a restart. Keep them in a file.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -e DATABASE_DSN=/data/buggregator.db \
  -v buggregator-data:/data \
  ghcr.io/buggregator/server:latest
```

### 2. Point the SDK at Buggregator
Any key before `@` works. The number at the end puts the data into the `default` project.

```python
import sentry_sdk

sentry_sdk.init(dsn="http://sentry@127.0.0.1:8000/1")
```

In Docker Compose, use the service name: `http://sentry@buggregator:8000/1`.

### 3. Keep your decorator, add a schedule
The schedule lets Buggregator tell when a run is due. `checkin_margin` and `max_runtime` are minutes.

```python
from sentry_sdk.crons import monitor

@monitor(monitor_slug='nightly-report', monitor_config={
    'schedule': {'type': 'crontab', 'value': '0 3 * * *'},
    'timezone': 'Europe/Berlin',
    'checkin_margin': 5,
    'max_runtime': 30,
})
def nightly_report():
    ...
```

The first run creates the job in Buggregator. The settings the SDK sends update it on every run. `monitor_config` needs `sentry-sdk` 1.45.0 or newer.

### 4. Open Sentry, then Crons
Each job shows its status, schedule, last and next run, and a strip of the last 20 runs. Jobs that failed, hung or missed a run come first, under **Needs attention**. Open a job for its run history with start time and duration.

## Why it works
The decorator sends a check-in when the function starts and another when it ends: `ok`, or `error` if it raised. Buggregator stores them as runs. Every 30 seconds it checks the schedule: a run that was due and never came is `missed`, and a run that started but did not end within `max_runtime` is `timeout`. Nobody is notified; you see it on the page.
