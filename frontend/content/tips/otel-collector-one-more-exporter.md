---
slug: otel-collector-one-more-exporter
title: Add Buggregator to your OTel Collector as one more exporter
description: Add an otlphttp exporter to your Collector config. Traces and logs from every service show up in Buggregator, and the apps stay as they are.
query: otel collector
feature: OpenTelemetry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/opentelemetry.html#opentelemetry-collector
requires: "v2.12.0"
related: [python-opentelemetry-fastapi, node-opentelemetry-traces, sentry-traces-as-waterfall, projects-per-service]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Add an `otlphttp` exporter with `endpoint: http://buggregator:8000` to your OpenTelemetry Collector and put it in your traces and logs pipelines. Traces and logs from every service that reports to the Collector then show up in Buggregator. The apps do not change: only the Collector config does.

## Steps

### 1. Run Buggregator next to the Collector
OTLP comes in on the main HTTP port, 8000. In Docker Compose:

```yaml
services:
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - "127.0.0.1:8000:8000"
```

### 2. Add the exporter
In the Collector config, add `otlphttp` and list it in the pipelines you already have. Keep your receivers, processors and other exporters.

```yaml
exporters:
  otlphttp:
    endpoint: http://buggregator:8000

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlphttp]
    logs:
      receivers: [otlp]
      exporters: [otlphttp]
```

It works with any Collector version. Newer versions also call this exporter `otlp_http` and log a warning about the old name; both work.

### 3. Keep it to traces and logs
Buggregator accepts traces and logs over OTLP/HTTP, as protobuf or JSON. It does not accept metrics or OTLP over gRPC (port 4317), so leave `otlphttp` out of a metrics pipeline.

### 4. Send to a project
By default the data goes to the `default` project. To use another existing project, add a header to the exporter:

```yaml
exporters:
  otlphttp:
    endpoint: http://buggregator:8000
    headers:
      X-Buggregator-Project: shop
```

An unknown project name goes to `default`.

### 5. Open Traces and Logs
Open http://127.0.0.1:8000, then the **Sentry** page. **Traces** has one row per trace, labeled **OTel**, with the services it went through, for example `checkout → payments`. Open a trace to see its spans as a waterfall with a **Service** column. **Logs** lists each log with its level, service and attributes; a log written inside a span links to its trace.

## Why it works
The Collector's `otlphttp` exporter posts to the standard paths `/v1/traces` and `/v1/logs` under the endpoint you give it. Buggregator answers those paths on port 8000 and stores the data next to Sentry SDK traces and logs. `service.name` becomes the service, `service.version` the release, and a span with status `ERROR` is marked as an error.
