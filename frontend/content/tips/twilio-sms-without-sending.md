---
slug: twilio-sms-without-sending
title: Test SMS codes with a fake Twilio-format gateway
description: POST your SMS in Twilio's field format to Buggregator's /sms/twilio. You read sender, recipient and text in the UI, and nothing reaches a phone.
query: twilio test sms
feature: SMS
feature_page: /features/sms
docs: https://docs.buggregator.dev/config/sms.html#any-language-any-framework
requires: null
related: [grab-otp-code-from-test-email, mock-api-with-fake-data, webhook-payload-before-the-handler]
checked: { date: 2026-11-10, version: v2.8.0 }
---
For a Twilio test SMS that never reaches a phone, send the message from your own code as an HTTP POST in Twilio's field format to `http://127.0.0.1:8000/sms/twilio`. Buggregator acts as a fake SMS gateway: you read the code in the UI with the sender, recipient and text. This is a plain HTTP call you write yourself. Symfony Notifier's Twilio transport posts to Twilio's own API path, not to `/sms`, so pointing its DSN here does not work.

## Steps

### 1. Send one SMS from the terminal
Check that Buggregator receives it before you touch your app. The payload uses Twilio's names: `MessageSid`, `From`, `To` and `Body`.
```bash
curl -X POST http://127.0.0.1:8000/sms/twilio \
  -H "Content-Type: application/json" \
  -d '{"MessageSid":"SM123","From":"+1234","To":"+5678","Body":"Hello!"}'
```
Open `http://127.0.0.1:8000`: the message shows with a Twilio badge.

![An SMS with a one-time code in Buggregator, marked with the Twilio badge.](/img/tips/twilio-sms-without-sending.webp)

### 2. Send the code from your app
In development, send the SMS with your HTTP client instead of the provider's SDK. In Laravel it looks like this:
```php
Http::post('http://127.0.0.1:8000/sms/twilio', [
    'MessageSid' => Str::uuid(),
    'From' => '+1234567890',
    'To' => $user->phone,
    'Body' => "Your code is {$code}",
]);
```
In Docker Compose, replace 127.0.0.1:8000 with the Buggregator service name, for example `buggregator:8000`.

### 3. Spot a missing field
With the provider in the URL, Buggregator checks that every field Twilio needs is present. A payload without `MessageSid` and `Body` is still stored, and the card lists each missing field in red. The HTTP response is a normal 200, so your code will not fail on it: look at the card.
```bash
curl -X POST http://127.0.0.1:8000/sms/twilio \
  -H "Content-Type: application/json" \
  -d '{"From":"+1234","To":"+5678"}'
```

### 4. Send to a project
Add a project name as one more path segment, for example `/sms/twilio/myproject`, to keep each app's messages apart.

## Why it works
Any POST whose path starts with `/sms` goes to the SMS module. With `/sms/twilio` it reads `From`, `To` and `Body` by Twilio's field names and flags what is missing. Without a provider in the path, it guesses the provider from the body fields; over 40 providers are known.
