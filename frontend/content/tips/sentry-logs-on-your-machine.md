---
slug: sentry-logs-on-your-machine
title: Read Sentry Logs from PHP on your own machine
description: Point the Sentry PHP SDK at Buggregator with a numeric DSN and write lines with \Sentry\logger(). They show in the Logs tab locally, filtered by level.
query: sentry logs
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#traces-logs-and-metrics
requires: "v2.6.0"
related: [sentry-traces-as-waterfall, sentry-breadcrumbs-before-the-error, claude-code-sees-your-errors]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Point your Sentry PHP SDK at Buggregator with a numeric DSN and write lines with `\Sentry\logger()`. The Sentry logs show up in the Logs tab on your machine, filtered by level, with no Sentry account and nothing sent to the cloud. When tracing is on, each line also links to its trace.

## Steps

### 1. Point the SDK at Buggregator
Keep the number in the DSN path. Events with a number go to the `default` project, which the UI shows from the start. In Laravel, set `SENTRY_LARAVEL_DSN` to the same value instead.

```dotenv
SENTRY_DSN=http://sentry@127.0.0.1:8000/1
```

The PHP SDK reads `SENTRY_DSN` from the environment when `\Sentry\init()` gets no `dsn` (https://docs.sentry.io/platforms/php/configuration/options/). In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 2. Write a log line
Logs need `sentry/sentry` 4.12 or newer. Before 4.31, also set `'enable_logs' => true` in init. Call the logger where something happens, and flush at the end.

```php
\Sentry\logger()->info('Order %s paid', [42]);
\Sentry\logger()->flush(); // at the end of the request or job
```

In Laravel (sentry-laravel 4.15 or newer), set `SENTRY_ENABLE_LOGS=true` in `.env`, add `sentry_logs` to `LOG_STACK` as Sentry's Laravel logs guide shows, and write with `Log::info()`.

### 3. Open the Logs tab
Open the Sentry page and pick **Logs**. The tab appears once the current project has log lines. The open tab shows new lines without a reload. Open a line to see its attributes. Scripts can read the same data:

```text
GET /api/sentry/logs
```

It filters by `project`, `level`, `trace_id` and time.

### 4. Use your own project name, if you want one
A key in the DSN path, such as `/my-app`, sends the data to that project. A project that receives only logs is not added to the project list, so declare it under `projects:` in `buggregator.yaml` and pick it in the sidebar.

## Why it works
Buggregator accepts the same protocol the Sentry SDK uses, so it stores the logs the SDK sends, next to errors, traces and metrics. With tracing on (`traces_sample_rate`), a log line carries the ID of the trace it was written in, and links to that trace once Buggregator has stored it.
