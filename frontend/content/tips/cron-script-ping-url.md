---
slug: cron-script-ping-url
title: "Know when a cron script did not run: one curl line"
description: Add a curl to your crontab line. Buggregator shows each run, marks missed and hung runs, and keeps the last 10 KB of the job's output.
query: cron monitoring
feature: Crons
feature_page: /features/cron-monitoring
docs: https://docs.buggregator.dev/config/crons.html#ping-url
requires: "v2.13.0"
related: [laravel-scheduler-missed-runs, python-cron-monitor-decorator, laravel-logs-in-a-live-view]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Add one `curl` to the end of your crontab line, with the job's schedule in the URL: `curl -fsS "http://127.0.0.1:8000/ping/backup?schedule=0+2+*+*+*"`. Buggregator then knows when the job should run. If nothing comes by then, it marks the run as missed. Ping at the start too, and a run that never finishes shows up as hung.

## Steps

### 1. Start Buggregator with a database file
The default database lives in memory, so jobs and runs are gone after a restart. Keep them in a file:

```bash
buggregator -db buggregator.db
```

In Docker, keep the file in a volume:

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -v buggregator-data:/data \
  ghcr.io/buggregator/server:latest -db /data/buggregator.db
```

### 2. Add the curl to the crontab line
The first ping creates the job. No setup in Buggregator. A `+` in the schedule is a space.

```bash
0 2 * * * /opt/backup.sh && curl -fsS "http://127.0.0.1:8000/ping/backup?schedule=0+2+*+*+*"
```

If the script fails, no ping comes, and the run counts as missed.

### 3. Report start, failure and output
For hung runs, failures and the job's output, wrap the script. A `POST` body is kept as the run's output, the last 10 KB.

```bash
B=http://127.0.0.1:8000
curl -fsS "$B/ping/backup/start?schedule=0+2+*+*+*&tz=Europe/Berlin"
if ./backup.sh > out.log 2>&1; then
  curl -fsS -X POST --data-binary @out.log "$B/ping/backup"
else
  curl -fsS -X POST --data-binary @out.log "$B/ping/backup/fail"
fi
```

More options go in the query: `margin` (minutes a run may be late, default 1), `max_runtime` (minutes a run may take, default 30), `tz` (default UTC) and `project`.

### 4. Open Crons
Open http://127.0.0.1:8000, then **Sentry → Crons**. Each job shows its status, schedule, last and next run, and a strip of the last 20 runs. Jobs that failed, hung or missed a run come first, under **Needs attention**. Open a job for its run history and the output each run sent.

## Why it works
A ping tells Buggregator «started», «finished» or «failed». With the schedule it knows when the next run is due. Every 30 seconds it checks: a due run with no ping after the margin becomes `missed`, and a started run that takes longer than `max_runtime` becomes `timeout`. Buggregator shows this in the UI; it sends no alerts.
