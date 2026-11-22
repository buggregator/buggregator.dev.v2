---
slug: python-smtp-local-inbox
title: Python smtplib mail to a local inbox
description: Send with smtplib to 127.0.0.1 on port 1025 and every email from your scripts lands in Buggregator. No TLS, no password, nothing leaves your machine.
query: python send email smtp
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#any-other-app
requires: null
related: [django-mail-to-local-inbox, django-errors-and-traces, github-actions-email-tests, wait-for-email-in-e2e-tests]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To test a Python script that sends email, point `smtplib.SMTP` at `127.0.0.1`, port `1025`, where Buggregator listens. Every message then lands in a local inbox with the HTML preview, headers and attachments. Nothing reaches a real address.

## Steps

### 1. Start Buggregator
Run the container. Port 8000 is the web UI, port 1025 is the SMTP server.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  -p 127.0.0.1:9913:9913 \
  ghcr.io/buggregator/server:latest
```

### 2. Send with smtplib
Build the message with `email.message.EmailMessage` and send it with `send_message`. It takes the sender and the recipients from the headers.

```python
import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg["Subject"] = "Your order"
msg["From"] = "shop@example.com"
msg["To"] = "alice@example.com"
msg.set_content("Thanks for your order.")
msg.add_alternative("<h1>Thanks for your order.</h1>", subtype="html")

with smtplib.SMTP("127.0.0.1", 1025) as smtp:
    smtp.send_message(msg)
```

### 3. Leave out starttls() and login()
Buggregator's SMTP server offers no TLS, so `smtp.starttls()` fails with `SMTPNotSupportedError`. Skip it locally, for example behind a setting. You need no `login()` either. If you call it anyway, since server v2.5.0 the user name picks the [project](https://docs.buggregator.dev/config/projects.html), and any password works.

### 4. Open the inbox
Run the script and open http://127.0.0.1:8000. You see the HTML part, the plain text part, the addresses and the raw MIME source. In Docker Compose, use the Buggregator service name, for example `buggregator`, instead of `127.0.0.1`.

## Why it works
`smtplib` talks plain SMTP to whatever host and port you give it. Buggregator listens on port 1025, needs no authentication, and stores each email for the UI instead of delivering it. Only the host and port change; the code that builds your email stays the same.
