---
slug: java-opentelemetry-agent
title: Spring Boot traces from the OpenTelemetry Java agent
description: Attach the OpenTelemetry Java agent and point its OTLP endpoint at Buggregator. Each Spring Boot request shows as a span waterfall. No code changes.
query: opentelemetry java agent
feature: OpenTelemetry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/opentelemetry.html#otel-sdk
requires: "v2.12.0"
related: [spring-boot-errors-sentry, otel-collector-one-more-exporter, sentry-traces-as-waterfall, spring-boot-mail-local]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Start your Spring Boot app with the OpenTelemetry Java agent and set `OTEL_SERVICE_NAME`, `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000` and `OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf`. Each request then shows up in Buggregator as a trace, with its spans on a timeline. You change no code. Turn the metrics exporter off, because Buggregator takes traces and logs only.

## Steps

### 1. Start Buggregator
OpenTelemetry needs Buggregator 2.12.0 or newer. It takes OTLP over HTTP on the main port 8000.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Download the agent

```bash
curl -L -O https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar
```

### 3. Point the agent at Buggregator
Set these in the app's environment. The service name is what the UI shows in the **Service** column. In Docker Compose, use the Buggregator service name instead of `127.0.0.1`.

```dotenv
OTEL_SERVICE_NAME=checkout
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
OTEL_METRICS_EXPORTER=none
```

The protocol must be `http/protobuf` or `http/json`. Buggregator does not accept OTLP over gRPC.

### 4. Run the app with the agent

```bash
java -javaagent:./opentelemetry-javaagent.jar -jar target/app.jar
```

Started from Maven, your IDE or a container? Put the same flag in `JAVA_TOOL_OPTIONS` instead.

```bash
JAVA_TOOL_OPTIONS="-javaagent:./opentelemetry-javaagent.jar" ./mvnw spring-boot:run
```

### 5. Open the trace
Call an endpoint, then open the Sentry page at http://127.0.0.1:8000 and pick **Traces**. The trace is marked **OTel** and lists the services it went through. Open it to see its spans as a waterfall. Since agent 2.0 the OTLP logs exporter is on by default, so the log records it captures land on the **Logs** tab and link to their trace.

## Why it works
The agent instruments the libraries your app uses when the JVM starts and sends spans over OTLP. Buggregator answers the standard paths `/v1/traces` and `/v1/logs` on port 8000 and shows the data next to your Sentry errors. A failed span is marked as an error.
