---
slug: soketi-see-every-event
title: See every event your app publishes to soketi
description: Point your app's Pusher settings at Buggregator and set BROADCAST_UPSTREAM to soketi. Each event shows its channel and data, and soketi still delivers it.
query: soketi
feature: Broadcast
feature_page: /features/broadcast-events
docs: https://docs.buggregator.dev/config/broadcast.html#forward-to-the-real-server
requires: "v2.13.0"
related: [laravel-pusher-events-locally, laravel-echo-event-never-arrived, laravel-reverb-see-every-broadcast]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Send your app's Pusher API calls to Buggregator on port 8000 instead of soketi on 6001, and start Buggregator with `BROADCAST_UPSTREAM=http://127.0.0.1:6001`. Every event your backend publishes then shows up in Buggregator with its channel, name and data. Buggregator sends each one on to soketi, so your browser clients keep getting it.

## Steps

### 1. Start Buggregator with soketi as the upstream
soketi listens on port 6001 by default, with the app id `app-id`, key `app-key` and secret `app-secret`. Change them to yours if you set your own. These settings belong to Buggregator, not to your app.

```bash
# Buggregator binary, soketi on the same machine
BROADCAST_UPSTREAM=http://127.0.0.1:6001 BROADCAST_APPS=app-key:app-secret buggregator
```

In Docker, reach soketi on your machine through `host.docker.internal`:

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  --add-host=host.docker.internal:host-gateway \
  -e BROADCAST_UPSTREAM=http://host.docker.internal:6001 \
  -e BROADCAST_APPS=app-key:app-secret \
  ghcr.io/buggregator/server:latest
```

When soketi runs in the same Docker Compose stack, use its service name, for example `http://soketi:6001`.

### 2. Point your backend at Buggregator
Keep the app id, key and secret. Change only the host and port your backend sends events to. With the Pusher server SDK for Node.js:

```js
const Pusher = require('pusher')

const pusher = new Pusher({
  appId: 'app-id', key: 'app-key', secret: 'app-secret',
  host: '127.0.0.1', port: '8000', useTLS: false,
})

pusher.trigger('orders', 'OrderShipped', { id: 42 })
```

In Laravel, change the server-side Pusher settings in `.env`:

```dotenv
BROADCAST_CONNECTION=pusher
PUSHER_HOST=127.0.0.1
PUSHER_PORT=8000
PUSHER_SCHEME=http
```

### 3. Keep browser clients on soketi
Only the backend changes. Browser clients still open their Pusher WebSocket connection to soketi on port 6001, because Buggregator does not accept those connections. In a Laravel app, `VITE_PUSHER_HOST` and `VITE_PUSHER_PORT` often copy `PUSHER_HOST` and `PUSHER_PORT`. Set them to soketi's own address and rebuild your frontend assets.

```dotenv
VITE_PUSHER_HOST=127.0.0.1
VITE_PUSHER_PORT=6001
VITE_PUSHER_SCHEME=http
```

### 4. Open the Broadcast console
Publish an event and open http://127.0.0.1:8000, then **Broadcast**. On the left you see each channel with its kind and event count. On the right, each event with its time, name, size and payload. Open one to see the **Changes** since the previous event of the same name, whether the signature is `valid`, and the upstream URL with soketi's status and response time.

## Why it works
A Pusher server SDK publishes each event as a signed `POST /apps/<app-id>/events` request. Buggregator answers that API on port 8000, stores the event, and sends the same path, query and body to the upstream, so soketi accepts the signature. Your backend gets soketi's answer. If soketi is down, the backend gets `502` and the event is still stored.
