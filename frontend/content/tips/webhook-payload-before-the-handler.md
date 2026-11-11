---
slug: webhook-payload-before-the-handler
title: See a webhook's payload before you write the handler
description: Point the webhook URL at Buggregator with http-dump in the URL. See the headers, body and files it sends, plus a cURL command to send it again.
query: webhook payload
feature: HTTP
feature_page: /features/http-dumps
docs: https://docs.buggregator.dev/config/http-dumps.html#using-http-auth
requires: null
related: [replay-a-captured-request, laravel-see-outgoing-api-calls, python-requests-through-debug-proxy]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Set the webhook URL to Buggregator with `http-dump` as the user name, for example `http://http-dump@127.0.0.1:8000/webhooks/orders`. Each delivery shows the full webhook payload: method, URL, headers, cookies, form data, uploaded files, and a cURL command to send it again. You see exactly what arrives before you write the handler.

## Steps

### 1. Point the webhook at Buggregator
Buggregator takes HTTP events on port 8000, the same port as the UI. Use `http-dump` as the URL user name. The path is yours to choose. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator`.
```dotenv
# Your app sends webhooks or callbacks to this URL during development
WEBHOOK_URL=http://http-dump@127.0.0.1:8000/webhooks/orders
```

### 2. Check it with a test request
Before you wait for a real delivery, send one yourself.
```bash
curl 'http://http-dump@127.0.0.1:8000/any/path?foo=bar'
```

### 3. Or mark it with a header
If the sender cannot put a user name in the URL but can set a header, use `X-Buggregator-Event` instead.
```bash
curl 'http://127.0.0.1:8000/any/path?foo=bar' \
  --header 'X-Buggregator-Event: http-dump'
```

### 4. Read the payload
Open `http://127.0.0.1:8000`. The request shows its method, full URI, query parameters, form data, headers, cookies and uploaded files, which you can download. Search finds requests by host, method or URL.

![A captured webhook in Buggregator: the JSON body, query parameters and post data.](/img/tips/webhook-payload-before-the-handler.webp)

## Why it works
Buggregator treats any HTTP request marked with `http-dump`, by user name or header, as a dump and stores it whole. A third-party service on the internet can only reach Buggregator at a public address, so a service in the cloud cannot call your laptop's 127.0.0.1. When you need the response from a real server too, use the HTTP proxy instead.
