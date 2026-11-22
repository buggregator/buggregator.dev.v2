---
slug: frontend-fake-api-before-backend
title: A fake API for the frontend before the backend exists
description: Describe each endpoint as a Buggregator mock rule with fake data. Your React or Vue app calls /mock, gets realistic JSON, and CORS is answered for you.
query: fake api
feature: Mock server
feature_page: /features/mock-server
docs: https://docs.buggregator.dev/config/mock-templates.html#fake-data
requires: "v2.6.0"
related: [mock-api-with-fake-data, mock-api-from-openapi-spec, mock-a-third-party-api, react-errors-locally]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Build the frontend against `http://127.0.0.1:8000/mock` while the backend is still in progress. Describe each endpoint once as a Buggregator mock rule, with fake names, emails and ids in the body. Your React or Vue app gets realistic JSON from a fixed address, and Buggregator answers the browser's CORS check, so you write no backend code and no proxy config.

## Steps

### 1. Describe the endpoints
Put the rules in `buggregator.yaml`, so everyone on the team gets the same API. With `template: true` the body is a template; `seed` keeps the fake data the same on every call.

```yaml
# buggregator.yaml
mocks:
  - method: GET
    path: /users
    template: true
    seed: 7
    headers: { Content-Type: application/json }
    body: '[{{ range $i := repeat 3 }}{{ if $i }},{{ end }}{"id": {{ add $i 1 }}, "name": {{ fake "name" | json }}}{{ end }}]'
  - method: GET
    path: /users/{id}
    template: true
    seed: 42
    headers: { Content-Type: application/json }
    body: '{"id": {{ path "id" }}, "name": {{ fake "name" | json }}, "email": {{ fake "email" | json }}}'
  - method: POST
    path: /users
    status: 201
    headers: { Content-Type: application/json }
    body: '{"id": 4}'
```

### 2. Start Buggregator with the file
Buggregator reads `buggregator.yaml` from the folder it starts in. In the image that is `/`.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -v ./buggregator.yaml:/buggregator.yaml \
  ghcr.io/buggregator/server:latest
```

### 3. Point the frontend at /mock
Rule paths have no `/mock` prefix, the URLs do. With Vite, for example:

```dotenv
# .env.development
VITE_API_URL=http://127.0.0.1:8000/mock
```

```js
const users = await fetch(`${import.meta.env.VITE_API_URL}/users`).then((r) => r.json())
// [{"id": 1, "name": "Sienna Atkinson"},{"id": 2, "name": "Logan Cooper"},{"id": 3, "name": "Carrie Gray"}]
```

### 4. Let the browser call it from another origin
Your dev server runs on another port, so the browser checks CORS. Buggregator allows every origin by default and answers the `OPTIONS` preflight with `204` and the CORS headers. You only need an `OPTIONS` rule if you want a different answer.

### 5. Watch the calls
Open http://127.0.0.1:8000, then **Mock server**. Each call from the app shows up live with what it sent and what came back. A call with no rule gets `404` with `{"error": "no mock rule matched ..."}`, and the page offers to create a rule from that request.

## Why it works
A template rule builds the body for each request: `path "id"` copies the id from the URL, `fake` makes up a value, and `repeat` builds a list. With a seed other than `0`, the fake values repeat on every call, so your screens look the same after each reload. When the backend is ready, change `VITE_API_URL` to its address.
