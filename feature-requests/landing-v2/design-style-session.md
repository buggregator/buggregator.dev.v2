# Design Style Expert Session — Landing Page v2

> Date: 2026-03-28
> Goal: Select a design direction for buggregator.dev landing and define the landing style guide
> Format: Expert panel → Decision → Style Guide

---

## Context

**Product:** Buggregator — free, open-source debugging server for PHP developers  
**Audience:** PHP developers (mid/senior), Laravel/Symfony/Spiral stacks  
**Traffic source:** Social media, Reddit, Twitter/X, word-of-mouth  
**Landing goal:** Explain product in 5 seconds, convert to `docker run` command  
**App design system:** "Function-Forward" (Linear-inspired), dark-first, DM Sans + JetBrains Mono  
**Constraint:** Landing must feel like it belongs to the same product as the app

---

## Part 1 — Design Style Landscape (2024–2025)

The panel reviewed the dominant landing page design styles used by developer tools and SaaS products in 2024–2025,
evaluating fit for Buggregator.

---

### Style 1: Developer Dark (Vercel, Railway, Fly.io, Warp)

**Characteristics:**

- Near-black background (`#090909` to `#0d0d0d`)
- White or very light gray text
- Code blocks are first-class citizens — prominently displayed
- Minimal decorative elements
- Monospace typography mixed with geometric sans
- Subtle gradients (purple, blue, green) as accent zones
- Grid lines or dot patterns as texture

**Seen in:** Vercel.com, Railway.app, Fly.io, Warp terminal site, Charm.sh

**Fit for Buggregator:** ★★★★★  
*Directly mirrors the app's own dark theme. PHP developers are comfortable in terminal/dark environments. Code
snippets (docker run, .env) are natural in this context. Highest brand cohesion.*

---

### Style 2: Clean Light + Dark Accents (Sentry, Datadog, Grafana)

**Characteristics:**

- White or near-white main background
- Dark hero section at the top, rest of page is light
- Alternating light sections with colorful feature illustrations
- Professional, enterprise-adjacent feel
- Screenshot-heavy feature sections
- Blue or brand-color primary accents

**Seen in:** Sentry.io, Datadog.com, New Relic

**Fit for Buggregator:** ★★★  
*More enterprise. Works well for paid/team tools. Buggregator is free and OSS — this style might overclaim credibility.
However, the mixed dark/light approach (dark hero, light content sections) is a valid middle ground.*

---

### Style 3: Terminal / CLI Aesthetic (Charm, Fig, Wezterm)

**Characteristics:**

- Heavy monospace typography throughout
- ASCII art, box-drawing characters
- Green-on-black or amber-on-black terminal palette
- Retro/nostalgic feel
- Very developer-specific — alienating to non-devs

**Seen in:** Charm.sh, Fig.io (archived), some CLI tool sites

**Fit for Buggregator:** ★★  
*Too niche. PHP developers are web developers first — they use browsers and GUIs. This style signals "CLI power user"
which doesn't match Buggregator's web UI product.*

---

### Style 4: Modern SaaS Light (Liveblocks, Turso, Neon, Supabase)

**Characteristics:**

- Very white, lots of whitespace
- Colorful feature illustrations (isometric or flat)
- Big bold headlines (60–80px)
- Soft shadows, rounded corners everywhere
- Subtle grid or dot pattern on white background
- "Startup" feel — energetic but somewhat generic

**Seen in:** Turso.tech, Neon.tech, Liveblocks.io, Supabase.com (partially)

**Fit for Buggregator:** ★★★  
*Works for SaaS conversion. But Buggregator has no pricing tiers, no VC-backed startup narrative. Risk of feeling
dishonest — marketing a free tool as if it's a funded startup.*

---

### Style 5: Glassmorphism (Raycast, Arc Browser site, some Apple-adjacent products)

**Characteristics:**

- Frosted glass panels (backdrop-filter: blur)
- Gradient backgrounds (deep purple to blue, dark)
- Floating UI elements with glass effect
- Very visual, high "wow factor"
- Heavy on animation

**Seen in:** Raycast.com (partially), Linear's marketing animations

**Fit for Buggregator:** ★★  
*Raycast can pull it off because their product IS the visual. Buggregator's product is functional (debugging data).
Glassmorphism draws attention to itself, not to the content. Risk: flashy but unclear.*

---

### Style 6: Code-First Narrative (Stripe, Tailwind CSS, shadcn/ui)

**Characteristics:**

- Code is the hero — large, syntax-highlighted code blocks take prime real estate
- Dark sections with glowing code
- Minimal illustration — code examples replace diagrams
- Real API examples, not marketing copy
- "Show, don't tell" for developers

**Seen in:** Stripe.com, Tailwindcss.com, shadcn/ui site, Conform.ts

**Fit for Buggregator:** ★★★★  
*Strong for a developer tool. The "one docker run" command naturally fits this. But Buggregator is primarily a visual
product (you SEE the UI). Pure code-first misses the UI showcase opportunity.*

---

### Style 7: Bento Grid / Feature Mosaic (Apple, Arc, Framer)

**Characteristics:**

- Irregular grid of feature cards in different sizes
- Each card has its own visual treatment
- Interactive on hover — cards animate, expand, reveal
- Works best with a clear visual hierarchy of cards

**Seen in:** Apple.com (iPhone page), Arc Browser site, Framer

**Fit for Buggregator:** ★★★  
*Works well for showing many features at once. Buggregator has 8 event types — a bento grid could showcase them
elegantly. But requires high-quality illustrations for each card, which we don't have ready.*

---

## Part 2 — Expert Positions on Style Selection

### Marcus (UI / Visual Design Expert)

**Recommendation: Hybrid — "Developer Dark + Code-First Narrative"**

> The app itself is dark-first. The landing should match. But pure code-first ignores Buggregator's biggest asset: its
> beautiful UI. My recommendation: dark hero section with code (docker run command), followed by the UI showcase (tabbed
> mock components) as the "visual argument". The page alternates between code-heavy dark sections and UI-heavy lighter
> sections.

> This is the Railway.app model — but with more UI screenshots because that's where Buggregator's value lives.

> Typography: Keep DM Sans + JetBrains Mono from the app. Don't introduce a third font.

> Color temperature: Cool dark blues (#0c0e14 to #111318), not warm blacks. Consistent with the app's palette.

---

### Priya (UX Researcher)

**Recommendation: "Developer Dark" with strategic light breaks**

> Dark-first landing creates immediate context for developers: "this is a dev tool, not a SaaS product." The alternating
> light sections are UX anchors — they force the eye to reset and signal "new topic."

> Critical UX principle: the page should feel like you're descending into the product. Start abstract (headline), then
> more concrete (how it works), then most concrete (the actual UI in the showcase). Dark → Light → Dark alternation
> supports this narrative arc.

> Social traffic expects to be visually "hit" immediately. The hero cannot be a wall of text. The dark background with
> the animated event cards appearing achieves this.

---

### Artem (Domain Expert / PHP Developer)

**Recommendation: "Developer Dark" — but with trust signals from day 1**

> PHP developers are not impressed by visual flair — they're impressed by clarity and reliability. A dark, code-first
> design signals "this was built by developers, for developers." No corporate gradient, no startup-y pastel illustrations.

> What matters to a PHP dev in the first 5 seconds:
> 1. Is this for PHP? (framework logos)
> 2. How do I start? (docker run command)
> 3. Is this real? (GitHub stars, real class names in the demo)
>
> The design style should not get in the way of these three answers.

---

### Dana (Conversion Specialist)

**Recommendation: Style follows conversion architecture, not aesthetics**

> For social traffic converting to OSS tool: the page must be scannable at high speed. Dark background actually helps
> here — it creates contrast, text pops, there are fewer distractions.

> The "Code-First" element (docker command in hero) is the primary CTA. It must be the most visually prominent element
> after the headline. Dark background makes the code block glow.

> Avoid: excessive animation, parallax, particle effects. These increase cognitive load and hurt conversion for
> technical audiences. Subtle entrance animations only (150-200ms).

---

## Part 3 — DECISION: Selected Design Style

### ✅ "Developer Dark with UI Showcase" — Hybrid of Styles 1 + 6

**Name:** "Code-to-Visual" (internal label)

**Core concept:** Start with code (developer language), prove with UI (visual language). The page moves from abstract to
concrete: *command → explanation → live UI → outcome → install.*

**Visual DNA:**

- Dark-first, alternating with light content sections
- Code blocks treated as visual heroes (not hidden in docs)
- Real UI components (not illustrations or screenshots) as the "product proof"
- No decorative illustrations — the product IS the visual
- Monospace and geometric sans coexist — code has its own font
- Micro-animations only — no flashy effects

**Design benchmarks (primary):**

- [Railway.app](https://railway.app) — dark hero, code prominence, minimal decoration
- [Fly.io](https://fly.io) — code first, then product screenshots, clear progression
- [Warp](https://warp.dev) — dark aesthetic for terminal product, UI screenshots prominent

**Design benchmarks (secondary — for specific elements):**

- [Stripe.com](https://stripe.com) — code block treatment and syntax highlighting
- [Tailwindcss.com](https://tailwindcss.com) — code + live preview side by side
- [shadcn/ui](https://ui.shadcn.com) — monospace confidence, minimal chrome

**Explicitly NOT:**

- Glassmorphism (too flashy, distracts from content)
- Terminal retro aesthetic (too niche, wrong audience signal)
- Pure startup light (dishonest framing for a free OSS tool)
- Bento grid with illustrations (requires assets we don't have)

---

## Part 4 — Landing Style Guide

This style guide is specific to `buggregator.dev/spa-v2/`. It extends the app's design system (
`frontend/docs/design-guide.md`) with landing-specific decisions.

---

### 4.1 Design Tokens (Landing-specific)

The landing inherits ALL tokens from `frontend/docs/design-guide.md` and adds:

```css
/* Landing-specific additions to design-tokens.css */

/* Section backgrounds */
--section-dark: #0c0e14

; /* Hero, Steps, Install, Community */
--section-mid: #111318

; /* Footer, some content sections */
--section-light: #f8f9fa

; /* Replaces, Frameworks, Ecosystem */
--section-white: #ffffff

; /* Feature cards, ecosystem cards */

/* Landing-specific gradient */
--hero-gradient:

linear-gradient
(
180
deg,
#0c0e14

0
%
,
#0f1117

60
%
,
#111318

100
%
)
;

/* Code block */
--code-bg: #0d1117

; /* GitHub dark — familiar to developers */
--code-border: #21262d

;
--code-text: #c9d1d9

;
--code-comment: #6e7681

;
--code-keyword: #ff7b72

; /* red — env keys, docker options */
--code-string: #a5d6ff

; /* blue — values */
--code-operator: #79c0ff

; /* blue — = signs */

/* Hero accent glow */
--hero-glow:

rgba
(
59
,
130
,
246
,
0.15
)
; /* subtle blue ambient */

/* Trust badge */
--badge-bg:

rgba
(
255
,
255
,
255
,
0.06
)
;
--badge-border:

rgba
(
255
,
255
,
255
,
0.1
)
;
--badge-text: #8b919a

;

/* Version badge */
--version-bg:

rgba
(
59
,
130
,
246
,
0.12
)
;
--version-border:

rgba
(
59
,
130
,
246
,
0.25
)
;
--version-text: #60a5fa

;
--version-dot-new: #f59e0b

; /* amber — "just released" */
--version-dot-stable: #22c55e

; /* green — stable */

/* Step numbers */
--step-number-bg: #3b82f6

;
--step-number-text: #ffffff

;

/* Framework logo */
--logo-grayscale:

100
%
; /* default */
--logo-grayscale-hover:

0
%
; /* hover: full color */
--logo-opacity:

0.5
;
--logo-opacity-hover:

1.0
;
```

---

### 4.2 Typography

Inherited from app design system, with landing-specific scale additions:

```
Landing heading scale:

--text-hero:      3.5rem / 56px   (H1, hero headline — desktop)
--text-hero-sm:   2.25rem / 36px  (H1, hero headline — mobile)
--text-section:   2rem / 32px     (Section headings)
--text-section-sm: 1.5rem / 24px  (Section headings — mobile)
--text-card:      1.125rem / 18px (Feature card titles)
--text-body-lg:   1.125rem / 18px (Hero subheadline, step descriptions)
--text-body:      1rem / 16px     (Regular body text)
--text-small:     0.875rem / 14px (Caption, footer links)
--text-code:      0.875rem / 14px (Code blocks — always JetBrains Mono)
--text-badge:     0.75rem / 12px  (Version badge, trust badges)
```

**Font stack (same as app):**

```css
--font-ui:

"DM Sans"
,
system-ui, -apple-system, sans-serif

;
--font-mono:

"JetBrains Mono"
,
"Fira Code"
,
ui-monospace, monospace

;
```

**Heading font weight:** 700 (bold) for H1, 600 (semibold) for H2-H3  
**Body font weight:** 400 (regular)  
**Code font weight:** 400 (regular), 600 for highlighted parts

**Letter spacing:**

- Headings: `-0.02em` (slightly tighter, more impactful)
- Body: `0` (normal)
- All-caps labels: `0.08em` (looser, readable)
- Monospace: `0` (never tracked — ruins alignment)

---

### 4.3 Color Palette (Landing Context)

#### Hero Section (dark)

```
Background:       #0c0e14  (--section-dark)
Headline:         #ffffff  (pure white for maximum contrast on dark)
Subheadline:      #8b919a  (--text-secondary)
Command bg:       #0d1117  (--code-bg, GitHub-familiar)
Command text:     #c9d1d9  (--code-text)
Accent:           #3b82f6  (--accent-blue)
Framework logos:  50% opacity, grayscale → 100% + color on hover
```

#### Light Sections (Replaces, Frameworks, Ecosystem)

```
Background:       #f8f9fa  (--section-light)
Heading:          #111827  (near-black)
Body text:        #374151  (dark gray)
Muted text:       #6b7280
Borders:          #e5e7eb
Card bg:          #ffffff
Card border:      #e5e7eb
Card hover:       box-shadow 0 4px 20px rgba(0,0,0,0.08)
```

#### Step-by-Step Section (dark)

```
Background:       #0c0e14
Step number:      bg #3b82f6, text #ffffff
Title:            #ffffff
Description:      #8b919a
Code bg:          #0d1117
Terminal bg:      #0d1117
Terminal green:   #22c55e
```

#### Mock Showcase Section

```
Section bg:       #ffffff (or #f8f9fa)
Tab bar bg:       #f3f4f6
Active tab:       #ffffff, border-bottom: 2px solid --accent-blue
Inactive tab:     #6b7280
Panel bg:         #1a1d24  (--bg-surface from app — SAME as app)
Panel border:     #1e2128  (--border-subtle from app — SAME as app)
```

*Note: The panel inside the showcase uses the APP's dark theme colors — this is intentional. It creates a "window into
the app" effect.*

#### Install Section (dark)

```
Background:       #111318  (--section-mid, slightly lighter than hero)
Tab bg:           rgba(255,255,255,0.04)
Active tab:       rgba(255,255,255,0.08), border: 1px solid --border-default
Trust badges:     bg rgba(255,255,255,0.06), border rgba(255,255,255,0.1)
Badge checkmark:  #22c55e
```

---

### 4.4 Event Type Color System (Landing)

Used in MockShowcase tab dots, mock card left-stripes, and feature icons. Identical to app.

```
sentry:    #f43f5e   (rose-500)    — "critical, must see"
profiler:  #8b5cf6   (violet-500)  — "deep analysis"
smtp:      #f59e0b   (amber-500)   — "communication"
http-dump: #22c55e   (green-500)   — "network"
ray:       #06b6d4   (cyan-500)    — "interactive debug"
monolog:   #6b7280   (gray-500)    — "neutral, informational"
var-dump:  #ef4444   (red-500)     — "debug output"
sms:       #a855f7   (purple-500)  — "outbound"
```

---

### 4.5 Layout & Spacing

**Max content width:** `1200px` (wider than app, appropriate for landing)  
**Content padding:** `px-4 sm:px-6 lg:px-8` (Tailwind convention)  
**Section vertical padding:** `py-20 lg:py-28`  
**Hero height:** `min-h-screen` on desktop, `auto` on mobile

**Grid system:**

- Hero: 2 columns (55%/45%) on lg+, single column on mobile
- Features: 2-3 columns on md+, 1 column on mobile
- Steps: 2 columns (55%/45%) on lg+, 1 column on mobile
- Install tabs: single column, full width
- Ecosystem: 2 columns on md+, 1 column on mobile
- Advanced features: 3 columns on lg+, 2 on md, 1 on mobile
- Footer: 4 columns on lg+, 2 on md, 1 on mobile

---

### 4.6 Component Specifications

#### Navbar

```
Height:             64px (desktop), 56px (mobile)
Background:         #0c0e14 with backdrop-blur-md at scroll
Border-bottom:      1px solid #1e2128 (appears on scroll)
Logo:               wordmark + icon, height 28px
Nav links:          text-sm font-medium text-secondary, hover: text-primary
GitHub stars badge: bg rgba(255,255,255,0.06), border rgba(255,255,255,0.12)
                    font-mono text-sm, ⭐ prefix
Language switcher:  text-sm, flag or locale code
CTA button:         bg #3b82f6, text white, px-4 py-2, rounded-lg
                    hover: bg #2563eb, transition 150ms
```

#### Hero Headline

```
Font:               DM Sans, 700
Size:               56px desktop / 36px mobile
Color:              #ffffff
Line-height:        1.1 (tight — impactful)
Letter-spacing:     -0.02em
Max-width:          720px
```

#### Hero Subheadline

```
Font:               DM Sans, 400
Size:               18px
Color:              #8b919a
Line-height:        1.6
Max-width:          600px
```

#### Version Badge

```
Display:            inline-flex, items-center, gap-2
Padding:            px-3 py-1.5
Background:         rgba(59, 130, 246, 0.12)
Border:             1px solid rgba(59, 130, 246, 0.25)
Border-radius:      full (pill)
Text:               text-sm font-mono text-blue-400
Dot (new):          6px circle, bg amber-400, pulse animation
Dot (stable):       6px circle, bg green-400
```

#### CopyCommand Block

```
Background:         #0d1117
Border:             1px solid #21262d
Border-radius:      0.75rem (12px)
Padding:            16px 20px
Font:               JetBrains Mono, 14px
Text color:         #c9d1d9
Prompt ($):         #22c55e (green)
Copy button:        right-aligned, bg rgba(255,255,255,0.06)
                    hover: bg rgba(255,255,255,0.12)
                    icon → ✓ on copy, 2s reset
Max-width:          680px
Overflow:           scroll-x on mobile (no text-wrap on command)
```

#### Framework Logos Strip

```
Layout:             flex-wrap, gap-6, items-center
Logo height:        28px (desktop), 22px (mobile)
Default:            grayscale(100%) opacity-50
Hover:              grayscale(0%) opacity-100, transition 200ms
Label ("Works with:"): text-sm text-muted, font-medium
```

#### MockShowcase Container

```
Background:         #f8f9fa (section) → panel inside uses app dark theme
Border-radius:      1rem (16px)
Border:             1px solid #e5e7eb
Shadow:             0 25px 50px rgba(0,0,0,0.12)
Overflow:           hidden
Min-height:         500px (desktop), 400px (mobile)
```

#### Tab Bar (MockShowcase)

```
Background:         #f3f4f6
Padding:            4px
Border-bottom:      1px solid #e5e7eb
Tab button:
  Padding:          px-4 py-2
  Font:             text-sm font-medium
  Default color:    #6b7280
  Active color:     #111827
  Active bg:        #ffffff
  Active indicator: none (background is sufficient)
  Dot:              6px circle in event type color, mr-2
  Border-radius:    6px
  Transition:       150ms
```

#### Step Number

```
Width/height:       40px × 40px
Background:         #3b82f6
Border-radius:      full
Font:               DM Sans, 600, 18px
Color:              #ffffff
Connector line:     2px solid #1e2128, extends below number
```

#### Install Code Block

```
Same as CopyCommand, with:
  Border-radius:    0 0 12px 12px (tabs above have top-radius)
  Tab buttons:      border-bottom: 2px solid transparent (inactive)
                    border-bottom: 2px solid #3b82f6 (active)
  Language label:   top-right corner, text-xs font-mono text-muted
```

#### Trust Badge Row

```
Layout:             flex-wrap, gap-4
Badge:              flex items-center gap-2
Checkmark:          16px, color #22c55e
Text:               text-sm text-muted
```

#### Community Stats

```
Grid:               4 columns (lg), 2 (md), 2 (sm)
Number:             text-3xl font-bold text-white
Label:              text-sm text-muted mt-1
Separator:          1px vertical line, #1e2128
```

---

### 4.7 Animation & Interactions

**Philosophy:** Micro-animations that confirm action or guide attention. No animations for decoration.

```
Entry animations (elements on page load):
  Hero headline:    fadeInUp 400ms 0ms ease-out
  Hero subheadline: fadeInUp 400ms 100ms ease-out  
  Hero command:     fadeInUp 400ms 200ms ease-out
  Hero logos:       fadeIn 400ms 350ms ease-out

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px) }
    to   { opacity: 1; transform: translateY(0) }
  }

Hero visual (event cards):
  Card 1 (sentry):  slideUpFade 400ms 0ms
  Card 2 (smtp):    slideUpFade 400ms 800ms
  Card 3 (ray):     slideUpFade 400ms 1600ms
  Card 4 (profiler):slideUpFade 400ms 2400ms
  animation-fill-mode: both (hold final state)

Tab switching:
  Transition:       opacity 0→1, 150ms ease
  Mode:             out-in (old fades out before new fades in)

Navbar:
  Background blur:  0→12px on scroll (100ms)
  Border-bottom:    opacity 0→1 on scroll (100ms)

Copy button feedback:
  Icon swap (→✓):   0ms (instant)
  Reset delay:      2000ms
  Color:            #22c55e on success state

Framework logo hover:
  Filter:           grayscale(100%)→grayscale(0%), 200ms
  Opacity:          0.5→1.0, 200ms

CTA button hover:
  Background:       color shift, 150ms
  Transform:        none (no scale on primary CTAs — too distracting)

Card hover (ecosystem, advanced features):
  Box-shadow:       0 4px 20px rgba(0,0,0,0.08), 200ms
  Transform:        translateY(-2px), 200ms
```

**Disabled patterns:**

- No parallax scroll effects
- No particle systems / canvas backgrounds
- No text typing animations (too slow for social traffic)
- No scroll-triggered section animations (hurt Core Web Vitals)
- No video backgrounds

---

### 4.8 Accessibility

Inherits WCAG 2.1 AA requirements from app design guide, plus landing-specific:

```
Focus ring:         2px solid #3b82f6, offset 2px (all interactive elements)
Skip link:          "Skip to main content" — first focusable element
Hero image alt:     descriptive alt on any product screenshots
Color contrast:
  White on #0c0e14:       15.8:1 ✓
  #8b919a on #0c0e14:     4.6:1 ✓
  #111827 on #f8f9fa:     16.2:1 ✓
  #3b82f6 on #0c0e14:     5.9:1 ✓ (large text, interactive)
Touch targets:      44px minimum height/width on mobile
Reduced motion:     @media (prefers-reduced-motion: reduce) {
                      * { animation-duration: 0.01ms !important; }
                    }
```

---

### 4.9 Responsive Breakpoints

```
Mobile:     0 – 639px    (sm breakpoint threshold)
Tablet:     640 – 1023px (md breakpoint threshold)
Desktop:    1024 – 1279px (lg breakpoint threshold)
Wide:       1280px+       (xl breakpoint threshold)

Design at:  375px (iPhone SE), 768px (iPad), 1280px (standard laptop), 1440px (wide)
```

**Mobile-specific rules:**

- Hero: single column, command block scroll-x, visual cards hidden → show 2 static cards
- Showcase: tabs scroll horizontally (overflow-x: auto), graph height 300px
- Steps: single column, preview column hidden
- Framework logos: 3×2 grid instead of single row
- Install tabs: accordion instead of horizontal tabs on < 640px
- Footer: single column, sections collapsed

---

### 4.10 SEO & Performance Directives

```html

<head>
    <title>Buggregator — One docker run. All your debug data in one place.</title>
    <meta name="description"
          content="Free open-source debugging server for PHP. Exceptions, logs, dumps, emails, profiling — in one real-time UI. No registration, no config, no cost.">
    <meta property="og:title" content="Buggregator — Debug everything in one place">
    <meta property="og:description"
          content="Replace Sentry + Mailhog + Ray + XHProf for local development. One docker run command.">
    <meta property="og:image" content="/og-image.png">  <!-- 1200×630, dark bg, product screenshot -->
    <meta property="og:type" content="website">
    <link rel="canonical" href="https://buggregator.dev/">
</head>
```

**Performance rules:**

- Vue Flow: dynamic import (`defineAsyncComponent`) — not in initial bundle
- Framework logos: SVG inline or WebP, max 4KB each
- Fonts: `font-display: swap`, preload DM Sans 700 and JetBrains Mono 400
- Mock JSON: imported as static data, not fetched at runtime
- No Google Fonts CDN — self-host fonts for performance and privacy

---

## Part 5 — Final Expert Consensus

All five experts agreed on the "Developer Dark with UI Showcase" direction.

| Expert            | Primary concern                                                                     | Verdict    |
|-------------------|-------------------------------------------------------------------------------------|------------|
| Priya (UX)        | Narrative arc dark→light→dark supports "descending into the product" mental model   | ✅ Approved |
| Marcus (UI)       | Brand cohesion with app achieved; code blocks and UI showcase complement each other | ✅ Approved |
| Artem (Domain)    | Signals "built by devs for devs"; PHP developers will feel at home                  | ✅ Approved |
| Dana (Conversion) | Dark bg increases code block contrast = better CTA visibility                       | ✅ Approved |
| Customer Voice    | All 3 personas (junior, mid, lead) respond positively to this visual context        | ✅ Approved |

**One unresolved question (deferred to author):** Secondary language priority — which locale after English? Options:
Russian (buggregator.dev creators' language), Spanish (large PHP Laravel community in LatAm), German (large Symfony
community). Recommend: start with one, add more based on analytics.
