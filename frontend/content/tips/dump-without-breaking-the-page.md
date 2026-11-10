---
slug: dump-without-breaking-the-page
title: dump() without breaking your page or JSON response
description: Send Symfony VarDumper output to Buggregator with two env vars. dump() stops landing in your HTML or JSON and shows the file and line it came from.
query: laravel dump server
feature: Dumps
feature_page: null
docs: https://docs.buggregator.dev/config/var-dumper.html#setup
requires: null
related: [ray-calls-to-free-viewer, laravel-logs-in-a-live-view, symfony-logs-in-a-live-view]
checked: { date: 2026-11-10, version: v2.8.0 }
---
Use Buggregator as your Laravel dump server: set `VAR_DUMPER_FORMAT=server` and `VAR_DUMPER_SERVER=127.0.0.1:9912`, and `dump()` output goes to the Buggregator UI instead of your HTML page or JSON response. Each dump shows the value as an expandable tree and the file and line where you called it.

## Steps

### 1. Install Symfony VarDumper
Laravel already includes it. In other PHP projects, add it as a dev dependency.
```bash
composer require --dev symfony/var-dumper
```

### 2. Point VarDumper at Buggregator
Add two lines to your `.env`. In Docker Compose, replace 127.0.0.1 with the Buggregator service name, for example `buggregator:9912`.
```dotenv
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912
```

### 3. Or set them in PHP
If your project does not use `.env` files, set the same values in code.
```php
$_SERVER['VAR_DUMPER_FORMAT'] = 'server';
$_SERVER['VAR_DUMPER_SERVER'] = '127.0.0.1:9912';
```

### 4. Call dump() as usual
Open `http://127.0.0.1:8000`. Your response stays clean: no dump HTML mixed into the page or the JSON. Click the source location to open the file in your editor. This also works in queue workers, RoadRunner and Swoole, where a dump never reaches a browser.

`dd()` is sent to Buggregator too, but it still stops the script, as it always does.

## Why it works
VarDumper has a server mode. With `VAR_DUMPER_FORMAT=server`, it sends each dump over TCP to the address in `VAR_DUMPER_SERVER` instead of printing it. Buggregator listens on port 9912 and renders what arrives. One limit: on the Windows binary, the VarDumper module (port 9912) does not work.
