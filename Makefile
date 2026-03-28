DC     = docker compose
DC_DEV = docker compose -f docker-compose.dev.yml

# ── Stack (dev) ───────────────────────────────────────────────

up:
	$(DC_DEV) up -d

down:
	$(DC_DEV) down

ps:
	$(DC_DEV) ps

build:
	$(DC_DEV) up -d --build

logs:
	$(DC_DEV) logs -f

# ── Stack (prod) ──────────────────────────────────────────────

prod-up:
	$(DC) up -d

prod-down:
	$(DC) down

prod-build:
	$(DC) build app frontend && $(DC) up -d app frontend

prod-build-fe:
	$(DC) build frontend && $(DC) up -d frontend

prod-build-app:
	$(DC) build app && $(DC) up -d app

# ── App ───────────────────────────────────────────────────────

app-build:
	$(DC) build app --no-cache && $(DC_DEV) up -d app

app-restart:
	$(DC_DEV) restart app

app-logs:
	$(DC_DEV) logs app -f

app-bash:
	$(DC_DEV) exec app bash

run:
	wippy run -c

# ── Frontend ──────────────────────────────────────────────────

fe-build:
	cd frontend && rm -rf .nuxt .output && npm run build

fe-run:
	cd frontend && npm run dev

fe-logs:
	$(DC_DEV) logs frontend -f

# ── Telegram ─────────────────────────────────────────────────

tg-webhook:
	$(DC_DEV) exec app wippy run register-webhook --host mcp:terminal

# ── Temporal ──────────────────────────────────────────────────

temporal-run:
	temporal server start-dev

temporal-logs:
	$(DC_DEV) logs temporal -f

temporal:
	$(DC_DEV) exec temporal temporal $(filter-out $@,$(MAKECMDGOALS)) --address temporal:7233

# ── Billing ──────────────────────────────────────────────────

sync-plans:
	$(DC_DEV) exec app wippy run sync-plans --host app:terminal

sync-subscriptions:
	$(DC_DEV) exec app wippy run sync-subscriptions --host app:terminal

# ── Database ──────────────────────────────────────────────────

db-logs:
	$(DC_DEV) logs postgres -f

db-shell:
	$(DC_DEV) exec postgres psql -U homestead -d app

sql:
	$(DC_DEV) exec -T postgres psql -U homestead -d app -c "$(filter-out $@,$(MAKECMDGOALS))"
