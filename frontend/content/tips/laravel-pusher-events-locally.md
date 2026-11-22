---
slug: laravel-pusher-events-locally
title: Check Laravel Pusher broadcasts locally, before Pusher
description: Point PUSHER_HOST and PUSHER_PORT at Buggregator. Every broadcast shows its channel, event and data, and can still go on to Pusher or soketi.
query: laravel pusher
feature: Broadcast
feature_page: /features/broadcast-events
docs: https://docs.buggregator.dev/config/broadcast.html#laravel-with-pusher
requires: "v2.13.0"
related: [laravel-reverb-see-every-broadcast, laravel-echo-event-never-arrived, laravel-see-outgoing-api-calls]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Set `PUSHER_HOST=127.0.0.1`, `PUSHER_PORT=8000` and `PUSHER_SCHEME=http` in `.env`. Laravel then sends every Pusher broadcast to Buggregator first. You see each event's channel, name and data on your machine. Set `BROADCAST_UPSTREAM` and Buggregator passes each event on to Pusher or soketi, so the browser keeps getting live updates.

## Steps

### 1. Start Buggregator
Broadcast events need Buggregator 2.13.0 or newer. They arrive on the HTTP port 8000.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Point Laravel's Pusher connection at Buggregator
Keep your app id, key and secret. Change only where the server sends broadcasts.

```dotenv
# .env
BROADCAST_CONNECTION=pusher
PUSHER_HOST=127.0.0.1
PUSHER_PORT=8000
PUSHER_SCHEME=http
```

Older Laravel apps use `BROADCAST_DRIVER` instead of `BROADCAST_CONNECTION`. When Laravel runs in Docker Compose next to Buggregator, use the service name, for example `buggregator`, as the host.

### 3. Keep the browser on the real server
`php artisan install:broadcasting --pusher` writes `VITE_PUSHER_HOST="${PUSHER_HOST}"` and `VITE_PUSHER_PORT="${PUSHER_PORT}"`. Once `PUSHER_HOST` points at Buggregator, Echo in the browser would connect there too. Buggregator does not accept Echo's Pusher WebSocket connections. Set the `VITE_PUSHER_*` values to your real server, as they were before.

### 4. Pass the events on, if you want them live
Without an upstream, Buggregator stores each event and answers your app with `{}`, as Pusher does, and browsers get nothing. To keep live updates, give it your real server. For Pusher it is the `api-<cluster>.pusher.com` host Laravel would use; for a local soketi, its own address.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -e BROADCAST_UPSTREAM=https://api-mt1.pusher.com \
  ghcr.io/buggregator/server:latest
```

Buggregator sends the same path, query and body, so the signature stays valid. It waits up to 5 seconds. If the real server cannot be reached, your app gets `502` and the event is still stored.

### 5. Broadcast and look
Fire an event in your app, then open **Broadcast** in the menu at http://127.0.0.1:8000. On the left are the channels that got events, with their kind: public, private, presence or encrypted. On the right are their events. Open one to see its payload, what changed since the previous event of the same name, and **Copy as cURL**. The event name is the full class name, for example `App\Events\OrderShipped`.

## Why it works
Laravel's Pusher driver sends each broadcast as a signed `POST /apps/<app-id>/events` request. Buggregator answers that API on port 8000 and stores one event per broadcast. Only the server side changes: the browser still talks to the real Pusher or soketi.
