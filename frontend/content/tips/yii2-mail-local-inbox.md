---
slug: yii2-mail-local-inbox
title: Yii2 mailer to a local inbox
description: Give the Yii2 Symfony Mailer an smtp://127.0.0.1:1025 DSN and turn off useFileTransport. Every email lands in Buggregator; nothing is delivered.
query: yii2 mailer
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#any-other-app
requires: null
related: [symfony-mailer-to-local-inbox, smtp-catcher-in-docker-compose, test-html-email-on-mobile-width, yii-dumps-without-breaking-output]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To catch Yii2 email locally, set the mailer's transport DSN to `smtp://127.0.0.1:1025` and `useFileTransport` to `false`. Every email your app sends then lands in Buggregator, with the HTML preview, attachments and raw source. Nothing reaches a real inbox.

## Steps

### 1. Start Buggregator
Port 8000 is the web UI, port 1025 is the SMTP server.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  ghcr.io/buggregator/server:latest
```

### 2. Point the mailer at Buggregator
With `yiisoft/yii2-symfonymailer`, set the transport DSN in the mailer config. No username or password is needed.

```php
'mailer' => [
    'class' => \yii\symfonymailer\Mailer::class,
    'viewPath' => '@app/mail',
    'useFileTransport' => false,
    'transport' => [
        'dsn' => 'smtp://127.0.0.1:1025',
    ],
],
```

The basic app template sets `useFileTransport` to `true`, which writes each email to a file instead of sending it. Set it to `false`, or the DSN is never used.

### 3. Use the service name in Docker Compose
If your app and Buggregator run in the same Compose stack, replace `127.0.0.1` with the Buggregator service name, for example `smtp://buggregator:1025`.

### 4. Send an email and open it
Send mail as usual:

```php
Yii::$app->mailer->compose('contact/html')
    ->setFrom('shop@example.com')
    ->setTo('alice@example.com')
    ->setSubject('Your order')
    ->send();
```

Open `http://127.0.0.1:8000`. You see the rendered HTML with a Desktop / Tablet / Mobile width switcher, the plain text version, the addresses, the attachments and the raw MIME source.

### 5. Keep apps apart
The SMTP user name picks the Buggregator project; the password can be anything. With `smtp://shop:any@127.0.0.1:1025`, mail lands in the project `shop`.

## Why it works
The `smtp://` DSN sends mail over plain SMTP to the host and port you give it. Buggregator listens on port 1025 with a fake SMTP server that stores each email and shows it in the UI instead of delivering it. Your mail code does not change, only the mailer config.
