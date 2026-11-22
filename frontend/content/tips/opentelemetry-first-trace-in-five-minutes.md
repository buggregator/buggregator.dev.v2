---
slug: opentelemetry-first-trace-in-five-minutes
title: Your first OpenTelemetry trace in five minutes
description: Start Buggregator, send one span with curl, and open it as a waterfall. Then point any OTel SDK at port 8000 with three environment variables.
query: opentelemetry tutorial
feature: OpenTelemetry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/opentelemetry.html#try-it-with-curl
requires: "v2.12.0"
related: [node-opentelemetry-traces, python-opentelemetry-fastapi, php-opentelemetry-traces, otel-collector-one-more-exporter]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Start Buggregator, send one span to `http://127.0.0.1:8000/v1/traces` with curl, and open **Sentry → Traces**. You see your first OpenTelemetry trace as a waterfall, with no collector and no account. Then point your real app at the same address with three standard OTel variables: `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_PROTOCOL`.

## Steps

### 1. Start Buggregator
Traces arrive on the HTTP port 8000, the same port as the UI.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Send one span with curl
This is OTLP as JSON: one span named `POST /checkout` from the service `checkout`, starting now and lasting 150 ms.

```bash
start=$(date +%s)000000000
end=$(date +%s)150000000
curl -X POST http://127.0.0.1:8000/v1/traces \
  -H 'Content-Type: application/json' \
  -d '{"resourceSpans":[{"resource":{"attributes":[{"key":"service.name","value":{"stringValue":"checkout"}}]},
  "scopeSpans":[{"spans":[{"traceId":"5b8efff798038103d269b633813fc60c","spanId":"eee19b7ec3c1b174",
  "name":"POST /checkout","kind":2,"startTimeUnixNano":"'$start'","endTimeUnixNano":"'$end'"}]}]}]}'
# {}
```

### 3. Open the trace
Open http://127.0.0.1:8000, then **Sentry → Traces**. The trace `POST /checkout` is there, marked **OTel**, with the service `checkout`. Open it to see its spans as a waterfall with a **Service** column.

### 4. Point your app at Buggregator
Set the standard OTel variables in your app's environment. They work with the OTel SDK of any language.

```dotenv
OTEL_SERVICE_NAME=checkout
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

The protocol must be `http/protobuf` or `http/json`. Some SDKs default to `grpc`, which Buggregator does not accept. In Docker Compose, use the Buggregator service name in place of `127.0.0.1`.

### 5. Send logs too
When your SDK exports logs over OTLP, the same endpoint setting sends them to `/v1/logs`. They show in **Sentry → Logs** with their level and service. A log written inside a span links to its trace.

## Why it works
OTLP over HTTP is the protocol OTel SDKs and the Collector use to send data. Buggregator accepts it on port 8000 at `/v1/traces` and `/v1/logs`, as protobuf or JSON. It maps `service.name` to the service, `service.version` to the release, and a span with status `ERROR` to an error.
