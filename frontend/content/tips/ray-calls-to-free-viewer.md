---
slug: ray-calls-to-free-viewer
title: Send ray() calls to a free local viewer
description: Set RAY_HOST and RAY_PORT in your Laravel .env. Your ray() calls, queries, jobs and mails show up in Buggregator, free and MIT licensed.
query: ray laravel
feature: Dumps
feature_page: null
docs: https://docs.buggregator.dev/config/ray.html#laravel
requires: null
related: [dump-without-breaking-the-page, laravel-logs-in-a-live-view, laravel-see-outgoing-api-calls]
checked: { date: 2026-11-10, version: v2.8.0 }
---
If you use Ray in Laravel, publish the Ray config and set `RAY_HOST=ray@127.0.0.1` and `RAY_PORT=8000`. Your `ray()` calls then land in Buggregator, a free viewer under the [MIT license](https://github.com/buggregator/server/blob/master/LICENSE), next to your exceptions, logs and emails. You keep the same `ray()` function and the same workflow; no license is needed.

## Steps

### 1. Publish the Ray config
Run this in your Laravel app, which already uses `ray()`.
```bash
php artisan ray:publish-config
```

### 2. Point Ray at Buggregator
Set two lines in `.env`. In Docker Compose, use `RAY_HOST=ray@buggregator` and `RAY_PORT=8000`.
```dotenv
RAY_HOST=ray@127.0.0.1
RAY_PORT=8000
```

### 3. Call ray() as usual
Open `http://127.0.0.1:8000`. Buggregator renders 18 Ray payload types, among them SQL queries with bindings, Eloquent models, jobs, events, mailables, tables, measures and exceptions with stack traces. Each payload shows its origin: file, line and function. Click the file path to open it in your IDE.

### 4. Outside Laravel, use a ray.php file
In any other PHP project, create `ray.php` in the project root.
```php
<?php

return [
    'enable' => true,
    'host' => 'ray@127.0.0.1',
    'port' => 8000,
    'remote_path' => null,
    'local_path' => null,
    'always_send_raw_values' => false,
];
```

## Why it works
Ray sends each call to the host and port you set. Buggregator takes Ray payloads on port 8000, the same port as its UI and its other HTTP events, and shows them with the rest of your debug data. Ray by Spatie also has SDKs for JavaScript, Ruby, Go and Bash, and their output goes to Buggregator too.
