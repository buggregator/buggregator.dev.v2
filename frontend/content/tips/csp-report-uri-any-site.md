---
slug: csp-report-uri-any-site
title: See what your Content-Security-Policy blocks, in one feed
description: Add report-uri pointing at Buggregator to your CSP header. Every violation shows with the blocked URL, the directive and the policy. Any site.
query: content security policy report
feature: CSP
feature_page: /features/csp-reports
docs: https://docs.buggregator.dev/config/csp.html#report-uri-works-everywhere
requires: "v2.13.0"
related: [reporting-api-deprecations, laravel-csp-violations, symfony-csp-violations, webhook-payload-before-the-handler]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Add `report-uri http://localhost:8000/csp/<project>` to your Content-Security-Policy header. Each time the browser blocks something, it sends a report to Buggregator, and you see the page, the blocked URL, the directive and the full policy. Start with the `Report-Only` header: the browser reports but blocks nothing.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Add report-uri to your policy
Use `Content-Security-Policy-Report-Only` while you write the policy. `shop` is the project; leave out `/shop` for the default project.

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-uri http://localhost:8000/csp/shop
```

In nginx, for example:

```nginx
add_header Content-Security-Policy-Report-Only "default-src 'self'; report-uri http://localhost:8000/csp/shop";
```

### 3. Check it with curl
Send one report by hand to see how it looks.

```bash
curl -X POST http://localhost:8000/csp/shop \
  -H 'Content-Type: application/csp-report' \
  -d '{"csp-report":{"document-uri":"https://shop.test/checkout","effective-directive":"script-src-elem","blocked-uri":"https://cdn.example.com/x.js","disposition":"enforce"}}'
```

### 4. Open the pages of your site
Click through the site in the browser. Then open `http://localhost:8000`. The feed gets one card per report request: the page, then one line per report, for example «script-src-elem blocked https://cdn.example.com/x.js». Report-only violations get a badge. The event page shows the directive, the blocked resource, the file with line and column, the code sample, the full policy and the raw report. **CSP reports** in the menu lists only these events.

## Why it works
With `report-uri`, the browser POSTs each violation as JSON to the address you give, from any page. Buggregator accepts these reports at `/csp`, answers the browser's CORS check, and stores each request as one event. Unlike `report-to`, `report-uri` also works over plain http, for example from `http://buggregator:8000` in Docker. A report body may be at most 1 MB.
