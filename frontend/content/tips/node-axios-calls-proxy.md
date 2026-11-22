---
slug: node-axios-calls-proxy
title: See every request axios sends
description: Pass an HttpsProxyAgent to axios and turn off its own proxy. Each outgoing request and its response shows up in Buggregator. For local work only.
query: axios proxy
feature: HTTP
feature_page: /features/http-proxy
docs: https://docs.buggregator.dev/config/http-proxy.html#javascript-—-node-js-—-axios
requires: null
related: [laravel-see-outgoing-api-calls, python-requests-through-debug-proxy, go-http-client-proxy, express-errors-locally]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Give axios an `HttpsProxyAgent` that points at Buggregator's proxy on port 8080, and set `proxy: false`. Start Node with `NODE_TLS_REJECT_UNAUTHORIZED=0`. Every axios request then shows up in Buggregator with its headers, body, response, status code and time. TLS checks are off, so keep it to local development.

## Steps

### 1. Start Buggregator with the proxy port
Port 8000 is the UI, port 8080 is the proxy. Bind the proxy to this machine only: it forwards to any host.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:8080:8080 \
  ghcr.io/buggregator/server:latest
```

### 2. Add the agent package

```bash
npm install https-proxy-agent
```

### 3. Send axios through the proxy
`proxy: false` turns off axios's own proxy handling, so the agent does the work.

```js
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'

const agent = new HttpsProxyAgent('http://127.0.0.1:8080')

const response = await axios.get('https://api.example.com/users', {
  httpsAgent: agent,
  proxy: false,
})
```

In Docker Compose, use the service name: `http://buggregator:8080`.

### 4. Turn off the certificate check
`https-proxy-agent` does not pass `rejectUnauthorized` on to the target site. Turn the check off for the whole process when you start it.

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 node app.js
```

### 5. Read the request and the response
Open `http://127.0.0.1:8000`. Each call shows the full URL, request and response headers and body, a color-coded status code and the response time in milliseconds. JSON bodies open as a tree.

## Why it works
Buggregator's proxy sits between your app and the API. It forwards each request to the real server and records both directions. For HTTPS it makes a certificate for the target host on the fly, signed by a CA kept in memory. That is why Node must skip the certificate check.
