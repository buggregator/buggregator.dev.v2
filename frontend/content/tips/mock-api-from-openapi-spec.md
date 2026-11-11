---
slug: mock-api-from-openapi-spec
title: A working mock API from your OpenAPI spec
description: Import an OpenAPI 3 spec into Buggregator. Every operation becomes a mock rule with the spec's example or fake data, served under /mock.
query: open api mock server
feature: Mock server
feature_page: /features/mock-server
docs: https://docs.buggregator.dev/config/mock-server.html#import-an-openapi-spec
requires: v2.6.0
related: [mock-api-with-fake-data, laravel-see-outgoing-api-calls, replay-a-captured-request]
checked: { date: 2026-11-10, version: v2.8.0 }
---
To get an OpenAPI mock server while the backend is not ready, send your spec to `POST /api/mocks/import/openapi`. Buggregator makes one mock rule per operation, with the spec's example as the body or fake data built from the schema, and your app calls it under `http://127.0.0.1:8000/mock`.

## Steps

### 1. Import the spec
Send the spec text, YAML or JSON. OpenAPI 3.0 and 3.1 work; Swagger 2.0 is refused, so convert it to OpenAPI 3 first. You can send the spec's `url` instead of its text.
```bash
curl -X POST http://127.0.0.1:8000/api/mocks/import/openapi \
  -H 'Content-Type: application/json' \
  -d "$(jq -n --rawfile spec shop.yaml '{spec: $spec}')"
```

### 2. Check how the rules were built
Each operation gets the lowest 2xx status it defines. An operation with an example answers with it as is. One without an example gets a template with fake data from its schema. The path of `servers[0].url` goes in front, so `https://api.example.com/v1` with `/users/{id}` becomes `/v1/users/{id}`.

![Mock rules imported from an OpenAPI spec, one per operation, next to the requests they answered.](/img/tips/mock-api-from-openapi-spec.webp)

### 3. Call the mock
Point your app at `/mock` instead of the real base URL. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator`.
```bash
curl http://127.0.0.1:8000/mock/v1/users/42
# {"id": 42, "name": "Alden Vaughn", "email": "troy-hart@ramirez.net", "status": "active"}
curl -X POST http://127.0.0.1:8000/mock/v1/orders
# {"id": 1001, "status": "pending"}   (status 201)
```

### 4. Import again when the spec changes
Import into the same group again, and the group's old rules are replaced. The rules are ordinary rules, so you can also edit them one by one.

### 5. Or load the spec at startup
For CI, list the spec in `buggregator.yaml`. These rules are read-only. With `project: shop` and no `group`, the group is named `openapi:shop:<info.title>`.
```yaml
mocks_openapi:
  - file: ./shop.yaml
    project: shop          # optional; empty = every project
    group: shop-api        # optional; default openapi:<info.title>
    base_path: ""          # optional; "" = no prefix
```

## Why it works
The importer walks the spec and turns each operation into a mock rule in one group. A root field named like a path parameter echoes it, so `/mock/v1/users/42` answers with `"id": 42`. The mock server needs v2.6.0 or later. OpenAPI import in the UI, on the Mock server page (paste a spec, load a file or give a URL), needs v2.7.0.
