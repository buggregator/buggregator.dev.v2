---
slug: mock-a-third-party-api
title: Stand in for a third-party API your app calls
description: Point your app's API base URL at Buggregator's /mock and describe each answer once. Tests and dev get local responses, and every call is logged.
query: mock api
feature: Mock server
feature_page: /features/mock-server
docs: https://docs.buggregator.dev/config/mock-server.html#use-cases
requires: "v2.6.0"
related: [mock-api-from-openapi-spec, mock-api-with-fake-data, laravel-see-outgoing-api-calls, test-webhooks-your-app-sends]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Set your app's base URL for the outside API to `http://127.0.0.1:8000/mock` and add one Buggregator mock rule per call: method and path in, status, headers and body out. Your app then gets your answers instead of the vendor's sandbox. Every call is stored with what the app sent and what came back, so you also see the request your code builds.

## Steps

### 1. Write the rules in buggregator.yaml
Rule paths have no `/mock` prefix. `{id}` matches one path segment. This file is for Buggregator, not for your app.

```yaml
# buggregator.yaml
mocks:
  - name: create charge
    method: POST
    path: /v1/charges
    status: 201
    headers: { Content-Type: application/json }
    body: '{"id": "ch_1", "status": "succeeded"}'
  - name: get charge
    method: GET
    path: /v1/charges/{id}
    headers: { Content-Type: application/json }
    body: '{"id": "ch_1", "status": "succeeded"}'
```

### 2. Start Buggregator with the file
Buggregator reads `buggregator.yaml` from the folder it starts in. In the image that is `/`.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -v ./buggregator.yaml:/buggregator.yaml \
  ghcr.io/buggregator/server:latest
```

### 3. Change the base URL in your app
Use whatever setting your API client reads for its base URL. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator`.

```dotenv
# your app's .env
PAYMENTS_API_URL=http://127.0.0.1:8000/mock
```

Check one rule by hand:

```bash
curl -X POST http://127.0.0.1:8000/mock/v1/charges
# {"id": "ch_1", "status": "succeeded"}
```

### 4. Add failures and slow answers
Make a rule that answers `500` or `429` to see how your app handles errors. `delay` (up to 30s) tests timeouts. Add rules from a script or a test through the REST API:

```bash
curl -X POST http://127.0.0.1:8000/api/mocks \
  -H 'Content-Type: application/json' \
  -d '{"method": "POST", "path": "/v1/refunds", "status": 429, "body": "{\"error\": \"rate limited\"}", "delay_ms": 2000}'
```

### 5. Read what your app sent
Open http://127.0.0.1:8000, then **Mock server**. On the left are the rules in match order, on the right the calls, live. Click a call to see the request and the response that was sent. A call with no rule gets `404` with `{"error": "no mock rule matched ..."}`, and its details list the rules that almost matched and why.

## Why it works
Buggregator answers every request under `/mock/` with the first enabled rule that matches its method and path. Rules from `buggregator.yaml` come first and stay the same on every start, which suits CI. Each call is also stored as an HTTP dump, so the request your code built sits next to your logs and exceptions.
