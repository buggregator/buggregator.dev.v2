---
slug: sentry-dsn-for-local-dev
title: The SENTRY_DSN to use on your own machine
description: Set SENTRY_DSN=http://sentry@127.0.0.1:8000/1 in any Sentry SDK and errors land in Buggregator. Put a project name in the DSN to keep apps apart.
query: sentry dsn
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#projects
requires: "v2.11.0"
related: [projects-per-service, laravel-errors-without-sentry-account, python-script-errors-sentry, sentry-locally-without-self-hosting]
checked: { date: 2026-11-22, version: v2.13.0 }
---
For local development, use `SENTRY_DSN=http://sentry@127.0.0.1:8000/1` with Buggregator running on your machine. The same DSN works in the Sentry SDKs for PHP, JavaScript, Python and Go. Errors then land in the Buggregator UI on port 8000, not in a Sentry account. To keep apps apart, name the project in the DSN: `http://sentry@127.0.0.1:8000/shop` in PHP, or `http://shop@127.0.0.1:8000/1` in SDKs that accept only a number at the end.

## Steps

### 1. Start Buggregator
Errors arrive on the HTTP port 8000, the same port as the UI.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Set the DSN in your app
The key before `@` can be any word, and the `1` at the end can be any number. Laravel reads its own variable name.

```dotenv
# PHP, Symfony, Spiral, Node.js, Python, Go
SENTRY_DSN=http://sentry@127.0.0.1:8000/1

# Laravel
SENTRY_LARAVEL_DSN=http://sentry@127.0.0.1:8000/1
```

When the app runs in Docker Compose next to Buggregator, replace `127.0.0.1` with the service name, for example `http://sentry@buggregator:8000/1`. For traces, also set the SDK's trace sample rate to `1.0`, or traces are sampled away.

### 3. Name the project, PHP SDK
With the Sentry PHP SDK, put the project key at the end instead of the number. A new key creates the project with its first error.

```dotenv
SENTRY_DSN=http://sentry@127.0.0.1:8000/shop
```

### 4. Name the project, JavaScript and Python SDKs
These SDKs refuse a name at the end of the DSN. Keep the number and put the project key before `@`. The project must exist first, so list it in `buggregator.yaml`, the config file of Buggregator itself:

```yaml
projects:
  - key: billing
    name: Billing
  - key: storefront
    name: Storefront
```

```dotenv
# PHP backend
SENTRY_DSN=http://billing@127.0.0.1:8000/1
# JavaScript frontend
SENTRY_DSN=http://storefront@127.0.0.1:8000/1
```

The JavaScript SDK takes only letters, digits and `_` before `@`. Write `store_front` and Buggregator finds the project `store-front`.

### 5. Open the Sentry page
Throw an error in your app and open http://127.0.0.1:8000, then **Sentry**. Pick the project in the sidebar to see only its errors, traces and logs.

## Why it works
Buggregator accepts the Sentry SDK protocol on port 8000. It reads the project from the DSN path first, then from the `X-Buggregator-Event: sentry` and `X-Buggregator-Project` headers sent together, then from the key before `@` if a project with that key exists. Without any of them, the event goes to the `default` project. A number at the end is the SDK's own project id, so it never picks a Buggregator project. The key `sentry` never does either.
