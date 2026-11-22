---
slug: symfony-http-client-calls
title: See every call Symfony HttpClient makes
description: Set the proxy option of Symfony HttpClient to Buggregator on port 8080. Each outgoing call shows its request, response, status and time. Dev only.
query: symfony http client
feature: HTTP
feature_page: /features/http-proxy
docs: https://docs.buggregator.dev/config/http-proxy.html#php-—-symfony-httpclient
requires: null
related: [laravel-see-outgoing-api-calls, python-requests-through-debug-proxy, replay-a-captured-request, symfony-errors-locally]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To see what Symfony HttpClient sends and what comes back, set its `proxy` option to `http://127.0.0.1:8080` and turn off TLS verification. Every call then goes through Buggregator's HTTP proxy, and the UI shows the request, the response, the status code and the response time. Use it in development only.

## Steps

### 1. Start Buggregator with the proxy port
The proxy listens on port 8080; the UI is on port 8000. Bind the proxy to your machine only: it forwards to any host.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:8080:8080 \
  ghcr.io/buggregator/server:latest
```

### 2. Set the proxy on one client
Pass `proxy` and switch off peer and host verification. In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

```php
use Symfony\Component\HttpClient\HttpClient;

$client = HttpClient::create([
    'proxy' => 'http://127.0.0.1:8080',
    'verify_peer' => false,
    'verify_host' => false,
]);

$response = $client->request('GET', 'https://api.example.com/users');
```

### 3. Or set it for the whole app in dev
In a Symfony app, put the same options under the framework's HTTP client defaults, for the `dev` environment only.

```yaml
# config/packages/framework.yaml
when@dev:
    framework:
        http_client:
            default_options:
                proxy: 'http://127.0.0.1:8080'
                verify_peer: false
                verify_host: false
```

### 4. Read the request and response
Make a call, then open `http://127.0.0.1:8000`. Proxied calls carry a purple proxy badge. The detail page has Response, Request and Raw tabs, a JSON tree for the response body, a color-coded status code and the time in milliseconds.

## Why it works
For HTTPS, the proxy answers the CONNECT handshake with a certificate for the target host, signed by a CA it keeps in memory, then forwards the request to the real server. Your client skips certificate verification, so you install no CA. The proxy stores the request and the response together as one event. Your code that calls the API does not change.
