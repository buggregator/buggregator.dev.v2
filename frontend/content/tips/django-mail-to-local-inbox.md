---
slug: django-mail-to-local-inbox
title: Django emails in a local inbox, not the console
description: Use Django's SMTP email backend with host 127.0.0.1 and port 1025. Every email lands in Buggregator with HTML, headers and attachments.
query: django email backend
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#any-other-app
requires: null
related: [rails-mail-to-local-inbox, nodemailer-to-local-inbox, laravel-mail-to-local-inbox, smtp-catcher-in-docker-compose]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Switch the Django email backend from console to SMTP and point it at Buggregator: host `127.0.0.1`, port `1025`. Every email your Django app sends then shows up in the Buggregator UI with the rendered HTML, headers and attachments, and nothing is delivered.

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

### 2. Django 6.1 and newer: set the default mailer
Django 6.1 configures email with the `MAILERS` setting. Projects created with `startproject` get the console backend as the default mailer, which prints email to the console. Use the SMTP backend instead. This is Django's own example:

```python
MAILERS = {
    "default": {
        "BACKEND": "django.core.mail.backends.smtp.EmailBackend",
        "OPTIONS": {
            "host": "localhost",
        },
    },
}
```

Set `"host"` to `"127.0.0.1"` and add `"port": 1025` under `OPTIONS`. Without a port, the SMTP backend uses 25.

### 3. Without MAILERS: set EMAIL_HOST and EMAIL_PORT
Without `MAILERS`, Django uses `EMAIL_BACKEND`, and its default is `django.core.mail.backends.smtp.EmailBackend`. If you set the console backend for development, remove that line or set it back to the SMTP backend. Then set `EMAIL_HOST = '127.0.0.1'` and `EMAIL_PORT = 1025`. Django 6.1 marks these `EMAIL_*` settings as deprecated, so move to `MAILERS` when you upgrade.

### 4. Send an email and open it
Send mail from your app as usual. Open http://127.0.0.1:8000 and check the HTML preview, the plain text version, the addresses, the attachments and the raw MIME source. In Docker Compose, use the Buggregator service name, for example `buggregator`, instead of `127.0.0.1`.

## Why it works
Django's SMTP backend talks plain SMTP to whatever host and port you give it. Buggregator listens on port 1025, needs no authentication, and stores each email for the UI instead of delivering it.

Sources: Django [settings reference](https://docs.djangoproject.com/en/stable/ref/settings/#email-backend) and [sending email](https://docs.djangoproject.com/en/stable/topics/email/).
