---
slug: grab-otp-code-from-test-email
title: Pull the verification code out of a test email
description: Wait for the email in your test, then call /api/smtp/message/{uuid}/codes. Buggregator returns the 4–8 digit codes it finds, or your own pattern.
query: null
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#codes
requires: null
related: [wait-for-email-in-e2e-tests, laravel-mail-to-local-inbox, smtp-catcher-in-docker-compose]
checked: { date: 2026-11-10, version: v2.8.0 }
---
When your test needs the verification code from an email, call `GET /api/smtp/message/{uuid}/codes` on Buggregator. It finds numbers of 4 to 8 digits in the text and HTML parts, or any pattern you pass, and your test types the code in.

## Steps

### 1. Take a cursor before the action
Your app must send mail to Buggregator on `127.0.0.1:1025`. Remember the server time before the test triggers the email, so an old email cannot match.

```bash
CURSOR=$(curl -s http://127.0.0.1:8000/api/smtp/cursor | jq -r .cursor)
```

### 2. Wait for the email and keep its uuid
Let the test ask for the code, for example by clicking "Forgot password". Then wait for the email. The call returns as soon as a matching message arrives, and 408 on timeout.

```bash
UUID=$(curl -s -G http://127.0.0.1:8000/api/smtp/messages/wait \
  --data-urlencode "since=$CURSOR" \
  --data-urlencode "to=alice@example.com" \
  --data-urlencode "subject_contains=Reset" \
  --data-urlencode "timeout=20s" | jq -r .uuid)
```

### 3. Read the code
Ask for the codes in that message. Each code is listed once.

```bash
curl -s http://127.0.0.1:8000/api/smtp/message/$UUID/codes
# {"data":["482913"],"pattern":"\\b\\d{4,8}\\b"}
```

![A sign-in email with a six-digit code, open in Buggregator's mail view.](/img/tips/grab-otp-code-from-test-email.webp)

### 4. Pass your own pattern for other codes
The default pattern finds numbers of 4 to 8 digits. For letters and digits, add a `pattern` query parameter, for example `pattern=[A-Z0-9]{6}`. An invalid pattern gets 400.

### 5. Use the link instead, if the email has one
For a confirmation link rather than a code, call `GET /api/smtp/message/{uuid}/links`. It lists the links from the HTML and text parts with their `url`, `text` and `source`.

## Why it works
Buggregator stores every email your app sends, so the API can read the text part and the HTML part with the tags removed. The codes route runs a regular expression over both and returns each match. With SSO on, send the `X-Auth-Token` header, as for the rest of `/api`.
