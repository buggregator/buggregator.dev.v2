---
slug: wait-for-email-in-e2e-tests
title: Wait for the confirmation email in an E2E test
description: Call /api/smtp/messages/wait from your E2E test. It returns the matching email as soon as it arrives, or 408 on timeout. No fixed sleeps.
query: playwright email testing
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#waiting-for-an-email
requires: null
related: [grab-otp-code-from-test-email, laravel-mail-to-local-inbox, smtp-catcher-in-docker-compose]
checked: { date: 2026-11-10, version: v2.8.0 }
---
For Playwright email testing, or Cypress, or any other E2E tool, call Buggregator's `GET /api/smtp/messages/wait` with a filter such as `to=alice@example.com`. The request returns the first matching email as soon as it arrives, so your test needs no fixed sleep. It answers 408 if nothing matches in time.

## Steps

### 1. Send your app's mail to Buggregator
Point the app's SMTP settings at `127.0.0.1:1025`. In Docker Compose, use the service name, for example `buggregator`. The testing API is plain HTTP on port 8000, so any test runner that can make a request can use it.

### 2. Take a cursor before the action
A message that is already stored and matches comes back at once. So remember the server time first, and pass it as `since` later. Otherwise an old email from an earlier test can match.

```bash
CURSOR=$(curl -s http://127.0.0.1:8000/api/smtp/cursor | jq -r .cursor)
```

### 3. Trigger the email
Let your test do the action that sends mail: click "Forgot password", submit a sign-up form, place an order.

### 4. Wait for the matching message
The request stays open until a message matches every filter you pass. Filters: `to`, `from`, `cc`, `subject`, `subject_contains`, `subject_regex`, `body_contains`, `project`, `since` and `until`. `timeout` takes a Go duration such as `10s` or `1m`: the default is 30s, the maximum 60s.

```bash
UUID=$(curl -s -G http://127.0.0.1:8000/api/smtp/messages/wait \
  --data-urlencode "since=$CURSOR" \
  --data-urlencode "to=alice@example.com" \
  --data-urlencode "subject_contains=Reset" \
  --data-urlencode "timeout=20s" | jq -r .uuid)
```

The answer is a normal Buggregator event. Its payload has `subject`, `from`, `to`, `text`, `html` and `raw`, so your test can assert on them. On timeout the answer is 408: fail the test there.

![The confirmation email a test waited for, open in Buggregator: sender, recipient and the HTML preview.](/img/tips/wait-for-email-in-e2e-tests.webp)

### 5. Send the login header if SSO is on
With SSO on, these routes need the same login as the rest of `/api`: send the `X-Auth-Token` header. Without SSO, no header is needed.

## Why it works
The wait endpoint holds the request open on the server and answers the moment a matching email is stored. Your test waits exactly as long as the email takes, up to the timeout. The cursor makes sure only mail sent after the action can match.
