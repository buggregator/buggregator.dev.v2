---
slug: wordpress-mail-to-local-inbox
title: WordPress mail from a local site, caught
description: A small mu-plugin sends WordPress mail to Buggregator on 127.0.0.1:1025, only when WP_ENVIRONMENT_TYPE is local. Nothing reaches real users.
query: wordpress test email
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/smtp.html#wordpress
requires: null
related: [symfony-mailer-to-local-inbox, laravel-mail-to-local-inbox, smtp-catcher-in-docker-compose, test-html-email-on-mobile-width]
checked: { date: 2026-11-10, version: v2.8.0 }
---
To send a WordPress test email from a local site without reaching real users, save a small mu-plugin that switches PHPMailer to SMTP on `127.0.0.1:1025`. Every email then lands in Buggregator, and the plugin does nothing unless `WP_ENVIRONMENT_TYPE` is `local`.

## Steps

### 1. Start Buggregator
Run the container. Port 8000 is the web UI, port 1025 is the SMTP server.

```bash
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  -p 127.0.0.1:9913:9913 \
  ghcr.io/buggregator/server:latest
```

### 2. Save the mu-plugin
Save this file in the `mu-plugins` directory, for example as `smtp.php`.

```php
<?php
/**
 * Plugin Name: MU Buggregator SMTP
 */
if (! defined('WP_ENVIRONMENT_TYPE') || 'local' !== WP_ENVIRONMENT_TYPE) {
	return;
}
add_action( 'phpmailer_init', function( $phpmailer ) : void {
	$phpmailer->isSMTP();
    $phpmailer->Host = '127.0.0.1';
    $phpmailer->Port = 1025;
}  );
```

### 3. Check the environment type
The plugin returns early unless the `WP_ENVIRONMENT_TYPE` constant is defined and equals `local`. On staging and production it does nothing, so mail there is sent as before. If you set the type as an environment variable instead of a constant, check `wp_get_environment_type() === 'local'`: WordPress reads both forms there (https://developer.wordpress.org/reference/functions/wp_get_environment_type/).

### 4. Use the service name in Docker
If WordPress runs in Docker Compose next to Buggregator, set `$phpmailer->Host` to the Buggregator service name, for example `'buggregator'`.

### 5. Send an email and open it
Trigger an email from your local site, then open http://127.0.0.1:8000. You see the rendered HTML with a Desktop / Tablet / Mobile width switcher, the plain text version, the addresses, the attachments and the raw MIME source.

![A WordPress password-reset email caught by Buggregator, in plain text.](/img/tips/wordpress-mail-to-local-inbox.webp)

## Why it works
On `phpmailer_init`, the plugin tells PHPMailer to send over SMTP to Buggregator. Buggregator includes a fake SMTP server on port 1025 that stores each email and shows it in the UI instead of delivering it.
