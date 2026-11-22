---
slug: local-request-bin
title: A private request bin on your machine
description: Send any request to Buggregator with http-dump in the URL. Method, headers, body and files are stored on your machine, offline, with a cURL to replay.
query: request bin
feature: HTTP
feature_page: /features/http-dumps
docs: https://docs.buggregator.dev/config/http-dumps.html#configuration
requires: null
related: [webhook-payload-before-the-handler, replay-a-captured-request, test-webhooks-your-app-sends]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Run Buggregator and send requests to `http://http-dump@127.0.0.1:8000/<any path>`. Each one is caught whole: method, URL, query, headers, cookies, body and uploaded files, plus a cURL command to send it again. It all stays on your machine and works without internet, so tokens and customer data in the payload go nowhere.

## Steps

### 1. Start Buggregator
Bind the port to 127.0.0.1, so only your machine can reach the bin.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Send a request to any path
`http-dump` as the URL user name marks the request. Any method and any path work.

```bash
curl -X POST 'http://http-dump@127.0.0.1:8000/orders/42?source=test' \
  -H 'Content-Type: application/json' \
  -d '{"status": "paid"}'
```

Buggregator answers `200` with `{"status":true}`.

### 3. Or mark it with a header
When the sender cannot put a user name in the URL but can set a header:

```bash
curl 'http://127.0.0.1:8000/orders/42' \
  --header 'X-Buggregator-Event: http-dump'
```

### 4. Read the requests
Open http://127.0.0.1:8000. Each request shows its method, full URI, query parameters, form data, headers, cookies and uploaded files, which you can download. The cURL command has a copy button.

### 5. Keep the bin across restarts
By default the bin lives in memory and is empty after a restart. Give Buggregator a database file to keep it. This setting is for Buggregator itself.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -e DATABASE_DSN=/data/buggregator.db \
  -v buggregator-data:/data \
  ghcr.io/buggregator/server:latest
```

### 6. Empty it

```bash
curl -X DELETE http://127.0.0.1:8000/api/events \
  -H 'Content-Type: application/json' -d '{"type": "http-dump"}'
```

## Why it works
Buggregator treats any request marked with `http-dump`, by URL user name, Basic Auth or header, as a dump and stores it in its own SQLite database. There is no account and no public URL, so nothing is sent anywhere. In Docker Compose, other services reach the same bin at `http://http-dump@buggregator:8000/...`.
