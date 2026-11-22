---
slug: fake-smtp-single-binary
title: A fake SMTP server as one binary, no Docker
description: Install one Buggregator binary, run it, and point your app's SMTP at 127.0.0.1:1025. Every email lands in a browser inbox on port 8000.
query: fake smtp
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/install.html
requires: null
related: [smtp4dev-alternative-dotnet-windows, smtp-catcher-in-docker-compose, python-smtp-local-inbox, laravel-mail-to-local-inbox]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Buggregator is a fake SMTP server in one file. Install it with one command, run `buggregator`, and set your app's SMTP host to `127.0.0.1` and port to `1025`. Every email your app sends lands in the inbox at http://127.0.0.1:8000 instead of a real mailbox. No Docker, no PHP, no database server.

## Steps

### 1. Install the binary
On Linux and macOS, the install script picks the file for your system, checks its checksums and puts it in `~/.local/bin/buggregator`. No `sudo`.

```bash
curl -fsSL https://raw.githubusercontent.com/buggregator/server/master/scripts/install.sh | sh
```

On Windows, in PowerShell:

```powershell
irm https://raw.githubusercontent.com/buggregator/server/master/scripts/install.ps1 | iex
```

### 2. Start it
By default every port listens on all network interfaces. The flags keep the UI and SMTP on your machine only, and `-db` keeps your emails after a restart.

```bash
buggregator -http-addr 127.0.0.1:8000 -smtp-addr 127.0.0.1:1025 -db ./buggregator.db
```

If `~/.local/bin` is not in your `PATH`, run `~/.local/bin/buggregator`.

On Windows, the installer does not add the binary to `PATH`. In PowerShell:

```powershell
& "$env:LOCALAPPDATA\Programs\buggregator\buggregator.exe" -http-addr 127.0.0.1:8000 -smtp-addr 127.0.0.1:1025 -db .\buggregator.db
```

### 3. Point your app's SMTP at it
Host `127.0.0.1`, port `1025`. A user name and password are optional: Buggregator accepts any, and a user name picks the project the email lands in. For a Laravel app:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

For Symfony: `MAILER_DSN=smtp://127.0.0.1:1025`.

### 4. Send a test email without an app
curl speaks SMTP too. Write a small message and send it:

```bash
printf 'From: app@example.com\r\nTo: user@example.com\r\nSubject: Hello\r\n\r\nIt works.\r\n' > mail.txt
curl smtp://127.0.0.1:1025 \
  --mail-from app@example.com \
  --mail-rcpt user@example.com \
  --upload-file mail.txt
```

Open http://127.0.0.1:8000. The email is there with its HTML preview, plain text, addresses, attachments and raw source.

## Why it works
Buggregator includes an SMTP server on port 1025 that stores each email instead of delivering it. The same binary serves the web UI on port 8000, with the frontend and SQLite built in, so there is nothing else to install. If port 1025 is already taken, Buggregator stops at start with `address already in use`; move it with `-smtp-addr :2525`.
