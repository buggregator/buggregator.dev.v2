---
slug: laravel-mail-to-real-gmail
title: Send one caught Laravel email to your real Gmail
description: Set an outgoing SMTP server in Buggregator, then click Send to inbox on a caught Laravel email. That one message opens in Gmail or on your phone.
query: laravel mailpit
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#send-to-a-real-inbox
requires: "v2.13.0"
related: [laravel-mail-to-local-inbox, test-html-email-on-mobile-width, smtp-catcher-in-docker-compose, wait-for-email-in-e2e-tests]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Start Buggregator with the `SMTP_RELAY_*` settings of a real mail server, such as Gmail with an app password. Then open a caught Laravel email and click **Send to inbox**. That one message goes to the address you type, and you open it in real Gmail, Outlook or on your phone. Nothing else is forwarded.

## Steps

### 1. Get an app password
Gmail needs an [app password](https://support.google.com/accounts/answer/185833) for SMTP. Your normal password does not work here.

### 2. Start Buggregator with the relay
Run the binary on your own machine. Without login, the button works only there, with the UI opened as `127.0.0.1` or `localhost`. Set the server, your login and who may get mail.

```bash
SMTP_RELAY_HOST=smtp.gmail.com \
SMTP_RELAY_USERNAME=me@gmail.com \
SMTP_RELAY_PASSWORD=app-password \
SMTP_RELAY_ALLOWED_RECIPIENTS=me@gmail.com \
buggregator
```

The port defaults to 587 with STARTTLS. `SMTP_RELAY_ALLOWED_RECIPIENTS` is required without login. It takes addresses or a whole domain, like `*@mycompany.com`. In Docker or behind a proxy, the button needs [SSO](https://docs.buggregator.dev/config/sso.html) on.

### 3. Point Laravel at Buggregator
Your app keeps sending to Buggregator, as before. Nothing reaches a real inbox on its own.

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

### 4. Send the one email you want
Open the email in Buggregator and click **Send to inbox**. Type your address. By default the message goes as it was caught, with its original To and Cc in the headers. Check **Put these addresses in To** to replace To with your address and drop Cc. The original recipients never get it.

**Settings › Email relay** shows whether sending is on and, if not, why.

## Why it works
Buggregator catches every email on port 1025 and sends none. With `SMTP_RELAY_HOST` set, the button passes one stored message to that SMTP server, only to the addresses you type and allow. Limits: 20 addresses per email, 10 emails a minute.
