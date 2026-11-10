---
slug: laravel-mail-to-local-inbox
title: Laravel mail to a local inbox, three .env lines
description: Point Laravel's SMTP mailer at Buggregator on port 1025 and every email lands in a local inbox. Nothing reaches a real address.
query: laravel mailpit
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html
requires: null
related:
  - symfony-mailer-to-local-inbox
checked:
  date: 2026-11-10
  version: v2.8.0
---
Set three lines in `.env` and Laravel sends every email to Buggregator on port 1025.

## Steps

### 1. Point the mailer at Buggregator

```dotenv
# .env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

### 2. Send a mail

Open the [UI](http://127.0.0.1:8000) and see it there.

## Why it works

Buggregator listens for SMTP on port 1025 and keeps every message.
