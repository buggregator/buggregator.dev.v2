---
slug: plain-php-dump-to-window
title: "Plain PHP: dump() to a browser tab instead of var_dump()"
description: Install symfony/var-dumper, set VAR_DUMPER_FORMAT=server and call dump(). Values show as a foldable tree in Buggregator, and your page stays clean.
query: php var dump
feature: Dumps
feature_page: /features/dumps
docs: https://docs.buggregator.dev/config/var-dumper.html#setup
requires: null
related: [dump-without-breaking-the-page, php-trap-dump-anywhere, symfony-dump-server-in-browser, yii-dumps-without-breaking-output]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Replace `var_dump()` with `dump()` from Symfony VarDumper and set `$_SERVER['VAR_DUMPER_FORMAT'] = 'server'`. Each dump then goes to Buggregator on port 9912 instead of your output. You read it in a browser tab as a tree you can fold, with the file and line it came from. Your HTML page and your JSON responses stay clean. No framework needed.

## Steps

### 1. Start Buggregator
Port 8000 is the UI, port 9912 takes the dumps.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:9912:9912 \
  ghcr.io/buggregator/server:latest
```

### 2. Install VarDumper
Add it as a dev dependency with Composer.

```bash
composer require --dev symfony/var-dumper
```

### 3. Send dumps to Buggregator
Set the format at the top of your entry script, after the autoloader and before the first `dump()`:

```php
<?php

require __DIR__ . '/vendor/autoload.php';

$_SERVER['VAR_DUMPER_FORMAT'] = 'server';
$_SERVER['VAR_DUMPER_SERVER'] = '127.0.0.1:9912';
```

When PHP runs in Docker Compose, use the Buggregator service name, for example `buggregator:9912`.

For a command-line script you can pass the same values as environment variables instead:

```bash
VAR_DUMPER_FORMAT=server VAR_DUMPER_SERVER=127.0.0.1:9912 php import.php
```

### 4. Call dump() where you used var_dump()
`dump()` takes any number of values.

```php
$order = ['id' => 42, 'items' => [['sku' => 'A-1', 'qty' => 2]], 'paid' => false];

dump($order, $_GET);
```

Open http://127.0.0.1:8000. Each value shows with its type as an expandable tree, next to the file and line of the call. Click the location to open the file in your editor. `dd()` sends the value too and then stops the script.

## Why it works
VarDumper reads `VAR_DUMPER_FORMAT` the first time you call `dump()`. With `server`, it sends each dump over TCP to `VAR_DUMPER_SERVER` instead of printing it. Without `VAR_DUMPER_SERVER` it uses `127.0.0.1:9912`. Buggregator listens on that port and renders what arrives. On the Windows binary the VarDumper module is not available: run Buggregator in Docker or WSL there.
