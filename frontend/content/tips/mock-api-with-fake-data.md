---
slug: mock-api-with-fake-data
title: A mock API that returns new fake users on every call
description: Turn on template for a Buggregator mock rule and fill the body with fake names and emails. New data on each call, or the same data with a seed.
query: mock api for testing
feature: Mock server
feature_page: /features/mock-server
docs: https://docs.buggregator.dev/config/mock-templates.html#fake-data
requires: v2.6.0
related: [mock-api-from-openapi-spec, replay-a-captured-request, webhook-payload-before-the-handler]
checked: { date: 2026-11-10, version: v2.8.0 }
---
For a mock API for testing that returns fresh fake users, create a Buggregator mock rule with `template: true` and put `fake` helpers in its body. Each call to `/mock/...` then gets new names and emails; set a `seed` when you need the same data every time.

## Steps

### 1. Write the body with fake helpers
Pass every string through `| json`. It adds the quotes and escapes them, so the body stays valid JSON.
```text
{"name": {{ fake "name" | json }}, "email": {{ fake "email" | json }}}
```

### 2. Create a template rule
Send the rule to the REST API. `template: true` makes the body and every header value a template. `{{ path "id" }}` copies the id from the URL. This example sets `seed: 42`, which gives the same fake data on every request. Leave `seed` out (the default is 0) to get new data on every request.
```bash
curl -X POST http://127.0.0.1:8000/api/mocks \
  -H 'Content-Type: application/json' \
  -d '{"method": "GET", "path": "/users/{id}", "template": true, "seed": 42,
       "headers": {"Content-Type": "application/json"},
       "body": "{\"id\": {{ path \"id\" }}, \"name\": {{ fake \"name\" | json }}, \"email\": {{ fake \"email\" | json }}}"}'
```

### 3. Call the mock
Point your app or test at `http://127.0.0.1:8000/mock`. With `seed: 42`, this is the answer every time.
```bash
curl http://127.0.0.1:8000/mock/users/42
# {"id": 42, "name": "Jessica Hills", "email": "jonathon.marquardt@wilkinson.biz"}
```

![The mock server page: the template rule and the requests it answered.](/img/tips/mock-api-with-fake-data.webp)

### 4. Find more generators
Numbers, UUIDs, cities, prices and many more are available. The full list with each generator's parameters comes from one endpoint.
```text
GET /api/mocks/helpers
```

## Why it works
A template rule builds the body for each request instead of sending a fixed one. With `seed: 0`, the fake values change on every request. With any other seed, the fake data repeats, which suits tests that compare responses.
