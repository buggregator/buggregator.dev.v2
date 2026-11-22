---
slug: laravel-sms-notifications
title: Test Laravel SMS notifications without sending
description: In local, route Laravel's Vonage SMS notifications to a small custom channel that posts the text to Buggregator. You read it in the UI; no phone gets it.
query: laravel sms notification
feature: SMS
feature_page: /features/sms
docs: https://docs.buggregator.dev/config/sms.html#laravel
requires: null
related: [twilio-sms-without-sending, grab-otp-code-from-test-email, laravel-mail-to-local-inbox]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To test Laravel SMS notifications without sending them, add a small custom notification channel that posts the message to Buggregator's `/sms` endpoint, and use it instead of the `vonage` channel in your local environment. Your `toVonage()` text then shows up in the Buggregator UI with the recipient and sender. Nothing reaches a phone, and no provider account is needed.

## Steps

### 1. Start Buggregator
Port 8000 is the web UI and the SMS endpoint.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Add a channel that posts to Buggregator
A Laravel custom channel is a class with a `send()` method. This one reads the same `VonageMessage` your notification already builds and posts it in Vonage's field format to `/sms/vonage`.

```php
<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;

class BuggregatorSmsChannel
{
    public function send(object $notifiable, Notification $notification): void
    {
        $message = $notification->toVonage($notifiable);

        Http::post('http://127.0.0.1:8000/sms/vonage', [
            'api_key' => 'local',
            'api_secret' => 'local',
            'from' => $message->from ?? 'Laravel',
            'to' => $notifiable->routeNotificationFor('vonage', $notification),
            'text' => $message->content,
        ]);
    }
}
```

In Docker Compose, replace `127.0.0.1:8000` with the Buggregator service name, for example `buggregator:8000`.

### 3. Use it in local only
In the notification's `via()` method, return the class name of the custom channel when the app runs locally. Your `toVonage()` method stays as it is.

```php
use App\Notifications\Channels\BuggregatorSmsChannel;

public function via(object $notifiable): array
{
    return app()->isLocal() ? [BuggregatorSmsChannel::class] : ['vonage'];
}
```

The recipient comes from `routeNotificationForVonage()` on your notifiable model, as with the real channel.

### 4. Send the notification and read it
Trigger the notification, for example a login code. Open `http://127.0.0.1:8000`. The SMS shows with a Vonage badge, the sender, the recipient and the text.

### 5. Keep apps apart
Add a project name as one more path segment, for example `/sms/vonage/shop`, to keep each app's messages in their own project.

## Why it works
Laravel calls `send()` on whatever channel `via()` returns. The custom channel turns your `VonageMessage` into one HTTP POST. Any POST whose path starts with `/sms` goes to Buggregator's SMS module; with `/sms/vonage` it reads `from`, `to` and `text` by Vonage's field names and stores the message instead of sending it. If a field is missing, the card lists it as a warning.
