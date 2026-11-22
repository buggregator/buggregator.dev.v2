---
slug: laravel-log-stack-keep-files
title: Add Buggregator to Laravel's log stack, keep daily files
description: Add a socket channel and set LOG_STACK=daily,socket. Every Laravel log line shows up live in Buggregator, and your daily log files keep being written.
query: laravel logging
feature: Logs
feature_page: /features/logs
docs: https://docs.buggregator.dev/config/monolog.html#laravel
requires: null
related: [laravel-logs-in-a-live-view, laravel-queue-job-errors, symfony-logs-in-a-live-view]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Keep `LOG_CHANNEL=stack` and add a `socket` channel to it: `LOG_STACK=daily,socket`. Laravel then writes every record twice, once to your daily `laravel-YYYY-MM-DD.log` files and once to Buggregator on port 9913. You read logs live in the browser, and the files stay for grep and for anyone who expects them.

## Steps

### 1. Start Buggregator
Port 8000 is the UI, port 9913 takes the logs.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:9913:9913 \
  ghcr.io/buggregator/server:latest
```

### 2. Add the socket channel
Add it to `channels` in `config/logging.php`. The JSON formatter is required.

```php
// config/logging.php
'socket' => [
    'driver' => 'monolog',
    'level' => env('LOG_LEVEL', 'debug'),
    'handler' => \Monolog\Handler\SocketHandler::class,
    'formatter' => \Monolog\Formatter\JsonFormatter::class,
    'handler_with' => [
        'connectionString' => env('LOG_SOCKET_URL', '127.0.0.1:9913'),
    ],
],
```

### 3. Put it in the stack
In Laravel 11 and later, the `stack` channel reads its channels from `LOG_STACK`. Add `socket` next to the file channel you use. In Docker Compose, use the service name, for example `buggregator:9913`.

```dotenv
LOG_CHANNEL=stack
LOG_STACK=daily,socket
LOG_SOCKET_URL=127.0.0.1:9913
```

### 4. Keep logging when Buggregator is off
If nothing listens on port 9913, the socket handler throws, and with the default stack the log call fails. Set `ignore_exceptions` to `true` on the stack: a failed channel is skipped, and the file is still written.

```php
// config/logging.php
'stack' => [
    'driver' => 'stack',
    'channels' => explode(',', (string) env('LOG_STACK', 'single')),
    'ignore_exceptions' => true,
],
```

### 5. Watch the logs
Open http://127.0.0.1:8000. Records from web requests, queue workers and scheduled commands arrive as they are written, each with its channel, level, message and context as JSON. Search finds records by message, channel or level. `storage/logs` still fills up as before.

## Why it works
A stack channel hands each record to every channel in its list. The `daily` channel writes a file per day, and Monolog's `SocketHandler` sends the same record as JSON over TCP to Buggregator. With `ignore_exceptions`, Laravel wraps the handlers in Monolog's `WhatFailureGroupHandler`, which lets every handler try and drops the errors.
