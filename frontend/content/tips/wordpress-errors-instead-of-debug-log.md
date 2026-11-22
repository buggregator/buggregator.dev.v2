---
slug: wordpress-errors-instead-of-debug-log
title: WordPress PHP errors live, instead of reading debug.log
description: Add the WP Sentry plugin and a few lines in wp-config.php. WordPress warnings and fatal errors show up live in Buggregator with their stack trace.
query: wordpress debug log
feature: Sentry
feature_page: /features/sentry
docs: https://docs.buggregator.dev/config/sentry.html#wordpress
requires: null
related: [wordpress-mail-to-local-inbox, sentry-breadcrumbs-before-the-error, dump-without-breaking-the-page]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install the WP Sentry plugin and add a few lines to `wp-config.php` that point it at `http://sentry@127.0.0.1:8000/1`. PHP warnings and fatal errors from your local WordPress site then show up live in Buggregator, each with its stack trace and request. You see them as they happen, without opening `wp-content/debug.log`.

## Steps

### 1. Start Buggregator
```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  ghcr.io/buggregator/server:latest
```

### 2. Install WP Sentry
Install the [WP Sentry](https://wordpress.org/plugins/wp-sentry-integration/) plugin. You do not need to activate it: `wp-config.php` loads it directly.

### 3. Add the lines to wp-config.php
`WP_ENVIRONMENT_TYPE` must be `local`, so the lines never run on production. [Local](https://localwp.com/) sets it by default.

```php
if (defined('WP_ENVIRONMENT_TYPE') && 'local' === WP_ENVIRONMENT_TYPE) {
	define( 'WP_SENTRY_PHP_DSN', 'http://sentry@127.0.0.1:8000/1' );
	define( 'WP_SENTRY_ERROR_TYPES', E_ALL & ~E_NOTICE & ~E_USER_NOTICE );
	require_once __DIR__ . '/wp-content/plugins/wp-sentry-integration/wp-sentry.php';
}
```

`WP_SENTRY_ERROR_TYPES` picks which PHP errors are sent: here everything except notices.

### 4. Load a page and look
Open your site, then http://127.0.0.1:8000. Each error shows the stack trace frame by frame with the code around each line, the request, the breadcrumbs before it, tags and loaded packages. New errors appear as they happen.

## Why it works
WP Sentry wraps the Sentry PHP SDK. The SDK catches PHP errors and exceptions and sends them over HTTP to the address in the DSN. Buggregator speaks the same protocol on port 8000, so it stores each error and shows it in the UI right away.
