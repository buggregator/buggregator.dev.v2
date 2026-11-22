---
slug: go-errors-on-your-machine
title: Go errors from sentry-go on your machine
description: Set the sentry-go DSN to Buggregator. Errors and panics from your Go service show up locally with their stack traces, and nothing goes to the cloud.
query: sentry go
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#go
requires: "v2.9.0"
related: [go-opentelemetry-traces, go-http-client-proxy, sentry-breadcrumbs-before-the-error, sentry-traces-as-waterfall]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Set the `sentry-go` DSN to `http://sentry@127.0.0.1:8000/1`. Errors you capture and panics you recover then show up in Buggregator on your machine, each with its stack trace. The DSN is the only change: your `sentry.CaptureException` calls stay as they are.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Init the SDK with Buggregator's DSN
The number at the end puts events into the `default` project, which the UI shows from the start. In Docker Compose, use the Buggregator service name instead of `127.0.0.1`.

```bash
go get github.com/getsentry/sentry-go
```

```go
err := sentry.Init(sentry.ClientOptions{
    Dsn:              "http://sentry@127.0.0.1:8000/1",
    EnableTracing:    true,
    TracesSampleRate: 1.0,
})
if err != nil {
    log.Fatal(err)
}
defer sentry.Flush(2 * time.Second)
```

Leave `Dsn` empty and the SDK reads `SENTRY_DSN` from the environment instead.

### 3. Send errors and panics
Capture an error where you handle it. Recover a panic with a deferred call.

```go
if err := chargeCard(order); err != nil {
    sentry.CaptureException(err)
}

func worker() {
    defer sentry.Recover()
    // code that may panic
}
```

### 4. Catch panics in HTTP handlers
For `net/http`, wrap handlers with the `sentryhttp` package.

```go
import sentryhttp "github.com/getsentry/sentry-go/http"

sentryHandler := sentryhttp.New(sentryhttp.Options{Repanic: true})
http.HandleFunc("/checkout", sentryHandler.HandleFunc(checkout))
```

### 5. Open the error
Trigger it, then open http://127.0.0.1:8000. The error shows its message and the stack trace frame by frame. With tracing on, the request's trace is on the Sentry page, **Traces** tab.

## Why it works
Buggregator accepts the Sentry protocol, and it was tested with real requests from `sentry-go` 0.50. It stores errors, messages, transactions and logs. `sentry.Flush` waits until queued events are sent, so a short-lived program does not exit before they leave.
