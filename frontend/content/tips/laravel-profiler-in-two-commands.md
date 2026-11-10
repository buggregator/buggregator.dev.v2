---
slug: laravel-profiler-in-two-commands
title: Find the slow function in a Laravel page
description: Install XHProf and one Laravel package, point it at Buggregator, and read the flamechart and top functions of every request.
query: laravel profiler
feature: Profiler
feature_page: /features/profiler
docs: https://docs.buggregator.dev/config/xhprof.html#laravel
requires: null
related: [xdebug-trace-find-slow-call, sentry-traces-as-waterfall, claude-code-sees-your-errors]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Install the XHProf extension and the `maantje/xhprof-buggregator-laravel` package, then point it at Buggregator. This Laravel profiler sends each request's profile to Buggregator, where the Flamechart and Top functions tabs show which function takes the time, with no Blackfire or paid service.

## Steps

### 1. Install the XHProf extension

```bash
pear channel-update pear.php.net
pecl install xhprof
```

### 2. Install the Laravel package

```bash
composer require --dev maantje/xhprof-buggregator-laravel
```

### 3. Point it at Buggregator
Add the endpoint to `.env`. The profile is labeled with your app's name from `APP_NAME`. In Docker Compose, replace `127.0.0.1` with the Buggregator service name.

```dotenv
PROFILER_ENDPOINT=http://profiler@127.0.0.1:8000
```

### 4. Turn profiling on
The package profiles only while this is set, so turn it off when you are done (package README: https://github.com/maantje/xhprof-buggregator-laravel). It profiles each HTTP request; for queues and commands, the README shows how to start the profiler yourself.

```env
XHPROF_ENABLED=true
```

### 5. Load the page and read the profile
Open the slow page, then the profile in Buggregator. **Flamechart** shows where time is spent. **Top functions** ranks functions by CPU time, wall time, memory and call count. **Call graph** colors nodes from white to dark red: the darker, the more it costs.

## Why it works
XHProf records CPU time, wall time and memory for every function call in the request. The package sends that data to Buggregator's profiler endpoint on port 8000, next to your exceptions and logs. After a fix, compare two runs side by side to check that it helped.
