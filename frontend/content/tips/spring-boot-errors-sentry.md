---
slug: spring-boot-errors-sentry
title: Spring Boot errors through the Sentry Java SDK, locally
description: Add the Sentry Spring Boot starter and point sentry.dsn at Buggregator. Exceptions, traces and logs of your app show up on your machine.
query: sentry spring boot
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/guides/spring-boot.html#errors-traces-and-logs-sentry
requires: "v2.10.0"
related: [spring-boot-mail-local, sentry-traces-as-waterfall, sentry-logs-on-your-machine, java-opentelemetry-agent]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Add the Sentry starter for your Spring Boot version and set `sentry.dsn=http://sentry@buggregator:8000/1` in a local profile. Exceptions, traces and logs from the Sentry Java SDK then land in Buggregator on your machine, with stack traces and the trace waterfall. No Sentry account is needed.

## Steps

### 1. Add Buggregator to your Compose file
Under `services:` in `docker-compose.yml` or `compose.yaml`. Your app container reaches it by the service name `buggregator`.

```yaml
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - "127.0.0.1:8000:8000"
```

If the app runs on your machine (`./mvnw spring-boot:run` or your IDE), use `127.0.0.1` instead of `buggregator` below.

### 2. Add the Sentry starter
Pick the artifact for your Spring Boot version. Use the same version as the Sentry SDK.

| Spring Boot | Artifact |
|-------------|----------|
| 4.x | `io.sentry:sentry-spring-boot-4-starter` |
| 3.x | `io.sentry:sentry-spring-boot-starter-jakarta` |

### 3. Point it at Buggregator
Put these lines in a local profile, for example `application-local.properties`, so they never reach production. The sample rate of 1.0 sends every trace.

```properties
sentry.dsn=http://sentry@buggregator:8000/1
sentry.traces-sample-rate=1.0
sentry.logs.enabled=true
```

### 4. Send one error and one log
Call the SDK once, for example from a test endpoint or a `CommandLineRunner`.

```java
Sentry.logger().info("Hello from Spring Boot");
Sentry.captureException(new IllegalStateException("Check error"));
```

Open `http://127.0.0.1:8000`. The error «Check error» shows with its stack trace. The log is on the Sentry page, **Logs** tab. Traces are on the **Traces** tab.

## Why it works
The Sentry Java SDK sends its data to the host in the DSN. Buggregator accepts the Sentry protocol on port 8000 and stores errors, transactions and logs instead of forwarding them. The Java SDK 8.64 (`io.sentry:sentry`) was checked against Buggregator 2.10.0: errors, transactions and logs arrive. The Spring Boot starter is built on that SDK.
