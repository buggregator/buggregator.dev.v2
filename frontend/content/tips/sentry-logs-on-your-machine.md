---
slug: sentry-logs-on-your-machine
title: Sentry Logs on your machine, linked to the trace
description: Send Sentry structured logs from PHP to Buggregator. The Logs tab shows each line locally, filtered by level, with a jump to its trace.
query: sentry logs
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#traces-logs-and-metrics
requires: "v2.6.0"
related: [sentry-traces-as-waterfall, sentry-breadcrumbs-before-the-error, claude-code-sees-your-errors]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Point your Sentry PHP SDK's DSN at Buggregator and write lines with `\Sentry\logger()`. The Sentry logs show up in the Logs tab on your machine, filtered by level and linked to their trace, with no Sentry account and nothing sent to the cloud.

## Steps

### 1. Point the SDK at Buggregator
Use your project name in the DSN path to keep each app's data apart. In Laravel, set `SENTRY_LARAVEL_DSN` in `.env` instead.

```php
\Sentry\init([
    'dsn' => 'http://sentry@127.0.0.1:8000/my-app',
]);
```

In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 2. Write a log line
Logs need `sentry/sentry` 4.12 or newer. Before 4.31, also set `'enable_logs' => true` in init. Call the logger where something happens, and flush at the end.

```php
\Sentry\logger()->info('Order %s paid', [42]);
\Sentry\logger()->flush(); // at the end of the request or job
```

### 3. Open the Logs tab
Open the Sentry page and pick **Logs**. The open tab shows new lines without a reload. Open a line to see its attributes, or jump to its trace. Scripts can read the same data:

```text
GET /api/sentry/logs
```

It filters by `project`, `level`, `trace_id` and time.

## Why it works
Buggregator accepts the same protocol the Sentry SDK uses, so it stores the logs the SDK sends, next to errors, traces and metrics. Errors, traces, logs and metrics all land in the same project, so a log line links to the trace it was written in.
