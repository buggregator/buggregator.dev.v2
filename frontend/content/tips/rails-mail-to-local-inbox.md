---
slug: rails-mail-to-local-inbox
title: Rails mail to a local inbox shared by all your apps
description: Point Action Mailer's SMTP settings at 127.0.0.1:1025. Rails emails land in Buggregator, in the same inbox as your Laravel and Node apps.
query: rails letter opener
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#any-other-app
requires: null
related: [django-mail-to-local-inbox, nodemailer-to-local-inbox, laravel-mail-to-local-inbox, smtp-catcher-in-docker-compose]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Instead of a Rails letter opener setup, send development email over SMTP to Buggregator: set Action Mailer's `smtp_settings` to address `127.0.0.1`, port `1025`. Every email lands in the Buggregator UI, the same inbox your other apps on this machine can use.

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

### 2. Set the SMTP settings for development
Add this to your development environment file. No username, password or TLS setup is needed.

```ruby
# config/environments/development.rb
config.action_mailer.smtp_settings = {
    address: '127.0.0.1',
    port: 1025,
}
```

### 3. Make sure the delivery method is SMTP
Action Mailer's `delivery_method` defaults to `:smtp`. If your development file sets another one, for example `:letter_opener` or `:test`, change it in the same file:

```ruby
config.action_mailer.delivery_method = :smtp
```

### 4. Send an email and open it
Trigger any mailer, then open http://127.0.0.1:8000. You see the rendered HTML with a desktop/mobile switcher, the plain text version, the addresses, the attachments and the raw MIME source. In Docker Compose, use the Buggregator service name, for example `buggregator`, instead of `127.0.0.1`.

![A Rails welcome email in Buggregator's mail view, with its HTML preview and the links found in it.](/img/tips/rails-mail-to-local-inbox.webp)

## Why it works
Buggregator includes a fake SMTP server that stores each email instead of delivering it. Any app that can send email over SMTP works with it, so a Rails app, a Laravel app and a Node app can all send to the same inbox.

Sources: Rails guides, [Action Mailer configuration](https://guides.rubyonrails.org/action_mailer_basics.html#action-mailer-configuration) and [config.action_mailer.delivery_method](https://guides.rubyonrails.org/configuring.html#config-action-mailer-delivery-method).
