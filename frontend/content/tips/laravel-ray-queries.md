---
slug: laravel-ray-queries
title: Every SQL query of a Laravel request with ray()
description: Call ray()->showQueries() and each SQL query lands in Buggregator with its bindings filled in, the connection and the time in milliseconds.
query: laravel ray
feature: Dumps
feature_page: null
docs: https://docs.buggregator.dev/config/ray.html#supported-payload-types
requires: null
related: [ray-calls-to-free-viewer, laravel-profiler-in-two-commands, dump-without-breaking-the-page, laravel-logs-in-a-live-view]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Point `spatie/laravel-ray` at Buggregator and call `ray()->showQueries()` before the code you want to watch. Each SQL query then shows up in Buggregator with its bindings filled in, the connection name and how long it took in milliseconds. It is a query log you read in the browser, not in a file.

## Steps

### 1. Point Ray at Buggregator
Publish the Ray config, then set two lines in `.env`. In Docker Compose, use `RAY_HOST=ray@buggregator`.

```bash
php artisan ray:publish-config
```

```dotenv
RAY_HOST=ray@127.0.0.1
RAY_PORT=8000
```

### 2. Show the queries of one piece of code
Pass a closure: Ray shows only the queries run inside it.

```php
ray()->showQueries(function () {
    User::with('orders')->where('active', true)->get();
});
```

### 3. Or switch it on and off
Everything between the two calls is sent.

```php
ray()->showQueries();

$users = User::where('active', true)->get();

ray()->stopShowingQueries();
```

### 4. Or send every query
To see all queries of every request, set this in `.env`. It reads the published `config/ray.php`.

```dotenv
SEND_QUERIES_TO_RAY=true
```

### 5. Count them or catch the slow ones
`countQueries` sends a small table with the number of queries and their total time. `showSlowQueries` sends only queries slower than the given milliseconds.

```php
ray()->countQueries(function () {
    User::all()->each(fn ($user) => $user->orders->count());
});

ray()->showSlowQueries(100);
```

Open `http://127.0.0.1:8000` to read them. Each query shows the file and line it came from.

## Why it works
Laravel fires an event for every executed query. Laravel Ray listens to it while query watching is on and sends each query to the host and port you set. Buggregator takes Ray payloads on port 8000 and renders a query as SQL with highlighting, plus the connection and the time.
