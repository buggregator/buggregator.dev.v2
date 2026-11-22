---
slug: nextjs-errors-on-your-machine
title: Next.js errors and traces on your machine, Sentry SDK as is
description: Keep @sentry/nextjs and point its DSN at Buggregator. Client and server errors and traces of your Next.js app show up locally, no Sentry account.
query: sentry nextjs
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/guides/frontend.html#nuxt-and-next-js
requires: "v2.9.0"
related: [react-errors-locally, express-errors-locally, sentry-traces-as-waterfall, sentry-logs-on-your-machine]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Keep the `@sentry/nextjs` setup you have and set the DSN in each `Sentry.init` call to `http://sentry@127.0.0.1:8000/1`. Errors from the browser and from the server side of your Next.js app then show up in Buggregator, with stack traces and breadcrumbs. Set `tracesSampleRate: 1.0` and the traces come too. No Sentry account is needed.

## Steps

### 1. Start Buggregator
```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Set the DSN in every config
`@sentry/nextjs` has a client config (`instrumentation-client.ts`), a server config (`sentry.server.config.ts`) and an edge config (`sentry.edge.config.ts`). Set the same options in each:

```javascript
Sentry.init({
  dsn: "http://sentry@127.0.0.1:8000/1",
  tracesSampleRate: 1.0,
  enableLogs: true,
});
```

`tracesSampleRate: 1.0` sends every trace. With a lower rate, traces are sampled away and never sent.

### 3. Pick the right host
The client config runs in your browser, so it always uses `127.0.0.1`. The server config uses `127.0.0.1` when you run `npm run dev` on your machine. If the Next.js server runs in a Docker Compose container, its server config uses the service name instead:

```javascript
dsn: "http://sentry@buggregator:8000/1",
```

### 4. Throw an error and look
Open http://127.0.0.1:8000, then open your app and run this in the browser console:

```javascript
setTimeout(() => { throw new Error("Check error"); });
```

You see a Sentry error «Check error». On the Sentry page, the **Traces** tab shows the page load as a trace.

## Why it works
`@sentry/nextjs` is built on Sentry's browser and Node.js SDKs, and Buggregator accepts the same protocol they send to Sentry. The DSN tells the SDK where to send; the number at the end puts events into the `default` project. No CORS setup is needed: Buggregator accepts requests from any origin by default.
