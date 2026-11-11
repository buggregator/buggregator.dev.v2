---
slug: symfony-mailer-to-local-inbox
title: Symfony Mailer to a local inbox, one line
description: Set MAILER_DSN=smtp://127.0.0.1:1025 in your .env and every Symfony email lands in Buggregator with HTML preview and raw source.
query: symfony mailer dsn
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#symfony
requires: null
related: [laravel-mail-to-local-inbox, smtp-catcher-in-docker-compose, wordpress-mail-to-local-inbox, test-html-email-on-mobile-width]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Set the Symfony Mailer DSN to `smtp://127.0.0.1:1025` in your `.env`. Every email your Symfony app sends then lands in Buggregator, with the HTML preview, attachments and raw source, and none of it reaches a real inbox.

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

### 2. Set the DSN
One line in your `.env`. No username, password or TLS setup is needed. The Spiral Framework uses the same line.

```dotenv
# .env
MAILER_DSN=smtp://127.0.0.1:1025
```

### 3. Use the service name in Docker Compose
If your app and Buggregator run in the same Compose stack, replace `127.0.0.1` with the Buggregator service name, for example `smtp://buggregator:1025`.

### 4. Send an email and open it
Trigger any email from your app, then open http://127.0.0.1:8000. You see the rendered HTML with a Desktop / Tablet / Mobile width switcher, the plain text version, From, To, CC, BCC and Reply-To, the attachments and the raw MIME source. Use the raw source when you need to debug encoding or headers.

![A Symfony Mailer confirmation email in Buggregator: HTML preview, recipients and the link found in it.](/img/tips/symfony-mailer-to-local-inbox.webp)

## Why it works
The `smtp://` DSN sends mail over plain SMTP to the host and port you give it. Buggregator listens on port 1025 with a fake SMTP server that stores each email and shows it in the UI instead of delivering it.
