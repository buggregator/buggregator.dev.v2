---
slug: desktop-notification-new-error
title: A desktop notification for each new error
description: Turn on desktop notifications in Buggregator's settings. Each new Sentry error pops up while the tab is in the background; bursts come as one notice.
query: browser notifications
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#desktop-notifications
requires: "v2.13.0"
related: [sentry-breadcrumbs-before-the-error, sentry-traces-as-waterfall, laravel-errors-without-sentry-account, sentry-user-feedback-widget]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Open Buggregator at `http://localhost:8000` and turn on **Settings › Notifications › Desktop notifications**. Each new Sentry error from your app then shows a system notification while you work in another window. Several errors within 10 seconds come as one notice, and a click opens the error.

## Steps

### 1. Start Buggregator on your machine
Notifications work only when the page is https or `localhost`, so bind the port to your machine.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Open it as localhost
Open `http://localhost:8000`. A LAN address or a host name such as `http://buggregator:8000` over plain http does not get notifications.

### 3. Turn notifications on
Go to **Settings › Notifications** and switch on **Desktop notifications**. The browser asks for permission once and shows a test notice.

### 4. Send an error and switch away
Point your app's Sentry DSN at Buggregator, for example:

```dotenv
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
```

Keep the Buggregator tab open and go back to your editor. When the app throws an exception, or logs a message at level error or fatal, a notice pops up. Three errors close together come as «3 new errors». Click the notice to open the error.

### 5. Add an app icon badge if you like
Install Buggregator as an app from the install icon in the address bar of Chrome or Edge. While its window is in the background, the app icon shows how many new events of the current project arrived. The badge works on Windows and macOS.

## Why it works
The page listens for new events over WebSocket and uses the browser's notification permission. It notifies only while no Buggregator tab is in front of you, and with several tabs open only one of them notifies. The tab must stay open: a closed tab shows nothing. Chrome on Android does not show notifications from a page.
