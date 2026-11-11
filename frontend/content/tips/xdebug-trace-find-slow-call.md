---
slug: xdebug-trace-find-slow-call
title: Record every call of one request and find the slow one
description: Record an Xdebug function trace, send the file to Buggregator, and see the slowest calls, the call tree and a search over every call.
query: xdebug trace
feature: Xdebug
feature_page: /features/xdebug
docs: https://docs.buggregator.dev/config/xdebug-trace.html#record-a-trace
requires: "v2.8.0"
related: [laravel-profiler-in-two-commands, xdebug-only-when-you-ask, claude-code-steps-through-php, sentry-traces-as-waterfall]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Record an Xdebug trace of one request in the computer-readable format and send the file to Buggregator. It lists every function call of that request with its time and memory, shows the slowest calls, and lets you walk the call tree and search it.

## Steps

### 1. Turn on tracing
Add this to `php.ini`. `xdebug.trace_format=1` is required: Buggregator refuses the other formats with 400. Xdebug does not create the output folder, so create it first with `mkdir -p /tmp/traces`.

```ini
xdebug.mode=trace
xdebug.trace_format=1
xdebug.start_with_request=trigger
xdebug.output_dir=/tmp/traces
```

### 2. Trace the request
With `trigger`, Xdebug traces only a request with the `XDEBUG_TRIGGER` cookie, query or POST parameter. For one CLI script, pass the settings as flags:

```bash
php -d xdebug.mode=trace -d xdebug.trace_format=1 -d xdebug.start_with_request=yes \
  -d xdebug.output_dir=/tmp/traces bin/console app:import
```

### 3. Send the file to Buggregator
Post the trace as the request body. A `.xt.gz` file can go as it is: Buggregator reads gzip itself.

```bash
curl -H 'X-Buggregator-Event: xdebug-trace' \
  --data-binary @/tmp/traces/trace.1234567890.xt.gz \
  http://127.0.0.1:8000/
```

Buggregator answers 200 with `{"status":true}`. It does not pick up trace files from a folder by itself.

### 4. Find the slow call
Open **Xdebug traces** in the sidebar and pick the trace. **Slowest & top** lists single calls by their time with callees, and functions by their own time. In **Call tree**, click ▸ to see what a call made, or type in **Find a function or file**, e.g. `PDO->query`.

![An Xdebug trace in Buggregator: the slowest calls and the functions with the most self time.](/img/tips/xdebug-trace-find-slow-call.webp)

## Why it works
A trace records every call: what was called, from which file and line, how long it took and how much memory it used. Buggregator sums it up, so one slow method called many times in a loop stands out. With MCP on, an AI assistant can read the same trace through `xdebug_trace_summary`.
