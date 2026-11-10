---
slug: replay-a-captured-request
title: Send a captured request again with one cURL
description: Every request Buggregator captures comes with a ready cURL command. Copy it, paste it in a terminal, and the same request arrives again.
query: copy as curl
feature: HTTP
feature_page: /features/http-dumps
docs: https://docs.buggregator.dev/config/http-dumps.html#what-you-see-in-the-ui
requires: null
related: [webhook-payload-before-the-handler, python-requests-through-debug-proxy, mock-api-with-fake-data]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Buggregator gives every captured HTTP request a copy as cURL button: the URL, headers and body written as one `curl` command. Paste it in a terminal and the same request arrives again. You do not need the original sender to trigger the webhook or callback again.

## Steps

### 1. Capture the request
Send the request to Buggregator with `http-dump` as the URL user name. Point a webhook, a callback or your own client at it. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator`.
```bash
curl 'http://http-dump@127.0.0.1:8000/any/path?foo=bar'
```

### 2. Or mark it with a header
When the client cannot change the URL user name, add the `X-Buggregator-Event` header instead.
```bash
curl 'http://127.0.0.1:8000/any/path?foo=bar' \
  --header 'X-Buggregator-Event: http-dump'
```

### 3. Copy the cURL command
Open `http://127.0.0.1:8000` and open the request. Next to the method, URI, headers, cookies, form data and files, you find the cURL command with a copy button.

### 4. Paste it in a terminal
Run the command and the same request arrives again. Uploaded files are named in the command, not attached.

## Why it works
Buggregator stores the whole request it received, then writes it back out as a `curl` command. Running that command sends the same method, URL, headers and body again. Uploaded files are the one part it does not carry.
