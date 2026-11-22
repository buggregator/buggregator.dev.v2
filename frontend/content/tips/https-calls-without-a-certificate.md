---
slug: https-calls-without-a-certificate
title: See your HTTPS API calls without installing a certificate
description: Set HTTPS_PROXY to Buggregator's HTTP proxy and turn off the certificate check in the client. Every HTTPS call shows with its response. No CA to install.
query: mitmproxy
feature: HTTP
feature_page: /features/http-proxy
docs: https://docs.buggregator.dev/config/http-proxy.html#environment-variables-any-language
requires: null
related: [python-requests-through-debug-proxy, node-axios-calls-proxy, go-http-client-proxy, laravel-see-outgoing-api-calls]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Start Buggregator, set `HTTPS_PROXY=http://127.0.0.1:8080` for your app, and turn off certificate verification in its HTTP client. Every outgoing HTTPS call then passes through Buggregator's HTTP proxy, and the UI shows the request, the response, the status code and the time it took. You install no certificate: the client simply does not check it. Use this in development only.

## Steps

### 1. Start Buggregator with the proxy port
Port 8000 is the UI, port 8080 is the HTTP proxy. Bind the proxy to 127.0.0.1: it forwards to any host.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:8080:8080 \
  ghcr.io/buggregator/server:latest
```

Port 8080 is taken on your machine, for example by a WebSocket server? Move the proxy with `-e PROXY_ADDR=:8081` and publish `127.0.0.1:8081:8081` instead. `PROXY_ADDR` is a Buggregator setting, not one for your app.

### 2. Point your app at the proxy
Set these variables in the shell or container where your app runs. Most HTTP clients read them.

```bash
export HTTP_PROXY=http://127.0.0.1:8080
export HTTPS_PROXY=http://127.0.0.1:8080
```

In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `http://buggregator:8080`.

### 3. Skip the certificate check in the client
The proxy signs each site's certificate itself, so the client must not verify it. Each language has its own switch:

```bash
# curl
curl -x http://127.0.0.1:8080 -k https://api.example.com/users

# Node.js: for the whole process
NODE_TLS_REJECT_UNAUTHORIZED=0 node app.js
```

```python
# Python requests
requests.get('https://api.example.com/users', verify=False)
```

```go
// Go: a transport that reads HTTPS_PROXY and skips the check
client := &http.Client{Transport: &http.Transport{
    Proxy:           http.ProxyFromEnvironment,
    TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
}}
```

```php
// PHP Guzzle
$client = new \GuzzleHttp\Client(['verify' => false]);
```

### 4. Read the calls
Run your app and open http://127.0.0.1:8000. Each proxied call shows the full URL, the request and response headers and bodies, a color-coded status code and the response time in milliseconds. JSON responses open as a tree. The detail page has Response, Request and Raw tabs.

## Why it works
For an HTTPS call, the client asks the proxy to open a tunnel (`CONNECT`). Buggregator answers with a certificate for the target host, signed by a CA it creates in memory at startup and never writes to disk. It reads the request, sends it on to the real server and stores both directions as one HTTP event. Because the client skips verification, there is nothing to trust or install.
