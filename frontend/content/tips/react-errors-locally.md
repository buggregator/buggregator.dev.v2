---
slug: react-errors-locally
title: React errors with the component stack, on your machine
description: Point @sentry/react at Buggregator and wrap your app in its ErrorBoundary. Errors arrive with the stack trace and the component stack. No CORS setup.
query: sentry react
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/guides/frontend.html#_3-set-up-the-sdk
requires: "v2.9.0"
related: [nextjs-errors-on-your-machine, express-errors-locally, sentry-breadcrumbs-before-the-error, sentry-traces-as-waterfall]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install `@sentry/react`, set the DSN to `http://sentry@127.0.0.1:8000/1`, and wrap your app in `Sentry.ErrorBoundary`. A React error then shows up in Buggregator on your machine, with its stack trace and, linked to it, the component stack. The browser sends it straight to Buggregator: no CORS setup, no Sentry account.

## Steps

### 1. Start Buggregator
Your React code runs in the browser, so the browser must reach port 8000.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install the SDK

```bash
npm install @sentry/react --save
```

### 3. Init Sentry before the app
Put this in `instrument.js`. Use `127.0.0.1`, not a Docker Compose service name: the browser cannot resolve service names.

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "http://sentry@127.0.0.1:8000/1",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  enableLogs: true,
});
```

Import it first in `main.jsx`.

```jsx
import "./instrument";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
```

### 4. Catch render errors with the component stack
Wrap the part of the tree you care about. With React 17 or newer, the SDK attaches the component stack to the error it reports.

```jsx
import * as Sentry from "@sentry/react";

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Dashboard />
    </Sentry.ErrorBoundary>
  );
}
```

On React 19, also report errors outside boundaries from `createRoot`:

```jsx
createRoot(document.getElementById("root"), {
  onUncaughtError: Sentry.reactErrorHandler(),
  onCaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler(),
}).render(<App />);
```

### 5. Throw and look
Make a component throw while rendering, then open http://127.0.0.1:8000. The error's **Exceptions** tab shows the error with its stack trace and, as a second linked entry, the component stack. Breadcrumbs show the clicks and requests before it. The page load shows up on the Sentry page, **Traces** tab.

## Why it works
Buggregator accepts the Sentry protocol, and by default it accepts requests from any origin, so the browser SDK can post to it directly. The SDK sends the component stack as a linked error, and Buggregator shows every error in the chain.
