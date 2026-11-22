---
slug: stripe-cli-forward-to-buggregator
title: Stripe CLI webhooks, seen before your handler runs
description: Run stripe listen with --forward-to pointing at Buggregator. Each test webhook shows its JSON payload, the Stripe-Signature header and a cURL command.
query: stripe cli
feature: HTTP
feature_page: /features/http-dumps
docs: https://docs.buggregator.dev/guides/node.html#webhooks-stripe-github
requires: null
related: [webhook-payload-before-the-handler, replay-a-captured-request, laravel-see-outgoing-api-calls]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Run `stripe listen --forward-to http://127.0.0.1:8000/stripe`. The Stripe CLI then sends every test webhook to Buggregator instead of your app. You see the JSON payload, every header including `Stripe-Signature`, and a cURL command to send the same request again. Your handler does not run until you point it there.

## Steps

### 1. Start Buggregator
Port 8000 is the web UI and also takes HTTP requests.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Forward the Stripe CLI to Buggregator
Pick any path, for example `/stripe`. Buggregator stores any `POST` or `PUT` that is not Sentry or another known format as an HTTP dump, so no special URL is needed.

```bash
stripe listen --forward-to http://127.0.0.1:8000/stripe
```

Leave it running. It prints the webhook signing secret (`whsec_…`) for this session.

### 3. Send a test event
In a second terminal, ask Stripe for an event.

```bash
stripe trigger payment_intent.succeeded
```

### 4. Read the webhook
Open http://127.0.0.1:8000. Each webhook is one HTTP dump: the method, the path, the JSON body as POST data, and all headers, including `Stripe-Signature`. Buggregator answers `200`, so the CLI shows each delivery as accepted.

### 5. Send it to your handler when you are ready
Copy the cURL command from the dump and change the URL to your app's webhook route. Or restart the CLI with `--forward-to` pointing at your app.

```bash
stripe listen --forward-to http://127.0.0.1:3000/stripe/webhook
```

The signature includes a timestamp. Stripe's libraries reject an old one by default, so a replayed copy can fail the signature check in your handler.

## Why it works
Buggregator treats a `POST` it does not recognise as an HTTP dump and stores it whole. The Stripe CLI receives events from Stripe over its own connection and posts them to the local URL you give it, so Stripe never needs to reach your machine.
