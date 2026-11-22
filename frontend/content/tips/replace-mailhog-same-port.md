---
slug: replace-mailhog-same-port
title: Swap your fake SMTP server for Buggregator on port 1025
description: Stop your current mail catcher and start Buggregator on SMTP port 1025. Apps keep their mail settings, and the emails show up on port 8000.
query: mailhog alternative
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#configuration
requires: null
related: [smtp-catcher-in-docker-compose, fake-smtp-single-binary, test-html-email-on-mobile-width, team-email-sandbox]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Already send dev mail to a fake SMTP server on port 1025? Stop it and start Buggregator in its place. Buggregator's SMTP server listens on the same port 1025, so your apps keep their mail host and port, and nothing in their config changes. The emails show up in the Buggregator UI on port 8000, next to your errors, logs and dumps.

## Steps

### 1. Stop the old server
Only one program can listen on port 1025. If it is still taken, Buggregator stops at start with `failed to start TCP servers` and `address already in use`.

### 2. Start Buggregator on the same port
With Docker:

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  ghcr.io/buggregator/server:latest
```

Or as one binary, without Docker:

```bash
buggregator -http-addr 127.0.0.1:8000 -smtp-addr 127.0.0.1:1025
```

### 3. In Docker Compose, swap only the image
Keep the service's name, so your apps still reach it by the same host name. Change the image and the ports.

```yaml
services:
  mail:
    image: ghcr.io/buggregator/server:latest
    ports:
      - 127.0.0.1:8000:8000 # UI
      - 127.0.0.1:1025:1025 # SMTP
```

Here the service is called `mail`; keep whatever name yours has. Your apps' `MAIL_HOST=mail` or `MAILER_DSN=smtp://mail:1025` stays as it is.

### 4. Check the SMTP user name
Buggregator accepts any user name and password, or none. A user name picks the project the email lands in: with `MAIL_USERNAME=shop`, the email goes to the project `shop`. Without one, it goes to `default`.

### 5. Open the inbox
Send an email from your app and open http://127.0.0.1:8000. Each email shows its HTML preview with a desktop and mobile width switch, the plain text, addresses, attachments and raw source.

## Why it works
Your app only knows a host and a port for SMTP. Buggregator answers on that same port 1025 and stores each email instead of delivering it, so the app cannot tell the difference. Its web UI and testing API run on port 8000, where tests can wait for an email with `GET /api/smtp/messages/wait`.
