# Buggregator Landing Page — Style Guide

> Version: 1.0 | Date: 2026-03-28
> Applies to: buggregator.dev/spa-v2 (Nuxt 4 landing)
> Design direction: "Developer Dark with UI Showcase"
> Extends: frontend/docs/design-guide.md (app design system)

---

## 1. Design Philosophy

**Direction:** Code-to-Visual — start with developer language (commands, code), prove with product UI (real debug
events).

**Five principles:**

1. **Dark is home** — developers live in dark environments. The landing matches that context from the first pixel.
2. **Code is content** — `docker run`, `.env` snippets, class names in the profiler graph. These are not decoration;
   they are the value proposition.
3. **UI is proof** — the product's own interface (rendered as Vue components with real data) is the best marketing
   asset.
4. **No deception** — free OSS tool. No startup-y gradients, no enterprise pricing table aesthetic. The design must
   match the product's honesty.
5. **One font, two faces** — DM Sans for human language, JetBrains Mono for machine language. The same as the app.

---

## 2. Design Tokens

### 2.1 Colors

#### Background Scale (Dark Sections)

```
--color-dark-900: #0c0e14    Hero, Steps, Community
--color-dark-800: #111318    Install, Footer
--color-dark-700: #1a1d24    Cards inside dark sections
--color-dark-600: #22262e    Hover states inside dark sections
```

#### Background Scale (Light Sections)

```
--color-light-50:  #f8f9fa   Replaces, Frameworks, Ecosystem sections
--color-light-100: #f3f4f6   Tab bars, subtle surfaces
--color-light-200: #e5e7eb   Borders in light sections
--color-white:     #ffffff   Cards, panels
```

#### Text

```
On dark background:
  --text-on-dark-primary:   #ffffff    Headlines
  --text-on-dark-secondary: #8b919a   Body text, descriptions
  --text-on-dark-muted:     #555b65   Captions, timestamps, metadata

On light background:
  --text-on-light-primary:   #111827   Headlines
  --text-on-light-secondary: #374151   Body text
  --text-on-light-muted:     #6b7280   Captions
```

#### Accent

```
--accent-blue:        #3b82f6   Primary CTA, links, step numbers, focus rings
--accent-blue-hover:  #2563eb   Hover state on blue elements
--accent-blue-subtle: rgba(59, 130, 246, 0.12)   Badge backgrounds, tints
--accent-blue-border: rgba(59, 130, 246, 0.25)   Badge borders
```

#### Code

```
--code-bg:       #0d1117   Code block background (GitHub Dark)
--code-border:   #21262d   Code block border
--code-text:     #c9d1d9   Default code text
--code-keyword:  #ff7b72   Env variable names, docker flags
--code-string:   #a5d6ff   Env values, strings
--code-comment:  #6e7681   Comments
--code-prompt:   #22c55e   Terminal $ prompt
```

#### Status / Event Types

```
--color-sentry:    #f43f5e   Exceptions (rose)
--color-profiler:  #8b5cf6   Profiler (violet)
--color-smtp:      #f59e0b   Email (amber)
--color-http:      #22c55e   HTTP Dump (green)
--color-ray:       #06b6d4   Ray (cyan)
--color-monolog:   #6b7280   Logs (gray)
--color-vardump:   #ef4444   VarDump (red)
--color-sms:       #a855f7   SMS (purple)
```

#### Utility

```
--version-dot-new:    #f59e0b   "Just released" badge dot (amber)
--version-dot-stable: #22c55e   Stable version dot (green)
--success:            #22c55e   Copy confirmation checkmark
--focus-ring:         #3b82f6   Focus outline
```

---

### 2.2 Typography

#### Font Families

```css
--font-ui:   "DM Sans", system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", ui-monospace, Menlo, monospace;
```

#### Size Scale

```
Landing-specific:
  --text-hero:        3.5rem / 56px    H1 desktop
  --text-hero-mobile: 2.25rem / 36px   H1 mobile
  --text-section:     2rem / 32px      H2 section headings
  --text-card-title:  1.125rem / 18px  Feature card headings
  --text-body-lg:     1.125rem / 18px  Hero sub, step descriptions
  --text-body:        1rem / 16px      Regular body
  --text-small:       0.875rem / 14px  Captions, footer links, badge text
  --text-code:        0.875rem / 14px  Code blocks (always mono)
  --text-label:       0.75rem / 12px   All-caps labels, metadata
```

#### Weight

```
700   Bold      — H1, H2, stat numbers
600   Semibold  — H3, card titles, step titles, nav CTA
500   Medium    — nav links, tab labels
400   Regular   — body text, descriptions
```

#### Letter Spacing

```
Headings:    -0.02em   (tighter, more impactful)
Body:         0        (normal)
All-caps:    +0.08em   (more readable at small sizes)
Monospace:    0        (never track monospace — ruins alignment)
```

#### Line Height

```
Hero headline:   1.1    (tight — visual impact)
Section heading: 1.2
Body text:       1.6    (comfortable for reading)
Code:            1.6    (consistent line height for scanning)
```

---

### 2.3 Spacing

Shared 4px base grid:

```
4px     Inner padding: badges, small chips
8px     Gap: inline elements, icon + text
12px    Padding: compact cards (mobile)
16px    Padding: cards (desktop), gap between cards
24px    Section content padding (inner)
32px    Gap: between major elements within a section
48px    Navbar height (mobile)
64px    Navbar height (desktop)
80px    Section vertical padding (py-20)
112px   Section vertical padding large (py-28)
```

---

### 2.4 Border Radius

```
4px    (rounded)     Small badges, code inline
6px    (rounded-md)  Tab buttons, small buttons
8px    (rounded-lg)  Navbar CTA, trust badges
12px   (rounded-xl)  Code blocks, CopyCommand
16px   (rounded-2xl) Showcase container, ecosystem cards
24px   (rounded-3xl) Large feature cards (if used)
9999px (rounded-full) Version badge, step numbers, logo pill
```

---

### 2.5 Shadows

```
--shadow-card-light: 0 1px 3px rgba(0,0,0,0.08),
                     0 4px 12px rgba(0,0,0,0.05);

--shadow-card-hover: 0 4px 20px rgba(0,0,0,0.12),
                     0 8px 32px rgba(0,0,0,0.08);

--shadow-showcase:   0 25px 50px rgba(0,0,0,0.15),
                     0 10px 20px rgba(0,0,0,0.10);

--shadow-code:       0 8px 24px rgba(0,0,0,0.40);   (dramatic on dark bg)

/* No shadows on dark section elements — use border instead */
```

---

## 3. Components

### 3.1 Buttons

#### Primary CTA ("Get Started", "Copy command")

```
Background:     var(--accent-blue)            #3b82f6
Text:           #ffffff, font-medium, text-sm
Padding:        px-5 py-2.5
Border-radius:  rounded-lg (8px)
Border:         none
Hover:          background var(--accent-blue-hover)  #2563eb, 150ms
Focus:          ring-2 ring-blue-400 ring-offset-2
Active:         scale(0.98), 100ms
```

#### Secondary ("Read docs", "View on GitHub")

```
Background:     rgba(255,255,255,0.06)  (on dark)
                transparent             (on light)
Text:           #8b919a (dark bg) / #374151 (light bg), text-sm
Border:         1px solid rgba(255,255,255,0.12) (dark)
                1px solid #d1d5db               (light)
Border-radius:  rounded-lg (8px)
Hover:          background rgba(255,255,255,0.10) (dark)
                background #f3f4f6              (light)
Padding:        px-4 py-2
```

#### Ghost / Text Link

```
Background:     transparent
Text:           var(--accent-blue), text-sm, underline on hover
Arrow:          " →" appended as text
Hover:          text-blue-400, 150ms
```

---

### 3.2 Navbar

```
Height:           64px desktop / 56px mobile
Position:         sticky, top: 0, z-index: 50
Background:       transparent → #0c0e14 + backdrop-blur-md on scroll
Border-bottom:    none → 1px solid #1e2128 on scroll

Logo:
  Height: 28px
  Color: white (svg fill)
  Margin-right: 32px (to nav links)

Nav links:
  Font: text-sm font-medium
  Color: --text-on-dark-secondary (#8b919a)
  Hover: --text-on-dark-primary (#ffffff), 150ms
  Gap: 24px between links

GitHub stars badge:
  Background: rgba(255,255,255,0.06)
  Border: 1px solid rgba(255,255,255,0.10)
  Border-radius: rounded-full
  Padding: px-3 py-1
  Font: font-mono text-sm
  Color: --text-on-dark-secondary

CTA button:
  → See Primary button spec
  Margin-left: 16px

Language switcher:
  Font: text-sm font-mono
  Color: --text-on-dark-muted
  Hover: --text-on-dark-primary

Mobile:
  Logo only + hamburger icon
  Hamburger: 24px, color --text-on-dark-secondary
  Drawer: full-width, background #0c0e14, py-6, links stacked
```

---

### 3.3 Hero Section

```
Layout: 2-column grid on lg+ (55% left / 45% right)
        Single column on mobile
Background: var(--color-dark-900) = #0c0e14
Padding: pt-32 pb-24 (account for sticky navbar)
Min-height: 100vh desktop, auto mobile

Left column:
  Max-width: 640px

  Badge row:
    Gap: 8px
    Margin-bottom: 24px
    Version badge + "Free & Open Source" badge

  H1:
    Font: DM Sans 700, 56px / 36px mobile
    Color: #ffffff
    Line-height: 1.1
    Letter-spacing: -0.02em
    Margin-bottom: 20px

  Subheadline:
    Font: DM Sans 400, 18px
    Color: --text-on-dark-secondary
    Line-height: 1.6
    Max-width: 560px
    Margin-bottom: 32px

  CopyCommand:
    Max-width: 620px
    Margin-bottom: 16px

  Ghost link (Trap):
    Font: text-sm
    Color: --text-on-dark-muted
    Hover: --text-on-dark-secondary
    Arrow: " →"

  Framework logos:
    Margin-top: 40px

Right column:
  Display: hidden on mobile, visible lg+
  Position: relative
  Contains: HeroVisual (animated event cards)
```

---

### 3.4 Version Badge

```
Display: inline-flex, items-center, gap-2
Padding: px-3 py-1.5
Background: rgba(59,130,246,0.12)
Border: 1px solid rgba(59,130,246,0.25)
Border-radius: rounded-full
Font: font-mono text-sm
Color: #60a5fa (blue-400)
Link: href to GitHub release page, no underline

Dot:
  Width/height: 6px
  Border-radius: full
  new: #f59e0b, animation: pulse 2s infinite
  stable: #22c55e

Text: "v{version}" + " · just released" (if isNew)
```

---

### 3.5 CopyCommand

```
Container:
  Background: #0d1117
  Border: 1px solid #21262d
  Border-radius: 12px
  Padding: 16px 20px
  Position: relative
  Overflow-x: auto (mobile)

Prompt ($):
  Color: #22c55e
  Font: font-mono, 14px
  Margin-right: 8px
  User-select: none

Command text:
  Color: #c9d1d9
  Font: font-mono, 14px
  White-space: pre (preserve formatting)

Copy button:
  Position: absolute, top: 12px, right: 12px
  Width/height: 32px × 32px
  Background: rgba(255,255,255,0.06)
  Border: 1px solid rgba(255,255,255,0.10)
  Border-radius: 6px
  Color: --text-on-dark-muted
  Hover: background rgba(255,255,255,0.12), color #ffffff
  Active state: color #22c55e (✓ icon, 2s)
  aria-label: "Copy command to clipboard"
```

---

### 3.6 MockShowcase Container

```
Section background: #f8f9fa
Section padding: py-24

Container:
  Background: #ffffff
  Border: 1px solid #e5e7eb
  Border-radius: 16px
  Overflow: hidden
  Box-shadow: var(--shadow-showcase)
  Max-width: 1000px
  Margin: 0 auto

Section header (above container):
  H2: text-section, font-bold, text-on-light-primary, text-center, mb-3
  Subtitle: text-body-lg, text-on-light-muted, text-center, mb-12

Tab bar:
  Background: #f3f4f6
  Padding: 4px (all around tabs)
  Border-bottom: 1px solid #e5e7eb
  Display: flex, overflow-x: auto (mobile)

Tab button:
  Padding: px-4 py-2
  Border-radius: 6px
  Font: text-sm font-medium
  Default: color #6b7280, bg transparent
  Active: color #111827, bg #ffffff
  Before icon: 6px circle in event type color, mr-1.5
  Gap: 4px between tabs
  Transition: 150ms

Tab panel:
  Background: #1a1d24   ← THIS IS THE APP'S DARK THEME
  Min-height: 480px desktop / 320px mobile
  Padding: 16px
```

---

### 3.7 Exception Preview (MockSentryTab)

```
Container:
  Background: #1a1d24 (--bg-surface)
  Border-radius: 8px
  Overflow: hidden

Header:
  Background: #111318 (--bg-base)
  Padding: 12px 16px

  Exception type:
    Font: font-mono, text-sm, text-rose-400
    Font-weight: 600

  Unhandled badge:
    Background: rgba(244,63,94,0.12)
    Color: #fb7185
    Font: text-xs font-semibold
    Padding: px-2 py-0.5
    Border-radius: 4px

  Message (pre):
    Font: font-mono, text-xs
    Color: #c9d1d9
    Background: rgba(0,0,0,0.3)
    Padding: 8px 12px
    Border-radius: 4px
    Margin-top: 8px

Stack frame:
  Border-top: 1px solid #1e2128
  Padding: 12px 16px
  
  First frame (expanded):
    Background: rgba(244,63,94,0.05)

  File path: font-mono, text-xs, text-rose-400
  Line number: font-mono, text-xs, text-muted, ml-2
  Code context: font-mono, text-xs, bg #0d1117, padding: 8px, border-radius: 4px
  Active line: background rgba(244,63,94,0.15), color #fb7185
```

---

### 3.8 Call Graph (MockProfilerTab)

```
Container:
  Min-height: 480px desktop, 300px mobile
  Background: #111318 (--bg-base)
  Overflow: hidden
  Position: relative

Caption overlay:
  Position: absolute, top: 12px, left: 12px, z-index: 10
  Background: rgba(0,0,0,0.6)
  Backdrop-filter: blur(8px)
  Border: 1px solid #2a2f38
  Border-radius: 8px
  Padding: px-3 py-2
  Font: font-mono, text-xs, text-muted

Vue Flow settings:
  default-viewport: { zoom: 0.6, x: 0, y: 0 }
  fit-view-on-init: true
  nodes-draggable: false
  nodes-connectable: false
  elements-selectable: false
  min-zoom: 0.3
  max-zoom: 1.5

Node colors: inherited from profiler-callgraph.json
  (dark red for hot nodes, white for cold nodes — already in mock data)

Edge colors: from mock data (#000000, #340707, #982525, etc.)

Hottest path: pre-highlighted on mount
  Edge: stroke #60a5fa, strokeWidth 3, animated: true
  Dim others: opacity 0.15 (non-path nodes/edges)
```

---

### 3.9 Step Number + Connector

```
Step number circle:
  Width/height: 40px × 40px
  Background: #3b82f6
  Border-radius: full
  Font: DM Sans, 600, 18px
  Color: #ffffff
  Flex-shrink: 0

Connector line:
  Width: 2px
  Background: #1e2128
  Height: calc(100% - 40px)
  Margin: auto (horizontally, centered under number)

Step title:
  Font: DM Sans, 600, 20px
  Color: #ffffff
  Margin-bottom: 8px

Step description:
  Font: DM Sans, 400, 16px
  Color: #8b919a
  Line-height: 1.6
  Margin-bottom: 16px
```

---

### 3.10 Framework Tabs (in Step 2)

```
Tab bar:
  Display: flex, overflow-x: auto (mobile)
  Gap: 4px
  Margin-bottom: 0
  Background: #0d1117
  Border-radius: 8px 8px 0 0
  Padding: 8px 8px 0 8px

Tab button:
  Padding: px-4 py-2
  Font: font-mono, text-sm
  Default: color #6e7681, bg transparent, border-bottom: 2px solid transparent
  Active: color #c9d1d9, bg rgba(255,255,255,0.04), border-bottom: 2px solid #3b82f6
  Transition: 150ms

Tab content:
  Background: #0d1117
  Border-radius: 0 0 8px 8px
  Border: 1px solid #21262d
  Border-top: none
  Padding: 16px 20px
```

---

### 3.11 Trust Badge Row

```
Layout: flex-wrap, gap-x-6, gap-y-2, mt-6

Badge:
  Display: inline-flex, items-center, gap-2
  Font: text-sm
  Color: --text-on-dark-secondary (on dark) / --text-on-light-muted (on light)

Checkmark icon:
  Width: 16px, height: 16px
  Color: #22c55e (green)
  Flex-shrink: 0
```

---

### 3.12 Ecosystem Card

```
Background: #ffffff
Border: 1px solid #e5e7eb
Border-radius: 16px
Padding: 24px
Box-shadow: var(--shadow-card-light)
Hover: var(--shadow-card-hover), translateY(-2px), 200ms

Icon:
  Width/height: 40px × 40px
  Border-radius: 10px
  Background: appropriate event type color at 12% opacity
  Margin-bottom: 16px

Title:
  Font: DM Sans, 600, 18px
  Color: #111827
  Margin-bottom: 8px

Description:
  Font: DM Sans, 400, 14px
  Color: #6b7280
  Line-height: 1.6
  Margin-bottom: 16px

Code block (install command):
  Same as CopyCommand but smaller (text-xs)
  Background: #f8f9fa
  Border: 1px solid #e5e7eb

Links:
  Font: text-sm
  Color: #3b82f6
  Hover: underline
```

---

### 3.13 Footer

```
Background: #111318
Border-top: 1px solid #1e2128
Padding: py-16

Logo + tagline:
  Logo: 24px height, white
  Tagline: text-sm, text-muted, mt-2

Column headings:
  Font: text-xs, font-semibold, uppercase, tracking-wider
  Color: #8b919a
  Margin-bottom: 16px

Links:
  Font: text-sm
  Color: #555b65
  Hover: #8b919a, 150ms
  Line-height: 2 (spacious)

Bottom bar:
  Border-top: 1px solid #1e2128
  Margin-top: 40px
  Padding-top: 24px
  Font: text-sm, text-muted
  Display: flex, justify-between
```

---

## 4. Section Sequence & Background Map

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR              #0c0e14 + blur on scroll        │
├─────────────────────────────────────────────────────┤
│ HERO                #0c0e14  (dark 900)             │
├─────────────────────────────────────────────────────┤
│ REPLACES            #f8f9fa  (light 50)             │
├─────────────────────────────────────────────────────┤
│ MOCK SHOWCASE       #f8f9fa  (outer)                │
│  └─ tab panel       #1a1d24  (inner — app dark)     │
├─────────────────────────────────────────────────────┤
│ STEPS               #0c0e14  (dark 900)             │
├─────────────────────────────────────────────────────┤
│ INSTALL             #111318  (dark 800)             │
├─────────────────────────────────────────────────────┤
│ FRAMEWORKS          #f8f9fa  (light 50)             │
├─────────────────────────────────────────────────────┤
│ ECOSYSTEM           #ffffff  (white)                │
├─────────────────────────────────────────────────────┤
│ ADVANCED FEATURES   #f3f4f6  (light 100)            │
├─────────────────────────────────────────────────────┤
│ COMMUNITY           #0c0e14  (dark 900)             │
├─────────────────────────────────────────────────────┤
│ FOOTER              #111318  (dark 800)             │
└─────────────────────────────────────────────────────┘
```

Pattern: dark → light → dark (showcase inner) → dark → light → white → light → dark → dark  
Alternation keeps the page from feeling monotonous and creates visual "chapters."

---

## 5. Prohibited Patterns

To maintain design integrity, the following must never appear on the landing:

```
❌ Glassmorphism (backdrop-filter: blur on light content panels)
❌ Gradient hero text (background-clip: text)
❌ Particle systems / canvas animations
❌ Parallax scroll effects (hurt Core Web Vitals)
❌ Text typing / typewriter animations
❌ Emoji in headings or section titles
❌ More than 2 accent colors (only blue + event type colors)
❌ Rounded corners > 24px (looks toy-like)
❌ Box shadows on dark section elements (use borders instead)
❌ Decorative illustrations without real product context
❌ Video backgrounds
❌ Autoplay video (accessibility / performance)
❌ Stock photography of people / offices
❌ Startup-y gradient backgrounds (purple-to-blue full-page gradients)
❌ Counting animations on stats (prefer instant display)
❌ Hover tooltips on non-interactive elements
```

---

## 6. CSS Implementation

All values should be implemented as CSS custom properties in `assets/css/design-tokens.css` and extended in
`tailwind.config.ts`.

### Tailwind Extensions (tailwind.config.ts)

```ts
export default {
  content: ['./app/**/*.{vue,ts}', './components/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        // Landing sections
        'section-dark': '#0c0e14',
        'section-mid': '#111318',
        'section-light': '#f8f9fa',
        
        // Accent
        'accent': {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          subtle: 'rgba(59,130,246,0.12)',
        },
        
        // Code
        'code': {
          bg: '#0d1117',
          border: '#21262d',
          text: '#c9d1d9',
          keyword: '#ff7b72',
          string: '#a5d6ff',
          comment: '#6e7681',
          prompt: '#22c55e',
        },
        
        // Event types (for Tailwind safelist)
        'sentry': '#f43f5e',
        'profiler': '#8b5cf6',
        'smtp': '#f59e0b',
        'http-dump': '#22c55e',
        'ray': '#06b6d4',
        'monolog': '#6b7280',
        'var-dump': '#ef4444',
        'sms': '#a855f7',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-sm': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fadeInUp': 'fadeInUp 400ms ease-out both',
        'pulse-dot': 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.08)',
        'showcase': '0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.10)',
        'code': '0 8px 24px rgba(0,0,0,0.40)',
      },
    },
  },
}
```

---

## 7. Accessibility Checklist

```
[ ] All images have descriptive alt attributes
[ ] All icon-only buttons have aria-label
[ ] Tab components have role="tablist", "tab", "tabpanel"
[ ] Tab panels have aria-labelledby pointing to tab button
[ ] CopyCommand button has aria-label and aria-live for success state
[ ] Skip link "Skip to main content" as first focusable element
[ ] Focus ring visible on ALL interactive elements (2px solid #3b82f6)
[ ] No color-only information (event types also use text labels)
[ ] Minimum 44px touch targets on mobile
[ ] @media (prefers-reduced-motion) removes all animations
[ ] Lang attribute on <html> matches current locale
[ ] Contrast ratios:
    white on #0c0e14     15.8:1  ✓ (AAA)
    #8b919a on #0c0e14    4.6:1  ✓ (AA)
    #111827 on #f8f9fa   16.2:1  ✓ (AAA)
    #3b82f6 on #0c0e14    5.9:1  ✓ (AA Large)
    #60a5fa on #0c0e14    7.4:1  ✓ (AAA)
```

---

*This style guide is a living document. Update when design decisions change during implementation.*
*Reference: frontend/docs/design-guide.md for the app design system this extends.*
