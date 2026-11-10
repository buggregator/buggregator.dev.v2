---
slug: laravel-see-outgoing-api-calls
title: See every API call your Laravel app sends
description: "Set global proxy options for Laravel's HTTP client in AppServiceProvider. Every Http:: request and response shows up in Buggregator. Local only."
query: guzzle debug
feature: HTTP
feature_page: /features/http-proxy
docs: https://docs.buggregator.dev/config/http-proxy.html#php-—-laravel-http-client
requires: null
related: [python-requests-through-debug-proxy, webhook-payload-before-the-handler, mock-api-from-openapi-spec]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Instead of Guzzle debug output, send Laravel's HTTP client through Buggregator's proxy: call `Http::globalOptions()` with `'proxy'` and `'verify' => false` in `AppServiceProvider`, inside `isLocal()`. Every `Http::` request then shows up in Buggregator with its response, status code and response time. TLS verification is off, so keep it to local development.

## Steps

### 1. Make sure the proxy port is open
The proxy listens on port 8080 by default; the UI is on port 8000. In Docker Compose, expose both ports.
```yaml
services:
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - "8000:8000"   # UI + API
      - "8080:8080"   # HTTP Proxy
```

### 2. Set the proxy for all HTTP calls
Add this to `AppServiceProvider`. The `isLocal()` check keeps it out of production.
```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\Http;

public function boot(): void
{
    if ($this->app->isLocal()) {
        Http::globalOptions([
            'proxy' => env('BUGGREGATOR_PROXY_URL', 'http://127.0.0.1:8080'),
            'verify' => false,
        ]);
    }
}
```

### 3. In Docker Compose, set the proxy URL
When the app runs in a container next to Buggregator, use the service name.
```dotenv
BUGGREGATOR_PROXY_URL=http://buggregator:8080
```

### 4. Or proxy one call only
To check a single request, set the options on that call.
```php
use Illuminate\Support\Facades\Http;

$response = Http::withOptions([
    'proxy' => 'http://127.0.0.1:8080',
    'verify' => false,
])->get('https://api.example.com/users');
```

### 5. Read the request and the response
Open `http://127.0.0.1:8000`. Each call shows the full URL, request and response headers and body, a color-coded status code and the response time in milliseconds. JSON bodies open as a tree.

## Why it works
Laravel's HTTP client is built on Guzzle ([Laravel docs](https://laravel.com/docs/12.x/http-client)), and `globalOptions` passes Guzzle options to every request. Buggregator's proxy forwards each request to the real API and records both directions. For HTTPS it signs certificates with a CA kept in memory, which is why the client must skip verification.
