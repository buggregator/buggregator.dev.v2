---
slug: go-opentelemetry-traces
title: Go service traces with OpenTelemetry, no Jaeger to run
description: Send OTLP/HTTP from your Go service to Buggregator on port 8000. Traces show as a span waterfall and logs link to their trace, on your machine.
query: opentelemetry go
feature: OpenTelemetry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/opentelemetry.html#otel-sdk
requires: "v2.12.0"
related: [go-errors-on-your-machine, otel-collector-one-more-exporter, node-opentelemetry-traces, python-opentelemetry-fastapi]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Use the OTLP/HTTP exporter in your Go service and set `OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000`. Buggregator then shows each trace as a waterfall of spans, with the service name, and logs that link to their trace. One Buggregator container is all you run.

## Steps

### 1. Start Buggregator
OpenTelemetry needs Buggregator 2.12.0 or newer. It takes OTLP over HTTP on the main port 8000, not gRPC.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Set the OTel variables
The exporter adds `/v1/traces` to the endpoint by itself. In Docker Compose, use the Buggregator service name instead of `127.0.0.1`.

```dotenv
OTEL_SERVICE_NAME=checkout
OTEL_EXPORTER_OTLP_ENDPOINT=http://127.0.0.1:8000
OTEL_EXPORTER_OTLP_INSECURE=true
```

### 3. Export traces over HTTP
Use `otlptracehttp`, the HTTP exporter. It reads the variables above.

```go
import (
	"context"
	"log"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

func main() {
	ctx := context.Background()

	exp, err := otlptracehttp.New(ctx)
	if err != nil {
		log.Fatal(err)
	}
	tp := sdktrace.NewTracerProvider(sdktrace.WithBatcher(exp))
	defer tp.Shutdown(ctx)
	otel.SetTracerProvider(tp)

	ctx, span := otel.Tracer("checkout").Start(ctx, "POST /checkout")
	// your code
	span.End()
}
```

### 4. Send logs too, if you want them
The logs exporter `otlploghttp` reads the same endpoint and adds `/v1/logs`. Pass its provider to the `otelslog` bridge and log with `slog`. The OpenTelemetry project marks the Go logs exporter as experimental.

```go
import (
	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploghttp"
	sdklog "go.opentelemetry.io/otel/sdk/log"
)

logExp, err := otlploghttp.New(ctx)
if err != nil {
	log.Fatal(err)
}
lp := sdklog.NewLoggerProvider(sdklog.WithProcessor(sdklog.NewBatchProcessor(logExp)))
defer lp.Shutdown(ctx)

logger := otelslog.NewLogger("checkout", otelslog.WithLoggerProvider(lp))
logger.InfoContext(ctx, "order paid")
```

### 5. Open the trace
Open the Sentry page at http://127.0.0.1:8000 and pick **Traces**. The trace is marked **OTel**, with the services it went through. Open it to see its spans as a waterfall, with a **Service** column. Logs are on the **Logs** tab.

## Why it works
Buggregator answers the standard OTLP paths `/v1/traces` and `/v1/logs` on port 8000, in protobuf or JSON. `service.name` becomes the service in the UI, and a span with status `ERROR` is marked as an error. The data sits next to your Sentry errors, dumps and emails.
