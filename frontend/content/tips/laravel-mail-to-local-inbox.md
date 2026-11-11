---
slug: laravel-mail-to-local-inbox
title: Laravel mail to a local inbox, three .env lines
description: Set MAIL_MAILER, MAIL_HOST and MAIL_PORT in .env and every Laravel email lands in Buggregator with HTML preview and attachments. Nothing is delivered.
query: laravel test email
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#laravel
requires: null
related: [symfony-mailer-to-local-inbox, smtp-catcher-in-docker-compose, test-html-email-on-mobile-width, wait-for-email-in-e2e-tests]
checked: { date: 2026-11-10, version: v2.8.0 }
---
To send a Laravel test email without reaching a real inbox, set three lines in `.env`: `MAIL_MAILER=smtp`, `MAIL_HOST=127.0.0.1`, `MAIL_PORT=1025`. Every email your app sends then lands in Buggregator, with the HTML preview, attachments and raw source. Nothing is delivered.

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

### 2. Change three lines in .env
Point Laravel's SMTP mailer at Buggregator. No username or password is needed.

```dotenv
# .env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

### 3. Use the service name in Docker Compose
If your Laravel app and Buggregator run in the same Compose stack, use the service name as the host.

```dotenv
# SMTP — email capture
MAIL_HOST=buggregator
MAIL_PORT=1025
```

### 4. Send an email and open it
Trigger any email: a registration confirmation, a password reset, a notification. Open http://127.0.0.1:8000. You see the rendered HTML with a Desktop / Tablet / Mobile width switcher, the plain text version, the addresses, the attachments and the raw MIME source.

![A Laravel welcome email in Buggregator: HTML preview with its button, recipients and the PDF attachment.](/img/tips/laravel-mail-to-local-inbox.webp)

## Why it works
Buggregator includes a fake SMTP server on port 1025. Laravel's SMTP mailer delivers to it like to any mail server, and Buggregator stores the email and shows it in the UI instead of sending it on. Your mail code does not change, only the address in `.env`.
