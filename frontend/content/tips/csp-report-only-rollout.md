---
slug: csp-report-only-rollout
title: Roll out a Content Security Policy in Report-Only mode
description: Send your new policy as Content-Security-Policy-Report-Only with report-uri pointing at Buggregator. Fix what it reports, then switch to enforce.
query: content security policy
feature: CSP
feature_page: /features/csp-reports
docs: https://docs.buggregator.dev/config/csp.html#report-uri-works-everywhere
requires: "v2.13.0"
related: [csp-report-uri-any-site, laravel-csp-violations, symfony-csp-violations, reporting-api-deprecations]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Ship a new Content Security Policy as `Content-Security-Policy-Report-Only` first, with `report-uri http://localhost:8000/csp`. The browser blocks nothing and reports every resource the policy would block to Buggregator. Fix the policy or the page until a full click-through brings no new reports, then rename the header to `Content-Security-Policy` to enforce it.

## Steps

### 1. Start Buggregator

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Send the draft policy as Report-Only
Write the policy you want, and add `report-uri`. `shop` is the project; leave out `/shop` for the default project.

```http
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; img-src 'self' data:; report-uri http://localhost:8000/csp/shop
```

In nginx, for example:

```nginx
add_header Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self'; img-src 'self' data:; report-uri http://localhost:8000/csp/shop";
```

### 3. Click through the site
Open the pages people use: sign-in, checkout, the pages with embeds and widgets. Then open http://localhost:8000. The feed gets one card per report: the page, then one line per violation, for example «script-src-elem blocked cdn.example.com/x.js». Report-only violations get a badge. The event page shows the directive, the blocked resource, the file with line and column, and the full policy. **CSP reports** in the menu lists only these events.

### 4. Fix each report
For each line, decide: the resource is yours and needed, so add its source to the directive (`script-src 'self' https://cdn.example.com`), or it should not load, so remove it from the page.

### 5. Clear and check again
Delete the old reports, update the policy and click through again. Repeat until no new reports come.

```bash
curl -X DELETE http://localhost:8000/api/events \
  -H 'Content-Type: application/json' -d '{"type": "csp"}'
```

### 6. Enforce it
Rename the header to `Content-Security-Policy` and keep `report-uri`. The browser now blocks what the policy forbids, and you still see each block in Buggregator, now without the report-only badge on the feed card.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; img-src 'self' data:; report-uri http://localhost:8000/csp/shop
```

## Why it works
With the Report-Only header, the browser checks every resource against the policy but loads it anyway, and POSTs a JSON report for each one that fails. Buggregator accepts these reports at `/csp`, answers the browser's CORS check and stores each request as one event. You see the full list of what the policy would break before any user meets it. `report-uri` also works over plain http. In Docker, publish port 8000 and keep `http://localhost:8000/csp/shop`: the reports come from your browser, and a browser on your machine cannot resolve a Compose service name.
