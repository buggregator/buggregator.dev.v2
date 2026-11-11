---
slug: test-html-email-on-mobile-width
title: Check an HTML email at phone width before it ships
description: Send your app's email to Buggregator on port 1025, then switch the HTML preview between Desktop, Tablet and Mobile width. Nothing reaches a real inbox.
query: test html email
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#what-you-see-in-the-ui
requires: null
related: [laravel-mail-to-local-inbox, symfony-mailer-to-local-inbox, nodemailer-to-local-inbox, smtp-catcher-in-docker-compose]
checked: { date: 2026-11-10, version: v2.8.0 }
---
To test an HTML email before it ships, point your app's SMTP settings at Buggregator on `127.0.0.1:1025`, send the email, and open it in the Buggregator UI. The HTML preview has a Desktop / Tablet / Mobile width switcher, so you see the phone layout without sending anything to a real inbox.

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

### 2. Point your app's mail at port 1025
For Laravel, set these lines in `.env`. No authentication is needed. Any other app: set the SMTP host to `127.0.0.1` and the port to `1025`.

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 3. Send the email and open it
Trigger the email from your app as usual: a sign-up, a password reset, an order. Open http://127.0.0.1:8000. The email shows up in the UI with its rendered HTML.

### 4. Switch the preview width
Pick **Desktop**, **Tablet** or **Mobile** above the HTML preview to check the responsive layout. Look for text that overflows, buttons that are too small, and images that do not scale.

![A newsletter email in Buggregator's preview at Mobile width.](/img/tips/test-html-email-on-mobile-width.webp)

### 5. Check the rest of the message
The same email also shows the plain text version, the addresses (From, To, CC, BCC, Reply-To), the attachments and the raw MIME source. Inline images display in the HTML preview. Use the raw source when you need to debug encoding or headers.

## Why it works
Buggregator includes a fake SMTP server. Your app delivers the email to it like to any mail server, but the email is stored and shown in the UI instead of being delivered. The preview renders the HTML your app actually sent, at the width you pick.
