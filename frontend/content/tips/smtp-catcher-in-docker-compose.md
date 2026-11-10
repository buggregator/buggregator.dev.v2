---
slug: smtp-catcher-in-docker-compose
title: Catch dev email in docker-compose with one service
description: Add Buggregator as a service in docker-compose.yml and set your app's mail host to its service name. Every email lands in the UI on port 8000.
query: smtp server docker
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/getting-started.html#docker-compose
requires: null
related: [laravel-mail-to-local-inbox, symfony-mailer-to-local-inbox, nodemailer-to-local-inbox, test-html-email-on-mobile-width]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Need an SMTP server in Docker for development? Add Buggregator as one more service in your `docker-compose.yml`, then set your app's mail host to `buggregator` and the port to `1025`. Every email your app sends shows up in the Buggregator UI on port 8000 instead of a real inbox.

## Steps

### 1. Add the service
Put Buggregator in your `docker-compose.yml` next to your other services. No environment configuration is needed.

```yaml
services:
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:1025:1025
      - 127.0.0.1:9912:9912
      - 127.0.0.1:9913:9913
```

You only need to expose the ports for the features you use. Port 8000 is the web UI and the only required port. Port 1025 is the SMTP server. The `127.0.0.1:` prefix keeps each port on your machine.

### 2. Point your app at the service name
Other services in the same Compose stack reach Buggregator by its service name. For a Laravel app, change these lines in `.env`:

```dotenv
# SMTP — email capture
MAIL_HOST=buggregator
MAIL_PORT=1025
```

Other frameworks follow the same rule: wherever their docs say `127.0.0.1`, use `buggregator`. For Symfony that means `MAILER_DSN=smtp://buggregator:1025`. No authentication is required.

### 3. Send an email and open the UI
Trigger any email from your app, then open http://127.0.0.1:8000. The email appears with the HTML preview, plain text, addresses, attachments and raw source.

## Why it works
Buggregator includes a fake SMTP server on port 1025 that stores each email instead of delivering it. Inside one Compose stack, the service name resolves to the Buggregator container, so changing the host is the only change your app needs.
