---
slug: node-opentelemetry-traces
title: Node.js OpenTelemetry traces with no code changes
description: Run your Node service with OpenTelemetry auto-instrumentation and point OTLP at Buggregator. Each request shows as a waterfall of spans locally.
query: opentelemetry nodejs
feature: OpenTelemetry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/opentelemetry.html#otel-sdk
requires: "v2.12.0"
related: [otel-collector-one-more-exporter, express-errors-locally, python-opentelemetry-fastapi, go-opentelemetry-traces]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `@opentelemetry/auto-instrumentations-node`, start your app with `--require @opentelemetry/auto-instrumentations-node/register`, and set `OTEL_SERVICE_NAME` and `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000`. Your Node service's traces then show up in Buggregator as a waterfall of spans, with no Jaeger, Grafana or cloud account.

## Steps

### 1. Start Buggregator
OTLP over HTTP uses the main port, 8000. There is no gRPC port.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the auto-instrumentation

```bash
npm install --save @opentelemetry/api
npm install --save @opentelemetry/auto-instrumentations-node
```

### 3. Set the OTel variables
The service name is what the UI shows in the **Service** column. Set the protocol to `http/protobuf` or `http/json`: Buggregator does not accept `grpc`. In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

```dotenv
OTEL_SERVICE_NAME=checkout
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

### 4. Start the app with the register hook
Your code stays as it is.

```bash
node --require @opentelemetry/auto-instrumentations-node/register app.js
```

### 5. Open Sentry, then Traces
Call a few endpoints of your service. Open `http://127.0.0.1:8000`, the Sentry page, **Traces**. Each trace has an **OTel** label and the services it went through. Open one to see its spans as a waterfall with a **Service** column. A span with status `ERROR` is marked as an error.

## Why it works
The auto-instrumentation package hooks into common Node libraries, such as the HTTP server and clients, and creates spans without code changes. The OTel SDK exports them over OTLP to the endpoint you set, adding `/v1/traces`. Buggregator accepts OTLP over HTTP on its main port and shows the traces next to your Sentry data. OTel data creates no cards in the main event feed.
