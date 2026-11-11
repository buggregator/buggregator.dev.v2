---
slug: symfony-logs-in-a-live-view
title: Symfony logs in a live view, context as JSON
description: Add one Monolog socket handler with the JSON formatter, and your Symfony logs appear live in Buggregator with channel, level and context.
query: symfony monolog
feature: Logs
feature_page: /features/logs
docs: https://docs.buggregator.dev/config/monolog.html#symfony
requires: null
related: [laravel-logs-in-a-live-view, dump-without-breaking-the-page, ray-calls-to-free-viewer]
checked: { date: 2026-11-10, version: v2.8.0 }
---
To stop tailing `var/log/dev.log`, add one socket handler to your Symfony Monolog config with the `monolog.formatter.json` formatter and point it at `127.0.0.1:9913`. Every log record then appears live in Buggregator, with its channel, level, message and context as formatted JSON.

## Steps

### 1. Add a socket handler for dev
Put the handler in `config/packages/dev/monolog.php`. If that file already configures handlers, add the `socket` handler to the existing chain instead of replacing it. The `monolog.formatter.json` formatter is required: without it, Buggregator cannot parse the log records.
```php
<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use Symfony\Config\MonologConfig;

return static function (MonologConfig $monologConfig): void {
    $monologConfig
        ->handler('socket')
            ->level('debug')
            ->formatter('monolog.formatter.json')
            ->type('socket')
            ->connectionString(env('MONOLOG_SOCKET_HOST'));
};
```

### 2. Set the address
Add the Buggregator address to your `.env`. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator:9913`.
```dotenv
MONOLOG_SOCKET_HOST=127.0.0.1:9913
```

### 3. Open the UI
Open `http://127.0.0.1:8000` and use your app. New records appear as they are written. Each one shows the channel (app, security, database and so on), one of the 8 PSR-3 levels, the message, the context and extra fields as JSON. Search finds records by message, channel or level.

![A Monolog record from a Symfony app in Buggregator: channel app, level, message and its context as JSON.](/img/tips/symfony-logs-in-a-live-view.webp)

### 4. See where a record came from
When a record has a `source` key in its context, Buggregator shows the file, line and function that wrote it.

## Why it works
Monolog's socket handler writes each record to a TCP address instead of a file. Buggregator listens on port 9913 and reads records in Monolog's JSON format. Logs from workers and other containers can go to the same address, so you see them next to your exceptions and dumps.
