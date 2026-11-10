---
slug: sentry-traces-as-waterfall
title: See a request's Sentry trace as a waterfall, locally
description: Turn on Sentry tracing in your PHP app and send it to Buggregator. Every span of a request shows on a timeline, and errors link to their trace.
query: sentry tracing
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#traces-logs-and-metrics
requires: "v2.6.0"
related: [sentry-logs-on-your-machine, sentry-breadcrumbs-before-the-error, laravel-profiler-in-two-commands, xdebug-trace-find-slow-call]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Turn on Sentry tracing in your PHP app with a sample rate of 1.0 and point the DSN at Buggregator. Every request then shows up as a waterfall of spans on your machine: database queries, cache, HTTP calls and queues on one timeline, with errors linked to the trace they happened in.

## Steps

### 1. Point the SDK at Buggregator
In Laravel, one line in `.env`. Put a project name in the path to keep each app's data apart.

```dotenv
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/my-app
```

In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 2. Send every trace
Errors arrive as soon as the DSN is set. Traces are an SDK feature: switch them on. In Laravel, add this to `.env`:

```dotenv
SENTRY_TRACES_SAMPLE_RATE=1.0
```

In plain PHP, set the rate in init:

```php
\Sentry\init([
    'dsn' => 'http://sentry@127.0.0.1:8000/my-app',
    'traces_sample_rate' => 1.0, // send every trace while you develop
]);
```

### 3. Open the Traces tab
Load a page, then open the Sentry page and pick **Traces**. Open a transaction to see every span on a timeline, each marked by type. The bar shows how long it took; failed spans are tagged.

### 4. Follow an error into its trace
Throw an exception in a request. The error shows a small waterfall of the request it happened in. Open the full trace to see every query and call around it.

## Why it works
Buggregator stores what the Sentry SDK sends as traces: transactions with their spans. They are linked by trace: an error shows its trace, a trace lists the errors that happened in it, and logs link to their trace. A sample rate of 1.0 means the SDK sends every trace, not a sample.
