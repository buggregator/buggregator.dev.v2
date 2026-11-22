---
slug: php-opentelemetry-traces
title: PHP OpenTelemetry traces locally
description: Send OpenTelemetry PHP SDK traces to Buggregator with the standard OTEL_ variables. Each request shows as a waterfall of spans on your machine.
query: opentelemetry php
feature: OpenTelemetry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/opentelemetry.html#otel-sdk
requires: "v2.12.0"
related: [sentry-traces-as-waterfall, laravel-opentelemetry-traces, otel-collector-one-more-exporter, node-opentelemetry-traces]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Set `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000` and `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf` for your PHP app, with the OpenTelemetry PHP SDK and the OTLP exporter installed. Your traces then show up in Buggregator as a waterfall of spans, with the service name on each span. You need no Jaeger, no Collector and no cloud account.

## Steps

### 1. Start Buggregator
Run the container. Port 8000 is the web UI and also takes OTLP over HTTP.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  -p 127.0.0.1:9913:9913 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the extension and the SDK
Zero-code instrumentation needs the `opentelemetry` PHP extension. Build it and enable it in `php.ini`:

```bash
pecl install opentelemetry
```

```ini
[opentelemetry]
extension=opentelemetry.so
```

Then add the SDK, the OTLP exporter, an HTTP client for it, and the instrumentation package for your framework. This example uses Laravel's, `open-telemetry/opentelemetry-auto-laravel`; the OpenTelemetry registry lists packages for others.

```bash
composer require \
  open-telemetry/sdk \
  open-telemetry/exporter-otlp \
  php-http/guzzle7-adapter \
  open-telemetry/opentelemetry-auto-laravel
```

### 3. Set the standard OTel variables
Set them in the environment PHP runs in. Buggregator accepts OTLP over HTTP, as protobuf or JSON. It takes traces and logs, not metrics, so turn the metrics exporter off.

```dotenv
OTEL_PHP_AUTOLOAD_ENABLED=true
OTEL_SERVICE_NAME=checkout
OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=none
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

Give the base URL only: the SDK adds `/v1/traces` itself. In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 4. Open the Traces tab
Load a few pages, then open the Sentry page and pick **Traces**. Each trace carries an **OTel** label and the services it went through. Open one to see its spans as a waterfall, with a **Service** column that shows `checkout`.

## Why it works
OTLP is the protocol OpenTelemetry uses to send data. Buggregator takes it on its main port at the standard paths `/v1/traces` and `/v1/logs`, so the SDK sends to it like to any OTLP backend. The traces land on the Sentry page next to errors from Sentry SDKs. `OTEL_SERVICE_NAME` becomes the service in the UI.
