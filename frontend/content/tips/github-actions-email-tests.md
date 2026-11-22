---
slug: github-actions-email-tests
title: Email tests in GitHub Actions with one service container
description: Run Buggregator as a service in your GitHub Actions job. Your app sends mail to port 1025, and your tests read the email through the API.
query: mailpit docker
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/guides/ci.html#github-actions
requires: "v2.3.0"
related: [wait-for-email-in-e2e-tests, grab-otp-code-from-test-email, smtp-catcher-in-docker-compose]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Add Buggregator under `services:` in your GitHub Actions job and publish ports 8000 and 1025. Your app sends mail to `localhost:1025`, and your tests ask `GET /api/smtp/messages/wait` whether the email arrived. It answers with the email, or `408` when time runs out. Nothing is delivered to a real inbox.

## Steps

### 1. Add the service to the job
The service's ports are published on the runner, so the job uses `localhost`. Pin a version tag such as `2.13.0` instead of `latest` if you want CI to change only when you change it.

```yaml
jobs:
  tests:
    runs-on: ubuntu-latest
    services:
      buggregator:
        image: ghcr.io/buggregator/server:latest
        ports:
          - 8000:8000 # HTTP: UI and API
          - 1025:1025 # SMTP
    env:
      MAIL_HOST: localhost
      MAIL_PORT: 1025
    steps:
      - uses: actions/checkout@v4
      - run: ./run-your-tests
```

Use your framework's own variable names for the SMTP host and port.

### 2. Wait until it answers
`GET /api/version` is a health check. Add this step before your tests.

```yaml
      - name: Wait for Buggregator
        run: curl -sf --retry 30 --retry-delay 1 --retry-all-errors http://localhost:8000/api/version
```

### 3. Start from a clean inbox

```bash
curl -X DELETE http://localhost:8000/api/events \
  -H 'Content-Type: application/json' -d '{"type": "smtp"}'
```

### 4. Assert in your test
After the action that sends mail, wait for the email. `-f` makes curl fail on the `408`, so the test fails when no email came.

```bash
curl -sf -G http://localhost:8000/api/smtp/messages/wait \
  --data-urlencode 'subject=Welcome' \
  --data-urlencode 'to=user@example.com' \
  --data-urlencode 'timeout=10s'
```

The wait holds the request for at most `60s`. To read a code from the email, pass its `uuid` to `GET /api/smtp/message/{uuid}/codes`.

## Why it works
Buggregator's fake SMTP server on port 1025 stores every email instead of sending it. The testing API on port 8000 lets any test runner ask what arrived. One server per job keeps events of parallel jobs apart, and in CI you usually run without SSO, so the API needs no token.
