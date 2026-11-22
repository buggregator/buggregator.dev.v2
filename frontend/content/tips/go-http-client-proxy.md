---
slug: go-http-client-proxy
title: See every API call your Go service makes
description: Give your Go http.Client a Transport that uses Buggregator's proxy on port 8080. See each request and response with status code and timing. Dev only.
query: go http proxy
feature: HTTP
feature_page: /features/http-proxy
docs: https://docs.buggregator.dev/config/http-proxy.html#go
requires: null
related: [python-requests-through-debug-proxy, laravel-see-outgoing-api-calls, node-axios-calls-proxy, go-errors-on-your-machine]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To see the API calls your Go service makes, give its `http.Client` a `Transport` with `Proxy: http.ProxyURL(...)` set to Buggregator's proxy on port 8080, and `InsecureSkipVerify: true`. Every call then goes through Buggregator, and the UI shows the request, the response, the status code and the response time. Use it in development only: TLS verification is off.

## Steps

### 1. Start Buggregator with the proxy port
The proxy listens on port 8080; the UI is on port 8000. Keep the proxy on your machine only: it forwards to any host.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:8080:8080 \
  ghcr.io/buggregator/server:latest
```

### 2. Send requests through the proxy
Build a client with a proxied transport. In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

```go
import (
    "crypto/tls"
    "net/http"
    "net/url"
)

proxyURL, _ := url.Parse("http://127.0.0.1:8080")

client := &http.Client{
    Transport: &http.Transport{
        Proxy:           http.ProxyURL(proxyURL),
        TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
    },
}

resp, err := client.Get("https://api.example.com/users")
```

Use this client wherever your service calls an API.

### 3. Read the request and response
Open http://127.0.0.1:8000. Proxied calls carry a purple proxy badge. The detail page has Response, Request and Raw tabs, a JSON tree for the response body, and a color-coded status code.

## Why it works
For HTTPS, the proxy answers the CONNECT handshake with a certificate for the target host, signed by a CA it keeps in memory, then forwards the request to the real server. Go would reject that certificate, which is why the client skips verification; no CA installation is needed. The CA is created at startup and never written to disk.
