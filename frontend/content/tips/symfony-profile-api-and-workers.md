---
slug: symfony-profile-api-and-workers
title: Profile Symfony APIs and workers
description: Install XHProf and a Symfony bundle, point it at Buggregator, and get a call graph and flame graph for each API request, command and worker run.
query: symfony profiler
feature: Profiler
feature_page: /features/profiler
docs: https://docs.buggregator.dev/config/xhprof.html#symfony-framework
requires: null
related: [laravel-profiler-in-two-commands, xdebug-trace-find-slow-call, symfony-messenger-failed-messages]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install the XHProf extension and the `velpl/buggregator-profiler-bundle` package, then turn the bundle on. It profiles each HTTP request and each console command of your Symfony app and sends the profile to Buggregator. You get a call graph, a flame graph and a top functions table for JSON API calls, commands and Messenger workers. It works next to the Symfony web profiler.

## Steps

### 1. Install the XHProf extension

```bash
pear channel-update pear.php.net
pecl install xhprof
```

### 2. Install the bundle
The bundle is in early development, so add it as a dev dependency.

```bash
composer require --dev velpl/buggregator-profiler-bundle:^0.3
```

### 3. Turn it on
The bundle sends nothing until `enabled` is true. In Docker Compose, replace `127.0.0.1` with the Buggregator service name.

```yaml
# config/packages/buggregator_profiler.yaml
buggregator_profiler:
    enabled: true
    application_name: 'My app'
    profiler_url: 'http://127.0.0.1:8000'
```

### 4. Call your API or run a command
Each main HTTP request is one profile, from the start of the request to its end. Each console command is one profile, from the start of the command to its end.

```bash
curl http://127.0.0.1/api/orders
bin/console app:import-products
```

### 5. Give a worker an end
A worker is a console command too, so its profile is sent when it stops. Let it handle a few messages and exit.

```bash
bin/console messenger:consume async --limit=10
```

### 6. Read the profile
Open `http://127.0.0.1:8000` and pick the profile. **Call graph** colors nodes from white to dark red: the darker, the more it costs. **Flame graph** shows where the time goes. **Top functions** ranks functions by CPU time, wall time, memory and call count.

## Why it works
XHProf records CPU time, wall time and memory for every function call. The bundle starts the profiler when a request or a command begins and sends the data to Buggregator when it ends. That is why it also covers code with no page to look at: JSON APIs, commands and workers. After a fix, compare two runs side by side to check that it helped.
