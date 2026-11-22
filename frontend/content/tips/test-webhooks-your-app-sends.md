---
slug: test-webhooks-your-app-sends
title: Test the webhooks your app sends, on your machine
description: Point your app's webhook URL at Buggregator with http-dump as the user name. See each webhook's headers, signature and body, and send it again with cURL.
query: webhook tester
feature: HTTP
feature_page: /features/http-dumps
docs: https://docs.buggregator.dev/config/http-dumps.html#use-cases
requires: null
related: [webhook-payload-before-the-handler, replay-a-captured-request, mock-a-third-party-api, local-request-bin]
checked: { date: 2026-11-22, version: v2.13.0 }
---
When your app is the one that sends webhooks, set the subscriber URL to `http://http-dump@127.0.0.1:8000/webhooks/orders`. Every webhook your app fires then lands in Buggregator: method, URL, all headers including the signature header, and the body. Each one comes with a cURL command, so you can send it again to a receiver you are building.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Use Buggregator as the subscriber URL
Register this URL wherever your app stores webhook endpoints: a test subscriber, a seed, a config value. `http-dump` as the user name marks the request for Buggregator. The path is yours to choose. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator`.

```text
http://http-dump@127.0.0.1:8000/webhooks/orders
```

If your HTTP client drops the user name from URLs, send the header `X-Buggregator-Event: http-dump` instead.

### 3. Fire one and read it
Trigger the event in your app, for example create an order. Open http://127.0.0.1:8000. The request shows its method, full URI, query parameters, headers, cookies and body. Check the event name, the timestamp header and the signature header your app adds.

### 4. Check the signature
Copy the raw body and recompute the signature the way your receivers will. For an HMAC-SHA256 hex signature:

```bash
printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET"
```

The result must equal the value in your signature header.

### 5. Send it again
Every captured request has a cURL command with a copy button. Change the URL in it to your receiver's address and run it: the same headers and body arrive there.

### 6. Test your retries
Point the subscriber URL at the mock server and make a rule that answers `500`. Your app gets the error, and each retry shows up as a new request with its time.

```bash
curl -X POST http://127.0.0.1:8000/api/mocks \
  -H 'Content-Type: application/json' \
  -d '{"method": "POST", "path": "/webhooks/orders", "status": 500}'
# then use http://127.0.0.1:8000/mock/webhooks/orders as the subscriber URL
```

## Why it works
Buggregator stores any request marked with `http-dump`, by user name, Basic Auth or header, and answers it with `200`. So your app sees a successful delivery while you read exactly what it sent. Nothing leaves your machine, and the webhook never reaches a real customer endpoint.
