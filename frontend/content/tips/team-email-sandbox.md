---
slug: team-email-sandbox
title: One email sandbox for the whole team
description: Run one Buggregator in Kubernetes with the Helm chart. Each app sends mail to its own project, and the team signs in to the inbox with SSO.
query: email sandbox
feature: Mail
feature_page: /features/email-testing
docs: https://docs.buggregator.dev/config/helm-chart.html
requires: null
related: [projects-per-service, smtp-catcher-in-docker-compose, wait-for-email-in-e2e-tests, fake-smtp-single-binary]
checked: { date: 2026-11-22, version: v2.13.0 }
---
Install Buggregator once in your cluster with the Helm chart, list your apps as projects, and turn on SSO. Each app sends its mail to port 1025 with its project key as the SMTP user name. Your team signs in to one inbox and picks a project to see only that app's emails. No email reaches a real mailbox.

## Steps

### 1. Write the values file
`config` becomes Buggregator's own `buggregator.yaml`, so the projects go there. `auth` turns on sign-in for the web UI. The Ingress carries the UI over HTTPS.

```yaml
config:
  projects:
    - key: shop
      name: Shop
    - key: billing
      name: Billing

auth:
  enabled: true
  provider: google
  providerUrl: https://accounts.google.com
  clientId: YOUR_CLIENT_ID
  clientSecret: YOUR_CLIENT_SECRET
  callbackUrl: https://mail-sandbox.example.com/auth/sso/callback

ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
  hosts:
    - host: mail-sandbox.example.com
      paths:
        - path: /
          pathType: Prefix
```

The timeouts keep the UI's live WebSocket connection open. Other providers: `auth0`, `github`, `keycloak`, `gitlab` and any OIDC provider.

### 2. Install the chart
The chart keeps the database on a 5 GiB volume, so emails survive a pod restart.

```bash
helm install buggregator oci://ghcr.io/buggregator/helm-chart/buggregator -f values.yaml
```

### 3. Send each app's mail to its project
Inside the cluster, the SMTP address is the Service name. The SMTP user name picks the project; the password can be anything. For a Laravel app in the `default` namespace:

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=buggregator.default.svc
MAIL_PORT=1025
MAIL_USERNAME=shop
MAIL_PASSWORD=any
```

For Symfony: `MAILER_DSN=smtp://billing:any@buggregator.default.svc:1025`. Mail without a user name lands in the `default` project.

### 4. Reach SMTP from outside the cluster
An Ingress carries only HTTP. For apps outside the cluster, add a TCP Service and limit who can connect, because the SMTP port has no sign-in. It exposes SMTP on 1025 together with the VarDumper and Monolog ports 9912 and 9913:

```yaml
tcpService:
  enabled: true
  extraSpec:
    loadBalancerSourceRanges: ["203.0.113.0/24"]
```

### 5. Sign in and pick a project
Buggregator lets in anyone who finishes the provider's sign-in. Keep it to your team at the provider: in Google Cloud, set the OAuth app's user type to **Internal**, so only accounts of your Google Workspace can sign in. With Keycloak, use a realm that holds only your team, with user registration off. With GitLab, only a self-hosted instance limits it to its own users; on gitlab.com any account can sign in.

Open https://mail-sandbox.example.com and sign in with your provider. The project selector in the sidebar switches between apps.

## Why it works
SSO puts the web UI and its API behind your provider's sign-in, and the provider decides who gets in. Ingestion stays open: apps send mail over SMTP with no sign-in, and the SMTP user name only chooses the project. Test scripts that read mail through `/api/smtp/*` need the `X-Auth-Token` header while SSO is on. The chart runs one replica with SQLite on its own volume, so nothing else needs to be set up.
