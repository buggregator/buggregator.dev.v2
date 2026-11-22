---
slug: laravel-csp-violations
title: See what your Laravel CSP blocks
description: Set CSP_REPORT_URI in spatie/laravel-csp to Buggregator. Every Content Security Policy violation shows up in one feed while you write the policy.
query: laravel csp
feature: CSP
feature_page: /features/csp-reports
docs: https://docs.buggregator.dev/config/csp.html#laravel
requires: "v2.13.0"
related: [csp-report-uri-any-site, symfony-csp-violations, reporting-api-deprecations, laravel-see-outgoing-api-calls]
checked: { date: 2026-11-22, version: v2.13.0 }
---
With spatie/laravel-csp, set `CSP_REPORT_URI=http://localhost:8000/csp` in `.env`. The browser then reports every script, style or image your Content Security Policy blocks, and Buggregator shows each report in one feed: the page, the directive and the blocked resource. You see what the policy breaks before your users do.

## Steps

### 1. Start Buggregator
Run the container. Port 8000 is the web UI and also takes the reports.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  -p 127.0.0.1:9913:9913 \
  ghcr.io/buggregator/server:latest
```

### 2. Install spatie/laravel-csp
Install the package, publish its config and add its middleware. In Laravel 11 and newer, that goes in `bootstrap/app.php`.

```bash
composer require spatie/laravel-csp
php artisan vendor:publish --tag=csp-config
```

```php
use Spatie\Csp\AddCspHeaders;

->withMiddleware(function (Middleware $middleware) {
    $middleware->append(AddCspHeaders::class);
})
```

### 3. Send reports to Buggregator
One line in `.env`. Add `/<project>` to the path, for example `/csp/shop`, to put the reports in a project of their own.

```dotenv
CSP_REPORT_URI=http://localhost:8000/csp
```

To report without blocking while you write the policy, move your presets from `presets` to `report_only_presets` in `config/csp.php`. The browser then sends the policy as report-only.

### 4. Load a page and open CSP reports
Open your app in the browser and click around. Open http://localhost:8000 and pick **CSP reports** in the menu. Each card shows the page and one line per report, for example «script-src-elem blocked https://cdn.example.com/x.js». Report-only violations get a badge. Open one to see the directive, the blocked resource, the file and line, and the full policy.

## Why it works
`CSP_REPORT_URI` fills the policy's `report-uri` directive. When the browser blocks something, or would block it under a report-only policy, it posts a JSON report to that address. Buggregator takes reports at `/csp` and shows them as events. `report-uri` works over plain http, so no certificate is needed locally.
