---
slug: sentry-user-feedback-widget
title: Test the Sentry feedback widget before users see it
description: Point the Sentry browser SDK at Buggregator and send feedback from the widget or captureFeedback. Name, email and message show on the error.
query: sentry user feedback
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#user-feedback
requires: "v2.13.0"
related: [react-errors-locally, sentry-breadcrumbs-before-the-error, nextjs-errors-on-your-machine, desktop-notification-new-error]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Point the Sentry browser SDK at Buggregator and add the feedback widget. Every feedback you send while testing lands in Buggregator, not in a real Sentry project. Pass the error's event ID as `associatedEventId`, and the name, email and message show on the page of the error they belong to.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Add the widget and point the DSN at Buggregator
Any key before `@` works. The number at the end puts the data into the `default` project. No CORS setup is needed.

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "http://sentry@127.0.0.1:8000/1",
  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: "system",
    }),
  ],
});
```

### 3. Tie feedback to an error
Feedback from the widget is not linked to an error by itself. To test feedback on an error, send it with `captureFeedback` and the ID of the error.

```javascript
const eventId = Sentry.captureException(new Error('Checkout failed'))

Sentry.captureFeedback({
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'The pay button did nothing',
  associatedEventId: eventId,
})
```

### 4. Read it in Buggregator
Open `http://127.0.0.1:8000`. On the error's page, above the tabs, you see the name, email, message, page URL and time. The **Feedback** tab on the Sentry page lists all feedback, also the feedback sent from the widget without an error.

Screenshots attached to feedback are not stored.

## Why it works
The Sentry SDK sends feedback to the DSN like any other event. Buggregator keeps it and links it to the error whose ID is in `associatedEventId`. Feedback makes no card of its own in the event feed. You can also read it over the API: `GET /api/sentry/feedback`.
