---
slug: magento-email-local
title: Magento 2 email to a local inbox
description: Set Magento's mail transport to SMTP on 127.0.0.1:1025. Order, invoice and account emails land in Buggregator with HTML preview; none are delivered.
query: magento email
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#magento-2
requires: null
related: [smtp-catcher-in-docker-compose, test-html-email-on-mobile-width, wordpress-mail-to-local-inbox, drupal-mail-local-inbox]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To catch Magento 2 email locally, set the mail transport to `smtp` with host `127.0.0.1` and port `1025`, by three `bin/magento config:set` commands or three environment variables. Order confirmations, invoices and account emails then land in Buggregator, with the HTML preview and raw source. No customer gets them.

## Steps

### 1. Start Buggregator
Port 8000 is the web UI, port 1025 is the SMTP server.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  ghcr.io/buggregator/server:latest
```

### 2. Set the SMTP transport
Run three commands in your Magento root.

```bash
bin/magento config:set system/smtp/transport smtp
bin/magento config:set system/smtp/host 127.0.0.1
bin/magento config:set system/smtp/port 1025
```

The same settings are in the admin: **Stores → Settings → Configuration → Advanced → System → Mail Sending Settings**. Also check that **Disable Email Communications** is set to **No** there.

### 3. Or use environment variables
Magento also reads config values from environment variables. Set these in the environment of your PHP process.

```dotenv
CONFIG__DEFAULT__SYSTEM__SMTP__TRANSPORT="smtp"
CONFIG__DEFAULT__SYSTEM__SMTP__HOST="127.0.0.1"
CONFIG__DEFAULT__SYSTEM__SMTP__PORT="1025"
```

### 4. Use the service name in Docker Compose
If Magento and Buggregator run in the same Compose stack, use the Buggregator service name as the host, for example `buggregator`, and keep port `1025`.

### 5. Place an order and open the email
Place a test order or create an account in the storefront. Open `http://127.0.0.1:8000`. You see the rendered HTML with a Desktop / Tablet / Mobile width switcher, the addresses, the attachments and the raw MIME source.

## Why it works
With the SMTP transport, Magento hands each email to the mail server at the host and port you set. Buggregator listens on port 1025 with a fake SMTP server that stores each email and shows it in the UI instead of delivering it. Your store code does not change, only the mail settings.
