---
slug: yii-dumps-without-breaking-output
title: dump() in Yii without breaking the page
description: Install Symfony VarDumper in your Yii app and set two values in the entry script. dump() output goes to Buggregator; your page and JSON stay clean.
query: yii2 debug
feature: Dumps
feature_page: null
docs: https://docs.buggregator.dev/config/var-dumper.html#setup
requires: null
related: [dump-without-breaking-the-page, php-trap-dump-anywhere, yii2-mail-local-inbox]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To dump a variable in a Yii app without breaking the page or a JSON response, install Symfony VarDumper and set `VAR_DUMPER_FORMAT=server` and `VAR_DUMPER_SERVER=127.0.0.1:9912` in your entry script. Every `dump()` call then goes to the Buggregator UI as an expandable tree, with the file and line it came from, and nothing is printed into your output.

## Steps

### 1. Start Buggregator
Port 8000 is the web UI, port 9912 receives the dumps.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:9912:9912 \
  ghcr.io/buggregator/server:latest
```

### 2. Install Symfony VarDumper
Add it as a dev dependency. It gives you the global `dump()` and `dd()` functions.

```bash
composer require --dev symfony/var-dumper
```

### 3. Point VarDumper at Buggregator
Set two values at the top of your entry script, for example `web/index.php` in the Yii2 basic template. Add the same lines to the `yii` console script if you want dumps from commands too.

```php
$_SERVER['VAR_DUMPER_FORMAT'] = 'server';
$_SERVER['VAR_DUMPER_SERVER'] = '127.0.0.1:9912';
```

In Docker Compose, replace `127.0.0.1` with the Buggregator service name, for example `buggregator:9912`.

### 4. Call dump()
Use Symfony's `dump()` function in a controller, a model or a view. This is not `yii\helpers\VarDumper::dump()`, which is Yii's own helper.

```php
public function actionView(int $id): Response
{
    $order = Order::findOne($id);
    dump($order->attributes);

    return $this->asJson($order);
}
```

Open `http://127.0.0.1:8000`. The dump shows there with the file and line. The JSON response stays valid.

### 5. Stop the script when you need to
`dd()` is sent to Buggregator too, but it still stops the script, as it always does.

## Why it works
VarDumper reads `VAR_DUMPER_FORMAT` from `$_SERVER` the first time you call `dump()`. With `server`, it sends each dump over TCP to the address in `VAR_DUMPER_SERVER` instead of printing it. Buggregator listens on port 9912 and renders what arrives. One limit: on the Windows binary, the VarDumper module (port 9912) does not work.
