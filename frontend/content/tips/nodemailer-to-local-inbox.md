---
slug: nodemailer-to-local-inbox
title: Nodemailer to a local inbox, no real email sent
description: Create a Nodemailer SMTP transport for 127.0.0.1:1025 and every message lands in Buggregator with HTML preview and attachments. Nothing is delivered.
query: nodemailer smtp
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#any-other-app
requires: null
related: [smtp-catcher-in-docker-compose, laravel-mail-to-local-inbox, django-mail-to-local-inbox, rails-mail-to-local-inbox]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Point a Nodemailer SMTP transport at Buggregator: host `127.0.0.1`, port `1025`, `secure: false`. Every message your Node.js app sends shows up in the Buggregator UI with the HTML preview and attachments, and no real email is sent.

## Steps

### 1. Start Buggregator
Install the binary and run it. It is one file with no dependencies. The SMTP server starts on port 1025, the web UI on port 8000.

```bash
curl -fsSL https://raw.githubusercontent.com/buggregator/server/master/scripts/install.sh | sh
buggregator
```

If `~/.local/bin` is not in your PATH, run `~/.local/bin/buggregator`. Prefer containers? Use Docker or Docker Compose, as shown on Getting Started.

### 2. Create the transport
Use this transport in development. No authentication is needed and there is no TLS to configure.

```js
const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
});
```

If your app runs in Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator`.

### 3. Send a message as usual
Your code that sends mail through `transporter` stays the same. Trigger an email from your app: a sign-up, a reset link, a report.

### 4. Open the inbox
Open http://127.0.0.1:8000. Each message shows the rendered HTML with a desktop/mobile switcher, the plain text version, From, To, CC, BCC and Reply-To, the attachments and the raw MIME source.

## Why it works
Buggregator includes a fake SMTP server. Nodemailer talks to it like to any mail server, but Buggregator stores the email and shows it in the UI instead of delivering it. Any app that can send email over SMTP works the same way, so your Node, PHP, Python and Ruby apps can share one inbox.
