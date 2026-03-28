# ── Stage 1: Build Nuxt SSR application ─────────────────────
FROM node:22-slim AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npx nuxt build

# ── Stage 2: Runtime ────────────────────────────────────────
FROM node:22-slim

WORKDIR /app
COPY --from=builder /app/.output .output/

ENV NODE_ENV=production
ENV NITRO_PORT=3000

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
