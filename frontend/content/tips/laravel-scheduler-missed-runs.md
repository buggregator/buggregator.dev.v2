---
slug: laravel-scheduler-missed-runs
title: Know when a Laravel scheduled task did not run
description: Add ->sentryMonitor() to a scheduled task and point the Sentry DSN at Buggregator. Each run shows up, and missed or hung runs are marked.
query: laravel task scheduling
feature: Crons
feature_page: /features/cron-monitoring
docs: https://docs.buggregator.dev/config/crons.html#sentry-crons
requires: "v2.13.0"
related: [cron-script-ping-url, symfony-scheduler-missed-runs, python-cron-monitor-decorator, laravel-errors-without-sentry-account]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Add `->sentryMonitor()` to a task in your Laravel schedule and point the Sentry DSN at Buggregator. Each run then reports to Buggregator: when it started, how long it took, and whether it failed. A run that was due and never came is marked missed. A run that started and never finished is marked as hung.

## Steps

### 1. Start Buggregator with a database file
Jobs and their runs live in the database. The default database is in memory, so give it a file that survives a restart.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -e DATABASE_DSN=/data/buggregator.db \
  -v buggregator-data:/data \
  ghcr.io/buggregator/server:latest
```

### 2. Point the Sentry SDK at Buggregator
Install `sentry/sentry-laravel` (3.3.1 or newer for cron monitors) and set the DSN in `.env`.

```dotenv
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
```

In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 3. Add sentryMonitor() to a task
Laravel 11 and newer, in `routes/console.php`:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('report:nightly')->dailyAt('03:00')->sentryMonitor();
```

Laravel 8 to 10, in the `schedule()` method of `app/Console/Kernel.php`:

```php
$schedule->command('report:nightly')->dailyAt('03:00')->sentryMonitor();
```

The SDK sends the task's schedule with each run, so you set up nothing in Buggregator. The first run creates the job. How late a run may be and how long it may take come from the `checkInMargin` and `maxRuntime` arguments of `sentryMonitor()`, in minutes, as Sentry's Laravel crons guide shows (https://docs.sentry.io/platforms/php/guides/laravel/crons/).

### 4. Run the scheduler and open Crons
Run `php artisan schedule:work` locally, or keep your usual cron entry for `schedule:run`. Open http://127.0.0.1:8000, go to the Sentry page and pick **Crons**. Each job shows its status, schedule, last and next run, and a strip of its last 20 runs. Jobs that failed, hung or missed a run come first, under **Needs attention**. Open a job to see each run with its start time and duration.

## Why it works
`sentryMonitor()` sends a check-in when the task starts and another when it ends, to the same DSN as your errors. Buggregator stores them as runs. Every 30 seconds it also checks the schedule: if a run was due, the margin has passed and nothing came, it adds a `missed` run. If a run started and did not finish within its max runtime, it marks it `timeout`. Buggregator does not send alerts: you see a missed run when you open the page.
