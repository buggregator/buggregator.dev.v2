---
slug: php-trap-dump-anywhere
title: Dump from any PHP script with Trap, no Docker
description: Add buggregator/trap with Composer, run vendor/bin/trap --ui and call trap() in a plain PHP script. Dumps show in a local web UI, not in your output.
query: php dump
feature: Dumps
feature_page: null
docs: https://docs.buggregator.dev/trap/getting-started.html
requires: null
related: [dump-without-breaking-the-page, ray-calls-to-free-viewer, symfony-dump-server-in-browser, yii-dumps-without-breaking-output]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To dump a variable from a plain PHP script without printing it into your output, use Trap. Add `buggregator/trap` with Composer, start `vendor/bin/trap --ui`, and call `trap($value)` in your code. The dump shows in a web UI at `http://127.0.0.1:8000` and in the terminal. Trap is written in PHP, so you need no Docker.

## Steps

### 1. Add Trap to the project
Add it as a dev dependency.

```bash
composer require --dev buggregator/trap -W
```

You can also download a standalone binary for Linux, macOS or Windows from https://github.com/buggregator/trap/releases and run `./trap --ui` instead.

### 2. Start Trap with the web UI
Keep it running in its own terminal. Without `--ui`, dumps show only in the terminal.

```bash
vendor/bin/trap --ui
```

### 3. Call trap() in your script
Any PHP script that loads Composer's autoloader can call it.

```php
<?php
require __DIR__ . '/vendor/autoload.php';

$order = ['id' => 42, 'items' => 3, 'total' => 99.5];

// Dump one value
trap($order);

// Name the values
trap(id: $order['id'], total: $order['total']);

// Dump and keep using the value
$total = trap($order['total'])->return();
```

### 4. Open the UI
Run the script, then open `http://127.0.0.1:8000`. Each dump shows as an expandable tree. Your script's own output stays clean.

### 5. Use the helpers when you need them
`->depth()` limits nested objects, `->if()` dumps only when a condition holds, `->once()` dumps a line in a loop only once, and `td()` dumps and stops the script.

```php
trap($complexObject)->depth(3);
trap($response)->if($statusCode >= 400);
trap($i)->once();
td($user);
```

## Why it works
Trap is a small debug server written in PHP. `trap()` sends each value to it instead of printing it, and Trap shows it in the terminal and, with `--ui`, in the same dashboard as Buggregator. By default it listens on ports 1025, 8000, 9912 and 9913, so it also takes mail, VarDumper dumps and Monolog logs sent to those ports.
