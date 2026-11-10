---
slug: twilio-sms-without-sending
title: Test SMS codes without sending a single SMS
description: Point Symfony Notifier's Twilio DSN at Buggregator. Every SMS shows up in the UI with sender, recipient and text, and nothing reaches a phone.
query: twilio test sms
feature: SMS
feature_page: /features/sms
docs: https://docs.buggregator.dev/config/sms.html#symfony-notifier
requires: null
related: [grab-otp-code-from-test-email, mock-api-with-fake-data, webhook-payload-before-the-handler]
checked: { date: 2026-11-10, version: v2.8.0 }
---
For a Twilio test SMS that never leaves your laptop, change the host in your `TWILIO_DSN` to `127.0.0.1:8000/sms/twilio`. Symfony Notifier then sends to Buggregator, which acts as a fake SMS gateway: you read the code in the UI with the sender, recipient and message text.

## Steps

### 1. Change the host in the DSN
Keep `SID`, `TOKEN` and the `from` number. Only the host changes. The `/sms/twilio` path also checks that the payload has every field Twilio requires.
```dotenv
# Default (sends to real Twilio):
TWILIO_DSN=twilio://SID:TOKEN@default?from=+1234567890

# Point to Buggregator (explicit provider URL for validation):
TWILIO_DSN=twilio://SID:TOKEN@127.0.0.1:8000/sms/twilio?from=+1234567890

# Or use auto-detect:
TWILIO_DSN=twilio://SID:TOKEN@127.0.0.1:8000/sms?from=+1234567890
```
In Docker Compose, replace 127.0.0.1:8000 with the Buggregator service name, for example `buggregator:8000`.

### 2. Send an SMS from your app
Trigger the flow that sends the code, for example a login or a phone check. Open `http://127.0.0.1:8000`: the message shows sender, recipient, text and a colored Twilio badge.

### 3. Check what a broken payload does
With the explicit provider URL, a missing required field gets a 422 response with the list of missing fields, like a real provider would send. The event is still captured, with the problems highlighted in red.
```bash
curl -X POST http://127.0.0.1:8000/sms/twilio \
  -H "Content-Type: application/json" \
  -d '{"From":"+1234","To":"+5678"}'
# Returns 422: {"error":"validation_failed","gateway":"twilio","missing_fields":["MessageSid","Body"]}
```

### 4. Use the same pattern for other bridges
Vonage, Plivo and Sinch DSNs work the same way: change the host and add the provider path.
```dotenv
# Vonage
VONAGE_DSN=vonage://KEY:SECRET@127.0.0.1:8000/sms/vonage?from=MyApp
```

## Why it works
Every Symfony SMS bridge has a configurable host. Buggregator answers on the `/sms` endpoint, reads `from`, `to` and the message from the provider's own field names, and shows the result. Over 40 providers are detected.
