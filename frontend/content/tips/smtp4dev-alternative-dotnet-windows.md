---
slug: smtp4dev-alternative-dotnet-windows
title: A local inbox for .NET apps, on Windows without Docker
description: Run Buggregator as a Windows program and point SmtpClient or MailKit at 127.0.0.1:1025. Every email lands in a local inbox. Nothing is delivered.
query: smtp4dev
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/guides/windows.html
requires: null
related: [smtp-catcher-in-docker-compose, test-html-email-on-mobile-width, wait-for-email-in-e2e-tests, grab-otp-code-from-test-email]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install Buggregator as a Windows program with one PowerShell line, start it, and send mail from your .NET app to `127.0.0.1` on port 1025. Every email from `SmtpClient` or MailKit then lands in a local inbox at http://localhost:8000, with the HTML preview, attachments and raw source. Nothing is delivered, and no Docker is needed.

## Steps

### 1. Install and start it
In PowerShell:

```powershell
irm https://raw.githubusercontent.com/buggregator/server/master/scripts/install.ps1 | iex
& "$env:LOCALAPPDATA\Programs\buggregator\buggregator.exe"
```

The script downloads the latest release for your CPU and checks it against the release's checksums. You can also download `buggregator-windows-amd64.exe` (ARM: `buggregator-windows-arm64.exe`) from the GitHub release.

### 2. Point SmtpClient at it
No user name, password or TLS.

```csharp
using System.Net.Mail;

using var client = new SmtpClient("127.0.0.1", 1025);
client.Send("app@example.com", "dev@example.com", "Hello", "It works.");
```

### 3. Or point MailKit at it
Connect without TLS: the local server offers none.

```csharp
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

var message = new MimeMessage();
message.From.Add(MailboxAddress.Parse("app@example.com"));
message.To.Add(MailboxAddress.Parse("dev@example.com"));
message.Subject = "Hello";
message.Body = new TextPart("plain") { Text = "It works." };

using var client = new SmtpClient();
await client.ConnectAsync("127.0.0.1", 1025, SecureSocketOptions.None);
await client.SendAsync(message);
await client.DisconnectAsync(true);
```

### 4. App in a container?
A container that sends to Buggregator running on Windows uses `host.docker.internal` instead of `127.0.0.1`. Allow `buggregator.exe` through Windows Firewall when Windows asks on the first start, or containers cannot reach it.

### 5. Open the inbox
Send an email and open http://localhost:8000. You see the rendered HTML with a Desktop / Tablet / Mobile width switcher, the plain text, the addresses, the attachments and the raw MIME source.

## Why it works
Buggregator includes an SMTP server on port 1025 that accepts every message and stores it instead of sending it on. Your .NET code talks to it like to any mail server, so only the host and port change. The same program also takes Sentry errors, logs and HTTP dumps if you need them later.
