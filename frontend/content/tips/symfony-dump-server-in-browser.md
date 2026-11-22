---
slug: symfony-dump-server-in-browser
title: Symfony dump server output in a browser tab
description: Set VAR_DUMPER_FORMAT=server and VAR_DUMPER_SERVER in .env.local. Buggregator is your dump server, dump() shows as a tree, and the page stays clean.
query: symfony var dumper
feature: Dumps
feature_page: null
docs: https://docs.buggregator.dev/config/var-dumper.html#setup
requires: null
related: [dump-without-breaking-the-page, php-trap-dump-anywhere, symfony-logs-in-a-live-view, symfony-errors-locally]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Instead of running `bin/console server:dump` in a terminal, use Buggregator as the dump server. Set `VAR_DUMPER_FORMAT=server` and `VAR_DUMPER_SERVER=127.0.0.1:9912` in `.env.local`. Every `dump()` then shows up in a browser tab as a tree you can fold, with the file and line it came from. Your page and your JSON responses stay clean.

## Steps

### 1. Start Buggregator
Port 8000 is the UI, port 9912 takes the dumps.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:9912:9912 \
  ghcr.io/buggregator/server:latest
```

### 2. Set two lines in .env.local
In Docker Compose, use the service name: `VAR_DUMPER_SERVER=buggregator:9912`.

```dotenv
VAR_DUMPER_FORMAT=server
VAR_DUMPER_SERVER=127.0.0.1:9912
```

You do not run `server:dump`. Buggregator listens on port 9912 in its place.

### 3. Or use the debug bundle's setting
If you use `symfony/debug-bundle`, its recipe adds `config/packages/debug.yaml` with a dump destination that reads `VAR_DUMPER_SERVER`. Then set only `VAR_DUMPER_SERVER`.

```yaml
when@dev:
    debug:
        dump_destination: "tcp://%env(VAR_DUMPER_SERVER)%"
```

### 4. Call dump() as usual
Open `http://127.0.0.1:8000`. Each dump shows the value as an expandable tree, its label if you gave one, and the source location. Click the location to open the file in your editor. This also works in commands, Messenger workers and other long-running processes.

## Why it works
With `VAR_DUMPER_FORMAT=server`, VarDumper sends each dump over TCP to `VAR_DUMPER_SERVER` instead of printing it. The variable also keeps the debug bundle from replacing that handler, so dumps go to Buggregator and not into the page. Buggregator renders what arrives on port 9912. On the Windows binary, the VarDumper module is not available.
