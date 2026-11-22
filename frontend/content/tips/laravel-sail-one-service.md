---
slug: laravel-sail-one-service
title: Mail, errors, logs and dumps in Laravel Sail, one service
description: Add one buggregator service to Sail's compose.yaml. Your Laravel app's mail, Sentry errors, logs and dump() output all land in one local UI.
query: laravel sail
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/guides/laravel-sail.html
requires: null
related: [laravel-mail-to-local-inbox, laravel-errors-without-sentry-account, laravel-logs-in-a-live-view, dump-without-breaking-the-page]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Add one `buggregator` service to Sail's `compose.yaml` and point a few `.env` lines at it. Your Laravel app then sends its emails, Sentry errors, log records and `dump()` output to one local UI at http://127.0.0.1:8000. You can drop the `mailpit` service once mail goes to Buggregator.

## Steps

### 1. Add the service
Sail keeps its services in `compose.yaml` (older apps: `docker-compose.yml`). Add this under `services:`:

```yaml
    buggregator:
        image: 'ghcr.io/buggregator/server:latest'
        ports:
            - '127.0.0.1:8000:8000'
        networks:
            - sail
```

Only the web UI port is published. Your app reaches mail, logs and dumps over the `sail` network by the name `buggregator`. If `APP_PORT` is `8000`, publish the UI on another port, for example `'127.0.0.1:8001:8000'`.

Start it with `./vendor/bin/sail up -d`.

### 2. Mail
```dotenv
MAIL_MAILER=smtp
MAIL_HOST=buggregator
MAIL_PORT=1025
```

### 3. Errors
Install the Sentry SDK with `./vendor/bin/sail composer require sentry/sentry-laravel`, then:

```dotenv
SENTRY_LARAVEL_DSN=http://sentry@buggregator:8000/1
SENTRY_TRACES_SAMPLE_RATE=1.0
```

Laravel 11 and later also need this in `bootstrap/app.php`, or exceptions are not reported:

```php
->withExceptions(function (Exceptions $exceptions): void {
    \Sentry\Laravel\Integration::handles($exceptions);
})
```

### 4. Logs
Add a `socket` channel to `config/logging.php`, as the Monolog docs show for Laravel, then:

```dotenv
LOG_CHANNEL=socket
LOG_SOCKET_URL=buggregator:9913
```

If Buggregator is not running, this channel throws, and even `artisan` commands fail. Set it only in your local `.env`.

### 5. Dumps
```dotenv
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=buggregator:9912
```

`dump()` and `dd()` now go to Buggregator instead of the page or the console.

### 6. Check all four at once
Add this to `routes/console.php` and run `./vendor/bin/sail artisan buggregator:check`:

```php
Artisan::command('buggregator:check', function () {
    \Illuminate\Support\Facades\Mail::raw('Hello', fn ($m) => $m->to('dev@example.com')->subject('Check'));
    \Illuminate\Support\Facades\Log::info('Hello from Laravel');
    dump(['hello' => 'Buggregator']);
    throw new RuntimeException('Check error');
});
```

Open http://127.0.0.1:8000. You see an email «Check», a log record «Hello from Laravel», a dump and a Sentry error «Check error».

## Why it works
One Buggregator container listens on four ports inside the `sail` network: SMTP on 1025, the Sentry API on 8000, Monolog on 9913 and VarDumper on 9912. Laravel's own mailer, the Sentry SDK, the socket log channel and Symfony's dump server each send to their port, and Buggregator shows all of it in one UI.
