---
slug: express-errors-locally
title: Express errors and traces locally with @sentry/node
description: Point @sentry/node at Buggregator and load it before Express. Route errors, request traces and logs of your Express app show up on your machine.
query: sentry node
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/guides/node.html#errors-traces-and-logs-sentry
requires: "v2.9.0"
related: [nodemailer-to-local-inbox, node-opentelemetry-traces, sentry-traces-as-waterfall, nextjs-errors-on-your-machine]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `@sentry/node`, set its DSN to `http://sentry@127.0.0.1:8000/1` and load it before Express. Errors thrown in your routes, a trace of each request and your Sentry logs then show up in Buggregator on your machine, with no Sentry account.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the SDK

```bash
npm install @sentry/node
```

### 3. Create instrument.js
Set the sample rate to `1.0`, or traces are sampled away. In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

```javascript
// instrument.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "http://sentry@127.0.0.1:8000/1",
  tracesSampleRate: 1.0,
  enableLogs: true,
});
```

### 4. Load it before Express
Require it on the first line, before anything else, so the SDK can instrument Express.

```javascript
// app.js
require("./instrument");

const express = require("express");
const Sentry = require("@sentry/node");

const app = express();

app.get("/checkout", () => {
  throw new Error("Checkout failed");
});

app.listen(3000);
```

With `@sentry/node` 11, the Express integration captures route errors by itself. On version 8 to 10, add `Sentry.setupExpressErrorHandler(app)` after your routes. Errors with a 3xx or 4xx status code are skipped.

### 5. Open the error and its trace
Call `http://127.0.0.1:3000/checkout`, then open `http://127.0.0.1:8000`. The error shows its stack trace. On the Sentry page, **Traces** shows the request as a waterfall of spans, and **Logs** shows what you wrote with `Sentry.logger.info()`.

## Why it works
The Sentry SDK sends errors, transactions and logs to the DSN. Buggregator accepts what the official Node SDK sends and stores errors, traces with their spans, and logs. Loading the SDK before Express lets it hook into Express and time each request. It does not store sessions, profiles or replays.
