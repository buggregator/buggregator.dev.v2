---
slug: drupal-mail-local-inbox
title: Drupal mail to a local inbox
description: Switch Drupal core to its Symfony mailer and point the SMTP transport at Buggregator on port 1025. Site mail is caught locally, nobody gets it.
query: drupal smtp
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#any-other-app
requires: null
related: [wordpress-mail-to-local-inbox, magento-email-local, smtp-catcher-in-docker-compose, test-html-email-on-mobile-width]
checked: { date: 2026-11-22, version: v2.13.0 }
---
On Drupal 10.2 or newer, add two settings to `settings.php`: use core's `symfony_mailer` mail plugin, and point its SMTP transport at `127.0.0.1`, port `1025`. Every email your site sends then lands in Buggregator: account mails, password resets, contact forms. Nothing reaches real users.

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

### 2. Switch to core's Symfony mailer
Drupal 10.2 added a mail plugin built on Symfony Mailer. Drupal still marks it experimental. Turn it on in `settings.php`, or in `settings.local.php` so it stays on your machine:

```php
$config['system.mail']['interface'] = ['default' => 'symfony_mailer'];
```

### 3. Point the SMTP transport at Buggregator
In the same file, set the transport. No user, password or TLS is needed.

```php
$config['system.mail']['mailer_dsn'] = [
  'scheme' => 'smtp',
  'host' => '127.0.0.1',
  'port' => 1025,
];
```

If Drupal runs in Docker next to Buggregator, use the Buggregator service name as the host, for example `buggregator`.

### 4. Send an email and open it
Request a password reset or submit a contact form. Open http://127.0.0.1:8000. You see the rendered email, the addresses, the attachments and the raw MIME source.

## Why it works
Buggregator includes a fake SMTP server on port 1025. Drupal's SMTP transport delivers to it like to any mail server, and Buggregator stores the email and shows it in the UI instead of sending it on. Because the change sits in settings files, the site's own mail configuration in the database stays as it is.

Source: the Drupal [change record](https://www.drupal.org/node/3369935) for the Symfony mailer plugin.
