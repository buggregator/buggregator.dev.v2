---
slug: python-requests-through-debug-proxy
title: See every API call your Python script makes
description: Route Python requests through Buggregator's HTTP proxy on port 8080. See each request and response with status code and timing. Dev only.
query: charles proxy alternative
feature: HTTP
feature_page: /features/http-proxy
docs: https://docs.buggregator.dev/config/http-proxy.html#python-—-requests
requires: null
related: [laravel-see-outgoing-api-calls, webhook-payload-before-the-handler, replay-a-captured-request]
checked: { date: 2026-11-10, version: v2.8.0 }
---
If you want a Charles proxy alternative for a Python script, pass `proxies={'https': 'http://127.0.0.1:8080'}` and `verify=False` to `requests`. Every call goes through Buggregator's HTTP proxy, and the UI shows the request, the response, the status code and the response time. Use it in development only: TLS verification is off.

## Steps

### 1. Start Buggregator with the proxy port
The proxy listens on port 8080 by default; the UI is on port 8000. In Docker Compose, expose both ports.
```yaml
services:
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - "8000:8000"   # UI + API
      - "8080:8080"   # HTTP Proxy
```

### 2. Send requests through the proxy
Add `proxies` and `verify=False` to the call. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator`.
```python
import requests

response = requests.get(
    'https://api.example.com/users',
    proxies={'https': 'http://127.0.0.1:8080'},
    verify=False,
)
```

### 3. Read the request and response
Open `http://127.0.0.1:8000`. Proxied calls carry a purple proxy badge. The detail page has Response, Request and Raw tabs, a JSON tree for the response body, and a color-coded status code.

## Why it works
For HTTPS, the proxy answers the CONNECT handshake with a certificate for the target host, signed by a CA it keeps in memory, then forwards the request to the real server. Your client skips certificate verification, so no CA installation is needed. The CA is created at startup and never written to disk.
