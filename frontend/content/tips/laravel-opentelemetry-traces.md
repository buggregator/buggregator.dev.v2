---
slug: laravel-opentelemetry-traces
title: Laravel OpenTelemetry traces on your machine
description: Add OpenTelemetry auto-instrumentation to Laravel and send OTLP to Buggregator on port 8000. Each request shows as a span waterfall, no Jaeger needed.
query: opentelemetry laravel
feature: OpenTelemetry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/opentelemetry.html#otel-sdk
requires: "v2.12.0"
related: [sentry-traces-as-waterfall, php-opentelemetry-traces, otel-collector-one-more-exporter, laravel-profiler-in-two-commands]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install the OpenTelemetry PHP extension and the Laravel auto-instrumentation package, then set `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000`. Each Laravel request then shows up in Buggregator as a trace: the request, its database queries and its HTTP client calls as spans on one timeline. No Jaeger, no Grafana, no account.

## Steps

### 1. Start Buggregator
It takes OTLP over HTTP on the same port as its UI, 8000.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the OpenTelemetry extension
Auto-instrumentation needs the `opentelemetry` PHP extension. Install it with PECL, or with `install-php-extensions opentelemetry` in a Docker image, then enable it.

```bash
pecl install opentelemetry
```

```ini
[opentelemetry]
extension=opentelemetry.so
```

Check it with `php -m | grep opentelemetry`.

### 3. Add the packages
The SDK, the OTLP exporter and the Laravel instrumentation.

```bash
composer require open-telemetry/sdk open-telemetry/exporter-otlp open-telemetry/opentelemetry-auto-laravel
```

### 4. Point the SDK at Buggregator
Put these lines in `php.ini` (or another ini file PHP reads), or set them as environment variables of the PHP process. Laravel's `.env` is not enough: the SDK starts when Composer's autoloader runs, before Laravel reads `.env`.

```ini
OTEL_PHP_AUTOLOAD_ENABLED="true"
OTEL_SERVICE_NAME="laravel"
OTEL_TRACES_EXPORTER="otlp"
OTEL_LOGS_EXPORTER="otlp"
OTEL_METRICS_EXPORTER="none"
OTEL_EXPORTER_OTLP_PROTOCOL="http/protobuf"
OTEL_EXPORTER_OTLP_ENDPOINT="http://127.0.0.1:8000"
```

In Docker Compose, use the service name: `http://buggregator:8000`. Buggregator takes `http/protobuf` or `http/json`, not `grpc`. It does not take metrics, so metrics export is off here.

### 5. Open Sentry, then Traces
Load a page of your app. In Buggregator, open the **Sentry** page and pick **Traces**. The row is labelled **OTel** and shows the service name. Open it to see the spans as a waterfall, with a **Service** column. Laravel logs sent through OpenTelemetry show up under **Logs** and link to their trace.

## Why it works
The Laravel package hooks into the HTTP kernel, the database and the HTTP client, and creates spans without code changes. The OTLP exporter sends them to `/v1/traces` on the endpoint you set. Buggregator accepts OTLP on port 8000 and shows OTel traces on the Sentry page, next to traces from Sentry SDKs. `OTEL_SERVICE_NAME` is what you see as the service.
