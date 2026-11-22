---
slug: projects-per-service
title: One Buggregator for all your apps, each in its own project
description: Give each service its own project key in the Sentry DSN path, the SMTP user name or the profiler URL. One Buggregator keeps their errors and mail apart.
query: sentry multiple projects
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/projects.html
requires: "v2.5.0"
related: [smtp-catcher-in-docker-compose, sentry-traces-as-waterfall, laravel-mail-to-local-inbox, laravel-logs-in-a-live-view]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Run one Buggregator for all your services and give each one a project key. The key goes in the Sentry DSN path (`http://sentry@127.0.0.1:8000/shop`), the SMTP user name, or the profiler URL. Each service's errors, mail and profiles then stay in their own project, and the project switcher in the sidebar shows one at a time.

## Steps

### 1. List your projects
Create `buggregator.yaml` with one entry per service. This step is optional: a new key is also added on its first event card, with the key as its name.

```yaml
projects:
  - key: shop
    name: Shop
  - key: billing
    name: Billing
```

### 2. Mount the file into the container
Buggregator reads `buggregator.yaml` from its working directory.

```yaml
services:
  buggregator:
    image: ghcr.io/buggregator/server:latest
    ports:
      - 127.0.0.1:8000:8000
      - 127.0.0.1:1025:1025
    volumes:
      - ./buggregator.yaml:/buggregator.yaml
```

### 3. Put the key in each service's Sentry DSN
Use the project key as the last part of the DSN path. Inside Compose, use the service name as the host.

```dotenv
# shop service
SENTRY_DSN=http://sentry@buggregator:8000/shop

# billing service
SENTRY_DSN=http://sentry@buggregator:8000/billing
```

A numeric path like `/1` sends events to `default`. If your SDK accepts only a number there, put the key before `@` instead, for example `http://billing@buggregator:8000/1`. That works since server v2.10.0, and only for a project that already exists.

### 4. Put the key in the SMTP user name
The SMTP user name picks the project; the password can be anything.

```dotenv
MAILER_DSN=smtp://shop:any@buggregator:1025
```

In Laravel, set `MAIL_USERNAME=shop` and any `MAIL_PASSWORD`.

### 5. Other event types
Each module takes the key in its own place:

```dotenv
# XHProf profiler
PROFILER_ENDPOINT=http://profiler:shop@buggregator:8000

# Ray
RAY_HOST=ray:shop@buggregator
RAY_PORT=8000
```

For Monolog, add `project` to the record's context: `$logger->error('Payment failed', ['project' => 'shop'])`. Records and dumps without it land in `default`.

### 6. Switch between projects
Open `http://127.0.0.1:8000` and pick a project in the sidebar. You see only that service's events.

## Why it works
Every event carries a project key, read from the DSN path, the user name or the context. Without one, it goes to the `default` project. For Sentry the order is: DSN path, then the `X-Buggregator-Project` header or Basic Auth, then the DSN public key, then `default`.
