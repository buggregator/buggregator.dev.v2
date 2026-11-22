---
slug: symfony-csp-violations
title: See what your Symfony CSP blocks
description: Point NelmioSecurityBundle's report-uri at Buggregator in dev. Each CSP violation shows the directive, the blocked URL and the page it happened on.
query: content security policy report
feature: CSP
feature_page: /features/csp-reports
docs: https://docs.buggregator.dev/config/csp.html#report-uri-works-everywhere
requires: "v2.13.0"
related: [csp-report-uri-any-site, laravel-csp-violations, reporting-api-deprecations, symfony-errors-locally]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To see what your Symfony Content Security Policy blocks, set `report-uri` in NelmioSecurityBundle's CSP config to `http://localhost:8000/csp/shop`. The browser then posts every violation to Buggregator, and you read the directive, the blocked resource and the page in one feed. Start in report-only mode, so nothing is blocked while you write the policy.

## Steps

### 1. Start Buggregator
Port 8000 is the web UI and the report endpoint.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Add a report-only policy for dev
In NelmioSecurityBundle, the `report` section sends the policy as report-only: the browser reports violations but blocks nothing. Put it in a dev-only config file, for example `config/packages/dev/nelmio_security.yaml`.

```yaml
nelmio_security:
    csp:
        report:
            report-uri: 'http://localhost:8000/csp/shop'
            default-src: [ 'self' ]
            script-src: [ 'self' ]
            img-src: [ 'self' ]
```

`shop` is the Buggregator project key. Leave out `/shop` to send reports to the `default` project.

### 3. Load your pages
Open your app in the browser and click through it. Every script, style or image the policy does not allow is reported. Use `localhost:8000` in the policy, not a Docker service name: the browser sends the report, not your app.

### 4. Read the reports
Open `http://localhost:8000`. The feed gets one card per report request: the page, then one line per violation, for example «script-src-elem blocked https://cdn.example.com/x.js». Report-only violations get a badge. The event page shows the directive, the blocked resource, the file with line and column, the code sample, the full policy and the raw report. **CSP reports** in the menu lists only these events.

### 5. Check it without a browser
Send one report with curl to see that Buggregator receives it.

```bash
curl -X POST http://localhost:8000/csp/shop \
  -H 'Content-Type: application/csp-report' \
  -d '{"csp-report":{"document-uri":"https://shop.test/checkout","effective-directive":"script-src-elem","blocked-uri":"https://cdn.example.com/x.js","disposition":"enforce"}}'
```

## Why it works
NelmioSecurityBundle writes your config as a `Content-Security-Policy-Report-Only` header with the `report-uri` you set. When the page breaks the policy, the browser POSTs a JSON report to that address. Buggregator accepts reports at `/csp/<project>`, answers the browser's CORS check, and stores each report as an event. Once the feed stays empty, move the rules to the `enforce` section.
