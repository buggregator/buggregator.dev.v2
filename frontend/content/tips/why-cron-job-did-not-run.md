---
slug: why-cron-job-did-not-run
title: "Cron job not running? See missed, failed and hung runs"
description: Wrap a cron job in three pings to Buggregator. It marks each run as ok, error, missed or timeout, and keeps the last 10 KB of the job's output.
query: cron job not running
feature: Crons
feature_page: /features/cron-monitoring
docs: https://docs.buggregator.dev/config/crons.html#missed-and-hung-runs
requires: "v2.13.0"
related: [cron-script-ping-url, laravel-scheduler-missed-runs, python-cron-monitor-decorator]
checked: { date: 2026-11-22, version: v2.13.0 }
---
"Not running" can mean three different things: the job never started, it started and failed, or it started and never finished. Wrap the job in pings to Buggregator: one at the start, one at the end with the job's output. Buggregator then marks each run as `ok`, `error`, `missed` or `timeout`, and keeps the last 10 KB of what the job printed. You see which of the three happened, and why.

## Steps

### 1. Start Buggregator with a database file
The default database lives in memory, so runs are gone after a restart.

```bash
buggregator -db buggregator.db
```

### 2. Wrap the job in a small script
Save this as `cron-run.sh` and make it executable. It pings the start, runs your command, and sends its output as a success or a failure.

```bash
#!/bin/sh
# Usage: cron-run.sh <job-name> "<schedule>" <command> [args...]
B=http://127.0.0.1:8000
job=$1; schedule=$2; shift 2
log=$(mktemp)

curl -fsS -G "$B/ping/$job/start" --data-urlencode "schedule=$schedule" --data-urlencode "tz=UTC" > /dev/null
if "$@" > "$log" 2>&1; then
  curl -fsS -X POST --data-binary @"$log" "$B/ping/$job" > /dev/null
else
  curl -fsS -X POST --data-binary @"$log" "$B/ping/$job/fail" > /dev/null
fi
rm -f "$log"
```

### 3. Use it in the crontab
Give the same schedule as the crontab line. Set `tz` in the script to the time zone your cron daemon uses; Buggregator reads the schedule in UTC by default.

```bash
0 2 * * * /opt/cron-run.sh backup "0 2 * * *" /opt/backup.sh
```

### 4. Read the status
Open http://127.0.0.1:8000, then **Sentry → Crons**. Jobs that failed, hung or missed a run come first, under **Needs attention**. Open a job for its runs and the output each run sent.

| Status | What it means | Where to look |
|---|---|---|
| `missed` | the run was due and no ping came | the crontab line, the cron daemon, the schedule and time zone |
| `error` | the command exited with an error | the run's output |
| `timeout` | the run started and did not finish within `max_runtime` | a lock, a stuck network call, a too small limit |
| `ok` | the run finished fine | nothing |

A run counts as missed when nothing comes within the margin after it was due: 1 minute by default. A run counts as hung after 30 minutes by default. Change both in the start ping with `margin` and `max_runtime`, in whole minutes.

## Why it works
The start ping carries the schedule, so Buggregator knows when the next run is due. Every 30 seconds it checks each job. A due run with no ping becomes `missed`, and a started run older than `max_runtime` becomes `timeout`. A `POST` body is kept as the run's output, the last 10 KB. Buggregator shows this in the UI and sends no alerts.
