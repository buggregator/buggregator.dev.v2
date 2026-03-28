# Hero Copy — Final Decisions

> Date: 2026-03-28
> Status: APPROVED

---

## ✅ Headline (final)

```
"Debug everything. Install nothing."
```

## ✅ Subheadline (final — Option B)

```
"One docker run. Exceptions, logs, emails and profiling —
all in one real-time UI. No cloud account. No code changes."
```

## ✅ Tool set (NO Ray — focus on 4 universal tools)

| Tool                | Protocol        | Why included                                                       |
|---------------------|-----------------|--------------------------------------------------------------------|
| **Sentry SDK**      | Sentry protocol | Universal — most PHP projects already have it                      |
| **Monolog**         | TCP socket      | ~90% Laravel/Symfony apps use it                                   |
| **SMTP / email**    | SMTP port 1025  | Every web app sends email                                          |
| **XHProf Profiler** | HTTP            | Unique differentiator — no competitor offers this locally for free |

**Ray excluded because:**

- Paid app (Spatie) — not universal
- Creates impression Buggregator needs Ray installed
- Less widely adopted than the four above

## Full Hero Block

```
[HEADLINE]
"Debug everything. Install nothing."

[SUBHEADLINE]
"One docker run. Exceptions, logs, emails and profiling —
all in one real-time UI. No cloud account. No code changes."

[COMMAND BLOCK]
docker run --pull always \
  -p 127.0.0.1:8000:8000 \
  -p 127.0.0.1:1025:1025 \
  -p 127.0.0.1:9912:9912 \
  ghcr.io/buggregator/server:latest
[Copy ⎘]

[GHOST LINK]
Or use Trap — no Docker required →

[TRUST ROW]
⭐ {N} GitHub Stars  ·  v{version} just released  ·  Free & Open Source  ·  MIT

[FRAMEWORK LOGOS]
Works with: [Laravel] [Symfony] [Spiral] [WordPress] [Yii3] [Drupal]
```

## Where "Install nothing" might need clarification

"Install nothing" technically requires Docker. Three ways to handle:

1. **Leave as is** — subheadline "No code changes" provides context ✅ (recommended)
2. Variant: `"Install nothing in your app."` — precise but longer
3. Variant: `"Debug everything. Change nothing."` — "change nothing in your app"

Decision: keep original, subheadline handles the clarification.

## Subheadline alternatives (kept for A/B)

**Option A — tool names explicit:**

```
"One docker run. Your Sentry SDK, Monolog, VarDumper and SMTP
start sending here instead — with XHProf profiling on top.
No cloud account. No new code in your app. Free forever."
```

**Option C — structured list:**

```
"Exceptions from Sentry. Logs from Monolog.
Emails from your SMTP. Performance from XHProf.
One docker run. Zero cloud accounts."
```

Option C is strongest for users who know the tools. Test A vs B vs C post-launch.
