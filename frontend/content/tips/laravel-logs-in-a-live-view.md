---
slug: laravel-logs-in-a-live-view
title: Laravel logs from web, queue and cron in one live view
description: Add a socket channel to config/logging.php and set LOG_CHANNEL=socket. Laravel logs from requests, queue workers and cron jobs appear live in Buggregator.
query: laravel log channel
feature: Logs
feature_page: /features/logs
docs: https://docs.buggregator.dev/config/monolog.html#laravel
requires: null
related: [symfony-logs-in-a-live-view, dump-without-breaking-the-page, ray-calls-to-free-viewer]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Make `socket` your Laravel log channel: add it to `config/logging.php` with Monolog's `SocketHandler` and the `JsonFormatter`, then set `LOG_CHANNEL=socket`. Your logs appear live in Buggregator, with the context as formatted JSON, instead of in a file you `tail -f`.

## Steps

### 1. Add the socket channel
Add the channel to `config/logging.php`. The JSON formatter is required.
```php
// config/logging.php
return [
    // ...
    'channels' => [
        // ...
        'socket' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => \Monolog\Handler\SocketHandler::class,
            'formatter' => \Monolog\Formatter\JsonFormatter::class,
            'handler_with' => [
                'connectionString' => env('LOG_SOCKET_URL', '127.0.0.1:9913'),
            ],
        ],
    ],
];
```

### 2. Switch your app to it
Set two lines in `.env`. This sends logs to Buggregator instead of your current channel, for example `stack` and its files. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator:9913`.
```dotenv
LOG_CHANNEL=socket
LOG_SOCKET_URL=127.0.0.1:9913
```

### 3. Open the UI
Open `http://127.0.0.1:8000`. New records appear as they are written, each with its channel, level, message and context. Search finds records by message, channel or level.

![Laravel log records arriving live in Buggregator: a sign-in, an order, a slow payment warning, a queue job, a failed job and a scheduled command.](/img/tips/laravel-logs-in-a-live-view.webp)

### 4. Run your workers as usual
Queue consumers, cron jobs and daemons write logs that are easy to miss in stdout. With the same `.env`, they log to the same view as your web requests.

## Why it works
Monolog's `SocketHandler` writes each record to a TCP address instead of a file. Buggregator listens on port 9913 and reads the JSON records. Every process that uses the `socket` channel sends to the same place, so you read them side by side, next to your exceptions and dumps.
