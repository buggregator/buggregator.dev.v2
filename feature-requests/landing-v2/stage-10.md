# Stage 10: Sponsors Section + /sponsors Page

## Overview

Two deliverables that work together:

1. **`SponsorsSection`** — compact block on the main landing page, placed between
   `CommunitySection` and `AppFooter`. Shows current sponsors with avatars/logos and
   a "Support on Patreon" CTA. Always has a "Become a sponsor +" card at the end.

2. **`/sponsors` page** — dedicated page explaining why to support, what sponsors get
   (logo on main page), Patreon link for individuals, and email contact for companies
   wanting custom placement.

**Core message:** Buggregator is free forever. Sponsoring keeps it that way and funds
new features. No guilt, no pressure — just an open invitation.

**Patreon URL:** `https://www.patreon.com/buggregator` (placeholder — replace with real)  
**Sponsor contact email:** configurable via `runtimeConfig.public.sponsorEmail`

---

## Files

CREATE:

- `buggregator.dev/spa-v2/components/sections/SponsorsSection.vue` — landing block
- `buggregator.dev/spa-v2/components/sections/SponsorsSection/SponsorCard.vue` — individual card
- `buggregator.dev/spa-v2/pages/sponsors.vue` — full sponsors page
- `buggregator.dev/spa-v2/data/sponsors.ts` — static sponsor list (source of truth)

MODIFY:

- `buggregator.dev/spa-v2/pages/index.vue` — insert `<SponsorsSection>` before `<AppFooter>`
- `buggregator.dev/spa-v2/components/layout/AppFooter.vue` — add "Sponsors" link
- `buggregator.dev/spa-v2/components/layout/AppNavbar.vue` — add "Sponsors" link (optional)
- `buggregator.dev/spa-v2/locales/en.json` — add `sponsors.*` keys
- `buggregator.dev/spa-v2/nuxt.config.ts` — add `sponsorEmail` and `patreonUrl` to runtimeConfig

---

## Code References

- `buggregator.dev/spa/components/v1/Team.vue` — team card pattern (avatar + name + role)
- `buggregator.dev/spa/components/v1/Support.vue` — existing support CTA (reference, replace)
- `buggregator.dev/app/app/src/Endpoint/Http/Controller/TeamAction.php` — team data structure to follow

---

## Data Model: `data/sponsors.ts`

Static file. No backend, no API. Sponsors are added manually by the maintainer.
When a new sponsor joins, update this file + redeploy. Simple and maintainable.

```ts
export type SponsorTier = 'gold' | 'silver' | 'community'

export type Sponsor = {
    id: string
    name: string           // Display name or company name
    url: string            // Link when clicking the card
    avatar: string         // URL to avatar/logo image
    tier: SponsorTier
    since?: string         // "2024-01" — shown as "Sponsor since Jan 2024"
    description?: string   // Optional one-liner (shown on /sponsors page only)
}

// Tier visual differences:
//   gold:      Large card (featured), full name + description, top row
//   silver:    Medium card, name + avatar
//   community: Small card, avatar only (with name on hover)

export const sponsors: Sponsor[] = [
    // Example gold sponsor:
    // {
    //   id: 'acme',
    //   name: 'Acme Corp',
    //   url: 'https://acme.example.com',
    //   avatar: 'https://acme.example.com/logo.png',
    //   tier: 'gold',
    //   since: '2024-06',
    //   description: 'Cloud infrastructure for developers',
    // },

    // Example community sponsor (individual via Patreon):
    // {
    //   id: 'john-doe',
    //   name: 'John Doe',
    //   url: 'https://github.com/johndoe',
    //   avatar: 'https://avatars.githubusercontent.com/u/12345?v=4',
    //   tier: 'community',
    //   since: '2024-03',
    // },
]
```

**When sponsors array is empty:** Both the section and the page gracefully show an
"empty state" — "Be the first sponsor" — rather than hiding entirely.

---

## Part 1: SponsorsSection (main landing)

### Visual design

**Background:** `#111318` (`--section-mid`) — sits between `CommunitySection` (`#0c0e14`)
and `AppFooter` (`#111318`). Blends naturally with both.

**Headline:** `"Backed by the community"`
**Subheadline:** `"Buggregator is free forever. Sponsors make that possible."`

### Sponsor grid

```
[Gold sponsors — full-width row if any, otherwise skip]

[Silver + Community sponsors — flex-wrap, centered]

[+ Become a sponsor] — always last, dashed border card
```

**Gold card (`tier === 'gold'`):**

```
┌─────────────────────────────────────────────┐
│  [Logo 48px]  Company Name                  │
│               Cloud infra for developers    │  ← description
│               Sponsor since June 2024       │
└─────────────────────────────────────────────┘
```

`bg rgba(255,255,255,0.04)`, `border #2a2f38`, `rounded-xl`, `p-5`
Name: `font-semibold text-sm text-primary`
Description: `text-xs text-muted`

**Silver card:**

```
┌────────────────┐
│   [Logo 40px]  │
│   Name         │
└────────────────┘
```

`bg rgba(255,255,255,0.03)`, `rounded-lg`, `p-3`

**Community card:**

```
[Avatar 32px, rounded-full]
— name appears as tooltip on hover
```

Inline, no border, tight spacing.

**"Become a sponsor" card (always last):**

```
┌ ─ ─ ─ ─ ─ ─ ─ ┐
│    +            │
│  Become a       │
│  sponsor        │
└ ─ ─ ─ ─ ─ ─ ─ ┘
```

`border-dashed border-2 border-dark-600`, `text-muted`, hover: `border-accent-blue text-accent-blue`
Links to `/sponsors`

### Patreon CTA

Below the grid:

```
[♥ Support on Patreon]   [→ See all ways to help]
```

- Patreon button: `bg #FF424D` (Patreon brand red), white text, Patreon icon
- "See all ways" ghost link → `/sponsors`

### Empty state (no sponsors yet)

```
[Empty state — sponsors grid area]
Be the first to support Buggregator.
[♥ Support on Patreon]  [→ Become a sponsor]
```

```vue

<template>
  <section class="sponsors-section">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

      <h2 class="text-2xl font-bold text-white mb-2">
        {{ t('sponsors.headline') }}
      </h2>
      <p class="text-sm text-muted mb-10">
        {{ t('sponsors.subheadline') }}
      </p>

      <!-- Gold sponsors row -->
      <div v-if="goldSponsors.length" class="sponsors-gold-row mb-6">
        <SponsorCard v-for="s in goldSponsors" :key="s.id" :sponsor="s" tier="gold"/>
      </div>

      <!-- Silver + community + "become" card -->
      <div class="sponsors-grid">
        <SponsorCard v-for="s in otherSponsors" :key="s.id" :sponsor="s" :tier="s.tier"/>
        <BecomeASponsorCard/>
      </div>

      <!-- Patreon CTA -->
      <div class="sponsors-cta mt-10">
        <a :href="patreonUrl" target="_blank" rel="noopener" class="btn-patreon">
          <PatreonIcon/>
          {{ t('sponsors.patreonBtn') }}
        </a>
        <NuxtLink to="/sponsors" class="btn-ghost">
          {{ t('sponsors.learnMore') }}
        </NuxtLink>
      </div>

    </div>
  </section>
</template>
```

---

## Part 2: /sponsors Page

### URL: `/sponsors`

Full dedicated page with its own `<head>` SEO tags. Uses the same `default.vue` layout
as the main page (Navbar + Footer).

### Page structure

```
[Sponsors page]
  bg: #0c0e14 (full dark page)

  ┌─ Hero banner ─────────────────────────────────────────────────────┐
  │  "Support Buggregator"                                            │
  │  "Free forever — thanks to people like you."                     │
  └───────────────────────────────────────────────────────────────────┘

  ┌─ Why sponsor section ─────────────────────────────────────────────┐
  │  3 reasons, card grid                                             │
  └───────────────────────────────────────────────────────────────────┘

  ┌─ Current sponsors ────────────────────────────────────────────────┐
  │  Same grid as landing section, but with descriptions + "since"   │
  └───────────────────────────────────────────────────────────────────┘

  ┌─ Sponsorship tiers ───────────────────────────────────────────────┐
  │  Individual (Patreon) | Company (email contact)                   │
  └───────────────────────────────────────────────────────────────────┘

  ┌─ Contact CTA ─────────────────────────────────────────────────────┐
  │  For companies: email + what to expect                            │
  └───────────────────────────────────────────────────────────────────┘
```

---

### Block 1: Hero Banner

**H1:** `"Support Buggregator"`
**Subheadline:**

```
"Buggregator is and will always be free. No paid tiers, no feature gates.
 Sponsors help fund server costs, development time, and new features."
```

**Two CTA buttons:**

- `[♥ Support on Patreon]` — Patreon brand red, opens Patreon in new tab
- `[✉ Contact for company sponsorship]` — ghost, `mailto:sponsor@buggregator.dev`

---

### Block 2: Why Sponsor — 3 Reasons

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  🚀              │  │  🏷️              │  │  ❤️              │
│  Keep it free    │  │  Get recognized  │  │  Support OSS     │
│                  │  │                  │  │                  │
│  Sponsorship     │  │  Your logo on    │  │  Buggregator     │
│  covers hosting, │  │  the homepage,   │  │  saves dev teams │
│  CI, and dev     │  │  README, and     │  │  hours of setup  │
│  time to ship    │  │  docs. Seen by   │  │  every week.     │
│  new features.   │  │  PHP devs daily. │  │  Give back.      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

Cards: `bg rgba(255,255,255,0.04)`, `border #1e2128`, `rounded-xl`, `p-6`
Icon: 32px, in accent or event-type color
Title: `font-semibold text-white text-base mb-2`
Body: `text-sm text-secondary`

---

### Block 3: Current Sponsors Grid

Same component as landing section, but **expanded**:

- Gold tier: show `description` + `since` date
- Silver: show name + since date
- Community: show name + avatar + since date (all visible, not tooltip-only)

**Section heading:** `"Our sponsors"` (or "Be the first" if empty)

---

### Block 4: Sponsorship Tiers

Two columns side by side:

**Left — Individual (Patreon):**

```
♥ Individual sponsor
via Patreon

Starting from $5/month

What you get:
✓ Your name in the FUNDING.yml
✓ Your avatar in the Sponsors section
✓ Our eternal gratitude

[Support on Patreon →]
```

Card: `bg rgba(255,69,77,0.08)`, `border rgba(255,69,77,0.2)`, `rounded-xl`, `p-6`

**Right — Company (email):**

```
🏢 Company sponsor
via direct contact

Custom packages

What you get:
✓ Your logo on buggregator.dev homepage
✓ Your logo in the GitHub README
✓ Your logo in the docs header
✓ A thank-you post on our socials

[Contact us →]  sponsor@buggregator.dev
```

Card: `bg rgba(59,130,246,0.08)`, `border rgba(59,130,246,0.2)`, `rounded-xl`, `p-6`

**Checkmark color:** `#22c55e`
**Tier divider line:** `border-t border-dark-600 mt-8 pt-8`

---

### Block 5: Contact CTA

```
"Want to become a company sponsor?"

"Send us an email with your company name, logo, and website.
 We'll get back to you within 48 hours."

[✉ sponsor@buggregator.dev]

— or —

"Join dozens of developers supporting Buggregator on Patreon:"

[♥ patreon.com/buggregator]
```

Simple centered text block, dark background, `max-w-lg mx-auto`.

---

## runtimeConfig additions

```ts
// nuxt.config.ts
runtimeConfig: {
public:
    {
        patreonUrl:   process.env.PATREON_URL || 'https://www.patreon.com/buggregator',
            sponsorEmail
    :
        process.env.SPONSOR_EMAIL || 'sponsor@buggregator.dev',
    }
}
```

---

## i18n Keys

```json
"sponsors": {
"headline": "Backed by the community",
"subheadline": "Buggregator is free forever. Sponsors make that possible.",
"patreonBtn":  "Support on Patreon",
"learnMore": "See all ways to help →",
"becomeCard": "Become a sponsor",
"empty": "Be the first to support Buggregator.",
"page": {
"title": "Support Buggregator",
"subheadline": "Buggregator is and will always be free. No paid tiers, no feature gates. Sponsors help fund server costs, development time, and new features.",
"ctaPatreon": "Support on Patreon",
"ctaEmail": "Contact for company sponsorship",
"why": {
"title": "Why sponsor?",
"free": {
"title": "Keep it free",
"body": "Sponsorship covers hosting, CI, and development time to ship new features."
},
"recognition": {
"title": "Get recognized",
"body": "Your logo on the homepage, README, and docs. Seen by PHP developers daily."
},
"oss": {
"title": "Support open source",
"body": "Buggregator saves dev teams hours of setup every week. Give back."
}
},
"currentSponsors": "Our sponsors",
"noSponsors": "No sponsors yet. Be the first!",
"tiers": {
"individual": {
"label": "Individual sponsor",
"via": "via Patreon",
"from":     "Starting from $5/month",
"perks": [
"Your name in the FUNDING.yml",
"Your avatar in the Sponsors section",
"Our eternal gratitude"
],
"cta": "Support on Patreon →"
},
"company": {
"label": "Company sponsor",
"via": "via direct contact",
"from":     "Custom packages",
"perks": [
"Your logo on buggregator.dev homepage",
"Your logo in the GitHub README",
"Your logo in the docs header",
"A thank-you post on our socials"
],
"cta": "Contact us →"
}
},
"contact": {
"title": "Want to become a company sponsor?",
"body": "Send us an email with your company name, logo, and website. We'll get back to you within 48 hours.",
"or":      "or join developers supporting Buggregator on Patreon:"
}
}
}
```

---

## SEO for /sponsors page

```ts
// pages/sponsors.vue — useHead / useSeoMeta
useSeoMeta({
    title: 'Sponsor Buggregator — Support Free Open Source PHP Debugging',
    description: 'Buggregator is a free, open-source debugging server for PHP developers. Support its development via Patreon or company sponsorship.',
    ogTitle: 'Sponsor Buggregator',
    ogDescription: 'Keep Buggregator free forever. Support via Patreon or become a company sponsor.',
})
```

---

## Patreon Icon Component

Simple inline SVG of the Patreon "P" logo. Use brand color `#FF424D` as fill.
Self-contained, no external library needed.

```vue
<!-- components/icons/PatreonIcon.vue -->
<template>
  <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 fill-current" aria-hidden="true">
    <path d="M14.82 2.41C11.57 2.41 8.89 5.1 8.89 8.35c0 3.24 2.68 5.91 5.93 5.91
             3.25 0 5.93-2.67 5.93-5.91 0-3.25-2.68-5.94-5.93-5.94z"/>
    <path d="M3.18 21.59h3.31V2.41H3.18z"/>
  </svg>
</template>
```

---

## Placement in page flow

```
...
[AdvancedFeaturesSection]   #f3f4f6 light
[InteractiveDemoSection]    #0c0e14 dark
[CommunitySection]          #0c0e14 dark
[SponsorsSection]           #111318 mid-dark  ← NEW (Stage 10)
[AppFooter]                 #111318 mid-dark
```

SponsorsSection and Footer share the same background — they flow together visually,
with a single `border-t border-dark-600` separating them.

---

## Definition of Done

**SponsorsSection (landing):**

- [ ] Section renders at correct position (before footer)
- [ ] Gold sponsors (if any) render in top row with logo + name + description
- [ ] Silver/community sponsors render in flex-wrap grid below
- [ ] "Become a sponsor +" card always appears last, dashed border
- [ ] Patreon button links to `runtimeConfig.public.patreonUrl`, opens new tab
- [ ] "See all ways to help →" links to `/sponsors`
- [ ] Empty state shows when `sponsors.ts` has no entries
- [ ] Section is visible and correct on 375px, 768px, 1280px

**`/sponsors` page:**

- [ ] Page loads at `/sponsors` route
- [ ] SEO `<head>` set (title, description, og tags)
- [ ] H1 "Support Buggregator" renders
- [ ] Both CTAs work: Patreon link (external) + email `mailto:` link
- [ ] 3 "Why sponsor" cards render with icons, titles, body
- [ ] Current sponsors grid renders (or empty state if none)
- [ ] Two-tier comparison cards render side by side (desktop), stacked (mobile)
- [ ] Individual tier: Patreon link works
- [ ] Company tier: email `mailto:sponsorEmail` works
- [ ] Contact block at bottom renders with email and Patreon link
- [ ] All text via `t()` — no hardcoded strings
- [ ] Mobile: two-tier cards stack vertically, readable

**Data:**

- [ ] `data/sponsors.ts` file exists with correct type definitions
- [ ] Empty `sponsors[]` array is the default (no fake data)
- [ ] `patreonUrl` and `sponsorEmail` configurable via `.env`
- [ ] `PATREON_URL` and `SPONSOR_EMAIL` documented in `.env.sample`

---

## Dependencies

**Requires:** Stage 1 (Nuxt 4), Stage 2 (i18n), Stage 6 (CommunitySection in page)  
**Enables:** Complete landing page (this is the last content stage before QA)

## Notes

- **No backend needed.** Sponsors are managed via `data/sponsors.ts` — a static TypeScript
  file committed to git. To add a new sponsor: update the file, commit, deploy.
- **Privacy consideration:** Individual Patreon sponsors should only appear if they explicitly
  opt-in (some may want to remain anonymous). The `sponsors.ts` file is curated manually,
  so this is implicitly handled.
- **Future:** If sponsors list grows significantly, consider moving to a simple JSON API
  endpoint in the existing Spiral backend (follow the pattern of `TeamAction.php`).
- **Patreon API:** Not used — Patreon's API requires authentication and is complex.
  Manual curation is simpler and more reliable for a small project.
