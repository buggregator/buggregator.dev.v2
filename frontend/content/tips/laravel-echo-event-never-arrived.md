---
slug: laravel-echo-event-never-arrived
title: Echo got nothing? See what Laravel actually broadcast
description: Put Buggregator between Laravel and Reverb or Pusher. See whether the event left the app, on which channel, under which name, with a valid signature.
query: laravel echo
feature: Broadcast
feature_page: /features/broadcast-events
docs: https://docs.buggregator.dev/config/broadcast.html#check-the-signature
requires: "v2.13.0"
related: [laravel-reverb-see-every-broadcast, laravel-pusher-events-locally, laravel-queue-job-errors, laravel-logs-in-a-live-view]
checked: { date: 2026-11-22, version: v2.13.0 }
---
When Laravel Echo receives nothing, send Laravel's broadcasts through Buggregator. It shows every event your backend sent to Reverb or Pusher: the channel, the event name, the data and whether the signature is valid. No event in Buggregator means it never left the app. An event on a different channel or under a different name means Echo listens in the wrong place.

## Steps

### 1. Route broadcasts through Buggregator
Point the server-side settings at Buggregator, keep Echo on the real server, and forward the events with `BROADCAST_UPSTREAM`. For Reverb:

```dotenv
REVERB_HOST=127.0.0.1
REVERB_PORT=8000
REVERB_SCHEME=http
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
```

With Pusher, set `PUSHER_HOST=127.0.0.1`, `PUSHER_PORT=8000` and `PUSHER_SCHEME=http` instead.

### 2. Turn on the signature check
Start Buggregator with your app key and secret, and the real server as upstream:

```bash
BROADCAST_APPS=your-app-key:your-app-secret \
BROADCAST_UPSTREAM=http://127.0.0.1:8080 \
PROXY_ADDR=:8081 \
buggregator
```

`PROXY_ADDR` moves Buggregator's HTTP proxy off port 8080, which Reverb uses by default.

### 3. No event at all? It never left the app
Trigger the action and open **Broadcast** at http://127.0.0.1:8000. If nothing shows up, Laravel did not send it. Events that implement `ShouldBroadcast` go through the queue, so a queue worker must run:

```bash
php artisan queue:work
```

Or implement `ShouldBroadcastNow` to send the event at once, without the queue.

### 4. Event is there? Compare channel and name
Open the event. Check the channel: a `PrivateChannel('orders.1')` is sent as `private-orders.1`, and Echo listens to it with `Echo.private('orders.1')`. Check the name: by default it is the full class name, for example `App\Events\OrderShipped`, and `.listen('OrderShipped')` matches it. If the event defines `broadcastAs()`, listen with a leading dot, for example `.listen('.order.shipped')`.

### 5. Check the signature and the real server's answer
The event says `valid`, or `invalid` with a warning when the key or secret in your app do not match. Events from keys you did not list say `not_checked`. The event also shows the real server's answer. If that server cannot be reached, your app gets `502` and the event is still stored.

## Why it works
Laravel sends every broadcast to the broadcast server as a signed HTTP request. Buggregator answers that same API on port 8000, stores each request as an event, and sends it on to the real server. So you see exactly what left your backend, before Reverb or Pusher touches it, and you can tell a backend problem from a frontend one.
