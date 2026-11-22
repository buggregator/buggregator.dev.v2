---
slug: spring-boot-mail-local
title: Spring Boot mail to a local inbox, two properties
description: Set spring.mail.host and spring.mail.port to Buggregator. Mail sent with JavaMailSender lands in a local inbox with HTML preview. Nothing is delivered.
query: spring boot mail
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/guides/spring-boot.html#mail
requires: null
related: [spring-boot-errors-sentry, smtp-catcher-in-docker-compose, django-mail-to-local-inbox, wait-for-email-in-e2e-tests]
checked: { date: 2026-11-22, version: v2.13.0 }
---
To test Spring Boot mail without sending it, set two properties: `spring.mail.host` and `spring.mail.port=1025`, pointed at Buggregator. Every email your app sends with `JavaMailSender` then lands in a local inbox, with the HTML preview, the attachments and the raw source. Nothing reaches a real address.

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

### 2. Set the mail properties in a local profile
Put them in a profile file such as `application-local.properties`, so they never reach production. No user, password or TLS is needed.

```properties
spring.mail.host=127.0.0.1
spring.mail.port=1025
```

Your app needs `spring-boot-starter-mail` on the classpath. Spring Boot creates the `JavaMailSender` bean once `spring.mail.host` is set.

### 3. Use the service name in Docker Compose
If your app runs in the same Compose stack as Buggregator, use the service name as the host.

```properties
spring.mail.host=buggregator
spring.mail.port=1025
```

### 4. Send an email and open it
Run the app with the `local` profile and trigger any email. Open http://127.0.0.1:8000. You see the rendered HTML, the plain text version, the addresses, the attachments and the raw MIME source.

## Why it works
Buggregator includes a fake SMTP server on port 1025. `JavaMailSender` delivers to it like to any mail server, and Buggregator stores the email and shows it in the UI instead of sending it on. Your mail code does not change, only two properties in a local profile.
