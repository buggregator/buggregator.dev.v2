---
slug: laravel-reverb-see-every-broadcast
title: See every Laravel Reverb event, the browser still gets it
description: Point Laravel's Reverb settings at Buggregator and set BROADCAST_UPSTREAM. Each broadcast shows its channel and data, and Echo keeps getting live updates.
query: laravel reverb
feature: Broadcast
feature_page: /features/broadcast-events
docs: https://docs.buggregator.dev/config/broadcast.html#laravel-reverb
requires: "v2.13.0"
related: [laravel-echo-event-never-arrived, laravel-pusher-events-locally, laravel-logs-in-a-live-view, webhook-payload-before-the-handler]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Point the server side of Laravel Reverb at Buggregator on port 8000 and start Buggregator with `BROADCAST_UPSTREAM` set to your real Reverb. Every event Laravel broadcasts then shows up in Buggregator with its channel, event name and JSON data. Buggregator passes each event on to Reverb, so the browser keeps getting live updates.

## Steps

### 1. Start Buggregator with the upstream
`BROADCAST_UPSTREAM` is your real Reverb server. Without it, Buggregator only stores the events and the browser gets nothing.

Reverb listens on port 8080 by default. Buggregator's HTTP proxy also uses 8080, so move the proxy when you run the binary next to Reverb:

```bash
BROADCAST_APPS=your-app-key:your-app-secret PROXY_ADDR=:8081 BROADCAST_UPSTREAM=http://127.0.0.1:8080 buggregator
```

In Docker, publish only the UI port and reach Reverb on your machine through `host.docker.internal`:

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  --add-host=host.docker.internal:host-gateway \
  -e BROADCAST_UPSTREAM=http://host.docker.internal:8080 \
  -e BROADCAST_APPS=your-app-key:your-app-secret \
  ghcr.io/buggregator/server:latest
```

### 2. Send Laravel's broadcasts to Buggregator
In `.env`, change the server-side Reverb address. Keep your real app id, key and secret: Buggregator sends the same request on, so Reverb accepts the signature.

```dotenv
BROADCAST_CONNECTION=reverb
REVERB_HOST=127.0.0.1
REVERB_PORT=8000
REVERB_SCHEME=http
```

Older Laravel apps use `BROADCAST_DRIVER` instead of `BROADCAST_CONNECTION`.

### 3. Keep the browser on Reverb
`php artisan install:broadcasting` writes `VITE_REVERB_HOST="${REVERB_HOST}"` and `VITE_REVERB_PORT="${REVERB_PORT}"`. Buggregator does not accept Echo's Pusher WebSocket connections, so give Echo Reverb's own address:

```dotenv
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

Reverb itself listens on `REVERB_SERVER_HOST` and `REVERB_SERVER_PORT`, so changing `REVERB_HOST` does not move it. Rebuild your frontend assets after changing `VITE_` values.

### 4. Check each signature
`BROADCAST_APPS` in step 1 lists your app key and secret for Buggregator (not for Laravel's `.env`). With it, every event says whether its signature is `valid` or `invalid`.

### 5. Open the Broadcast console
Trigger an event in your app and open http://127.0.0.1:8000, then **Broadcast**. On the left you see every channel with its kind and event count. On the right, each event with its time, name, size and payload. Open one to see what **Changed** since the previous event of the same name, the signature result and Reverb's answer. The event name is the full class name, for example `App\Events\OrderShipped`.

## Why it works
Laravel sends each broadcast to Reverb as a signed HTTP request (`POST /apps/<app-id>/events`). Buggregator answers that same API on port 8000, stores the event, and sends the same path, query and body to the upstream. Your app gets Reverb's real answer. If Reverb is down, your app gets `502` and the event is still stored.
