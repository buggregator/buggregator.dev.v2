---
slug: spiral-errors-locally
title: Spiral errors through the Sentry bridge, locally
description: Install spiral/sentry-bridge, register SentryReporterBootloader and set SENTRY_DSN to Buggregator. Spiral exceptions show up locally with stack traces.
query: spiral framework
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#spiral-framework
requires: null
related: [spiral-profiler, symfony-errors-locally, sentry-breadcrumbs-before-the-error, laravel-errors-without-sentry-account]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `spiral/sentry-bridge`, register `SentryReporterBootloader` in your Kernel and set `SENTRY_DSN=http://sentry@127.0.0.1:8000/1`. Every exception your Spiral app reports then shows up in Buggregator with its stack trace. You need no Sentry account. Errors from RoadRunner workers, which never reach the browser, land there too.

## Steps

### 1. Start Buggregator
Run the container. Port 8000 is the web UI and also takes Sentry data.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  -p 127.0.0.1:9913:9913 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the bridge

```bash
composer require spiral/sentry-bridge
```

### 3. Register the bootloader
Add `SentryReporterBootloader` in `app/src/Application/Kernel.php`. It hooks the Sentry reporter into Spiral's exception handler.

```php
public function defineBootloaders(): array
{
    return [
        // ...
        \Spiral\Sentry\Bootloader\SentryReporterBootloader::class,
        // ...
    ];
}
```

To attach your app's recent log messages to each error, register `\Spiral\Bootloader\Debug\LogCollectorBootloader` before it.

### 4. Point the DSN at Buggregator
One line in `.env`. Keep the number in the path: the data then goes to the `default` project.

```dotenv
SENTRY_DSN=http://sentry@127.0.0.1:8000/1
```

In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 5. Throw an exception and open it
Throw an exception in a controller or a console command. Open http://127.0.0.1:8000. The error shows its stack trace frame by frame, with the request and the other context the SDK sends.

## Why it works
The bridge wraps the Sentry PHP SDK. Buggregator accepts the same protocol the SDK uses, so the DSN is the only thing that tells it where to send. Your Spiral code does not change.
