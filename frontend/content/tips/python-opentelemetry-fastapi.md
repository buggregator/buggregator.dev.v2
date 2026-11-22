---
slug: python-opentelemetry-fastapi
title: FastAPI traces with OpenTelemetry, shown as a waterfall
description: Run FastAPI under opentelemetry-instrument and point the standard OTEL_ env vars at Buggregator. Each request's spans show up as a local waterfall.
query: opentelemetry python
feature: OpenTelemetry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/opentelemetry.html#otel-sdk
requires: "v2.12.0"
related: [otel-collector-one-more-exporter, django-errors-and-traces, sentry-traces-as-waterfall, python-requests-through-debug-proxy]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install the OpenTelemetry Python distro, set `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000` and `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`, and start your FastAPI app with `opentelemetry-instrument`. Each request then shows up in Buggregator as a trace, with its spans on a waterfall. Your app code does not change.

## Steps

### 1. Start Buggregator
OTLP comes in on the main HTTP port, 8000.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the OpenTelemetry packages
`opentelemetry-bootstrap` adds the instrumentation for the libraries it finds, FastAPI among them.

```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp
opentelemetry-bootstrap -a install
```

### 3. Set the standard variables
`OTEL_EXPORTER_OTLP_PROTOCOL` must be `http/protobuf` or `http/json`: Buggregator does not accept gRPC. It does not take metrics either, so turn the metrics exporter off.

```dotenv
OTEL_SERVICE_NAME=checkout
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=none
```

In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 4. Start the app under opentelemetry-instrument
```bash
opentelemetry-instrument uvicorn main:app
```

### 5. Open the trace
Call an endpoint, then open http://127.0.0.1:8000 and the **Sentry** page, **Traces** tab. The trace is labeled **OTel** and shows your service name. Open it to see each span on a timeline, with a **Service** column. A span with status `ERROR` is marked as an error.

## Why it works
`opentelemetry-instrument` sets up the OTel SDK and the FastAPI instrumentation before your app starts. The OTLP exporter adds `/v1/traces` to the endpoint and posts each batch of spans there. Buggregator answers that path on port 8000 and shows the spans next to traces from Sentry SDKs. `OTEL_SERVICE_NAME` is what the UI shows as the service.
