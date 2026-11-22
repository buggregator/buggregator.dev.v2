---
slug: spiral-profiler
title: Find the slow function in a Spiral request
description: Install XHProf and spiral/profiler, add its bootloader and middleware, and read each Spiral request's call graph and top functions in Buggregator.
query: spiral framework
feature: Profiler
feature_page: /features/profiler
docs: https://docs.buggregator.dev/config/xhprof.html#spiral-framework
requires: null
related: [laravel-profiler-in-two-commands, spiral-errors-locally, xdebug-trace-find-slow-call]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install the XHProf extension and the `spiral/profiler` package, add its bootloader and middleware, and set `PROFILER_ENDPOINT` to Buggregator. Each request of your Spiral app is then profiled, and Buggregator shows its call graph, flame graph and top functions, so you see which function takes the time.

## Steps

### 1. Install the XHProf extension

```bash
pear channel-update pear.php.net
pecl install xhprof
```

### 2. Install the Spiral package

```bash
composer require --dev spiral/profiler:^3.0
```

### 3. Add the bootloader
Add it to the `LOAD` list of your kernel.

```php
protected const LOAD = [
    // ...
    \Spiral\Profiler\ProfilerBootloader::class,
];
```

### 4. Profile every request
Add the middleware first in the global middleware list of your routes bootloader.

```php
use Spiral\Bootloader\Http\RoutesBootloader as BaseRoutesBootloader;
use Spiral\Profiler\ProfilerMiddleware;

final class RoutesBootloader extends BaseRoutesBootloader
{
    protected function globalMiddleware(): array
    {
        return [
            ProfilerMiddleware::class,
            // ... your other middleware
        ];
    }
}
```

To profile one route only, put `ProfilerMiddleware::class` in its `#[Route]` attribute's `middleware` argument instead. For controllers, queue jobs, gRPC or events, the package README shows `ProfilerInterceptor` (https://github.com/spiral/profiler/tree/3.0).

### 5. Point it at Buggregator
Profiling is on by default (`PROFILER_ENABLE=true`). Set the endpoint and the name shown on each profile. In Docker Compose, replace `127.0.0.1` with the Buggregator service name.

```dotenv
PROFILER_ENDPOINT=http://127.0.0.1:8000/api/profiler/store
PROFILER_APP_NAME="My app"
```

### 6. Profile only the request you ask for
Profiling every request slows each one down. Set this, then send the header `X-Spiral-Profiler-Enable: 1` with the request you want profiled.

```dotenv
PROFILER_MIDDLEWARE_DEFAULT_ENABLED=false
```

### 7. Read the profile
Open `http://127.0.0.1:8000` and the profile. **Call graph** colors nodes from white to dark red: the darker, the more it costs. **Flame graph** shows where time is spent. **Top functions** ranks functions by CPU time, wall time, memory and call count.

## Why it works
XHProf records CPU time, wall time and memory for every function call in the request. The middleware starts it before your code runs and sends the result to Buggregator's `/api/profiler/store` endpoint on port 8000. After a fix, compare two runs side by side to check that it helped.
