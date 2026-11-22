---
slug: symfony-scheduler-missed-runs
title: Know when a Symfony scheduled task did not run
description: Wrap a Symfony Scheduler task in Sentry's withMonitor(). Buggregator shows each run and marks missed and hung runs. Locally, no Sentry account.
query: symfony scheduler
feature: Crons
feature_page: /features/cron-monitoring
docs: https://docs.buggregator.dev/config/crons.html#sentry-crons
requires: "v2.13.0"
related: [cron-script-ping-url, laravel-scheduler-missed-runs, symfony-errors-locally, python-cron-monitor-decorator]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Wrap the body of your Symfony scheduled task in `\Sentry\withMonitor()` with the task's schedule, and point the Sentry DSN at Buggregator. Each run then reports to Buggregator. It shows which runs went fine and which failed, and it marks a run as missed when it never started and as hung when it never finished.

## Steps

### 1. Start Buggregator with a database file
Jobs and their runs live in the database. The default one is in memory, so keep a file to see runs across restarts.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -e DATABASE_DSN=/data/buggregator.db \
  -v buggregator-data:/data \
  ghcr.io/buggregator/server:latest
```

### 2. Point the Sentry SDK at Buggregator in dev
Install `sentry/sentry-symfony`. Its recipe turns Sentry on for `prod` only. Enable the bundle for `dev` in `config/bundles.php`, then add a `when@dev` block.

```php
// config/bundles.php
Sentry\SentryBundle\SentryBundle::class => ['dev' => true, 'prod' => true],
```

```yaml
# config/packages/sentry.yaml
when@dev:
    sentry:
        dsn: '%env(SENTRY_DSN)%'
```

```dotenv
SENTRY_DSN=http://sentry@127.0.0.1:8000/1
```

### 3. Wrap the task in withMonitor()
Give the monitor the same crontab as the task. `checkinMargin` is how many minutes a run may be late; `maxRuntime` is how many minutes it may take.

```php
use Sentry\MonitorConfig;
use Sentry\MonitorSchedule;
use Symfony\Component\Scheduler\Attribute\AsCronTask;

#[AsCronTask('0 3 * * *')]
final class NightlyReport
{
    public function __invoke(): void
    {
        \Sentry\withMonitor(
            slug: 'nightly-report',
            callback: fn () => $this->build(),
            monitorConfig: new MonitorConfig(
                MonitorSchedule::crontab('0 3 * * *'),
                checkinMargin: 5,
                maxRuntime: 30,
                timezone: 'Europe/Berlin',
            ),
        );
    }

    private function build(): void
    {
        // the work
    }
}
```

### 4. Or call the ping URL
A task without the Sentry SDK can call a URL when it starts and when it ends. The `schedule` query sets the crontab (a `+` is a space).

```bash
curl -fsS "http://127.0.0.1:8000/ping/nightly-report/start?schedule=0+3+*+*+*"
curl -fsS "http://127.0.0.1:8000/ping/nightly-report"
curl -fsS "http://127.0.0.1:8000/ping/nightly-report/fail"
```

### 5. Open Sentry, then Crons
Run the scheduler worker as usual. Then open `http://127.0.0.1:8000`, the Sentry page, **Crons**. Each job shows its status, schedule, last and next run, and its last 20 runs. Jobs that failed, hung or missed a run come first, under **Needs attention**. Open a job for its run history.

## Why it works
`withMonitor()` sends a check-in when the task starts and another when it ends, with `ok` or `error` and the duration. The first check-in creates the job in Buggregator, with the schedule and limits you gave. Every 30 seconds Buggregator checks the schedules: a run that was due and never came is `missed`, a run that started and did not finish within `maxRuntime` is `timeout`. Buggregator sends no alerts: you see it in the UI.
