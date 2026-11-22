---
slug: reporting-api-deprecations
title: Catch browser deprecation reports before a feature breaks
description: Name Buggregator as the default Reporting API endpoint. The browser's deprecation and intervention reports land in the same feed as CSP violations.
query: reporting api
feature: CSP
feature_page: /features/csp-reports
docs: https://docs.buggregator.dev/config/csp.html#report-to-reporting-api
requires: "v2.13.0"
related: [csp-report-uri-any-site, laravel-csp-violations, symfony-csp-violations]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Send a `Reporting-Endpoints` header that names Buggregator as the endpoint called `default`. The browser then sends its deprecation reports there: a warning that your page uses a feature that is going away. Intervention reports come too. They show in Buggregator next to your CSP violations, with the message, the file, line and column.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Name the default endpoint
Browsers send deprecation and intervention reports only to the endpoint named `default`. `shop` is the project; leave out `/shop` for the default project.

```http
Reporting-Endpoints: default="http://localhost:8000/csp/shop"
```

To get CSP violations through the same header, add a second endpoint and point your policy at it:

```http
Reporting-Endpoints: buggregator="http://localhost:8000/csp/shop", default="http://localhost:8000/csp/shop"
Content-Security-Policy: default-src 'self'; report-to buggregator
```

### 3. Serve the page from https or localhost
The Reporting API works only when both your app and the Buggregator address are https or `localhost`. Over plain http, for example `http://buggregator:8000` from Docker, the browser drops the reports without an error.

### 4. Check it with curl
Send one deprecation report by hand to see how it looks.

```bash
curl -X POST http://localhost:8000/csp/shop \
  -H 'Content-Type: application/reports+json' \
  -d '[{"type":"deprecation","url":"https://shop.test/","age":3,"user_agent":"Mozilla/5.0","body":{"id":"PrefixedStorageInfo","message":"window.webkitStorageInfo is deprecated.","sourceFile":"https://shop.test/app.js","lineNumber":2,"columnNumber":5}}]'
```

### 5. Read the reports
Open `http://localhost:8000` and pick **CSP reports** in the menu. Each request is one event. The event page shows each report with its message, the file with line and column, and the raw report.

## Why it works
The Reporting API is how the browser tells a site about problems it found on the page. It POSTs them as a JSON list, `application/reports+json`, to the endpoints you named. Buggregator reads that list, so one request with a CSP violation and a deprecation becomes one event with two reports.
