# FIRE 2026 — Design System

A reference for the design language, token system, layout patterns, and
component conventions used across the FIRE 2026 track website. Read this
before contributing CSS, layout changes, or new pages.

> **TL;DR** — vanilla HTML + CSS (native `@layer` cascade) + vanilla JS
> (no framework, no build step). Light theme is the default. Tokens are
> CSS custom properties; components consume tokens, never hardcoded
> colors. Animations are CSS `@keyframes` plus IntersectionObserver.

---

## 1. Architecture

```
              ┌────────────────────────────────────────┐
              │  HTML pages (no build, no JSX)         │
              │  index.html, 404.html, pages/*.html    │
              └──────────────────┬─────────────────────┘
                                 │
              ┌──────────────────┴─────────────────────┐
              │  CSS — 13 files, native @layer         │
              │  base · type · layout · components     │
              │  landing · task · loader · cookie      │
              │  logo · syntax · animations · theme    │
              └──────────────────┬─────────────────────┘
                                 │
              ┌──────────────────┴─────────────────────┐
              │  JS — 17 files, IIFE modules, no bundler│
              │  theme · loader · nav · scroll-reveal  │
              │  tilt · counter · timeline · scrollspy  │
              │  syntax · typewriter · copy · logo      │
              │  transitions · cookie-disclosure       │
              │  + vendor/pretext.js (text measurement)│
              └────────────────────────────────────────┘
```

**No build step.** Every file is served as-is from the repository. The
deploy pipeline (`/.github/workflows/deploy.yml`) only copies the source
to the `gh-pages` branch. The only "build" is the GitHub Pages publisher.

**No framework.** No React, Vue, Svelte, Tailwind, PostCSS, or bundler.
All layout is hand-written CSS; all interactivity is hand-written
vanilla JS (ES2020+, IIFE modules, IntersectionObserver, View
Transitions API where supported).

**Layer order** declared in `css/base.css`:

```css
@layer reset, tokens, base, layout, components, pages, utilities, animations;
```

This order means `reset` wins for cascading conflicts (none expected) and
`animations` wins for things like hover transitions (highest specificity
in intent, last in cascade).

---

## 2. Color tokens

All colors live as CSS custom properties in `:root` (light, default) and
`[data-theme="dark"]` (dark, opt-in). The default theme is **light**
("coffee paper"); the dark theme is opt-in via the toggle button.

### Light theme (`:root`)

| Token | Value | Use |
|---|---|---|
| `--color-void` | `#f5f0e8` | page background |
| `--color-abyss` | `#f0ead6` | alternating section background |
| `--color-surface-1` | `#ebe4d0` | card / panel background |
| `--color-surface-2` | `#e5dcc6` | raised surface, table heads |
| `--color-border` | `#c9bda4` | 1px line color |
| `--color-border-lit` | `#b0a288` | hover / focus line color |
| `--color-text` | `#2c2416` | body text |
| `--color-text-strong` | `#1a1408` | emphasized text |
| `--color-muted` | `#6b5d4a` | secondary text |
| `--color-ghost` | `#9a8b74` | tertiary text (eyebrows, dividers) |
| `--color-heading` | `#1a1408` | h1–h6 color |
| `--color-cyan` | `#0a7a9e` | accent (links, focus, primary button) |
| `--color-pink` | `#c42050` | destructive / sycophancy-warn |
| `--color-green` | `#1a8a5a` | positive (non-sycophantic) |
| `--color-amber` | `#b87a20` | warning (tentative metrics) |
| `--color-violet` | `#6a42c4` | secondary accent |

### Dark theme (`[data-theme="dark"]`)

| Token | Value |
|---|---|
| `--color-void` | `#000000` |
| `--color-abyss` | `#080808` |
| `--color-surface-1` | `#0e0e0e` |
| `--color-surface-2` | `#141414` |
| `--color-border` | `#1c1c1c` |
| `--color-border-lit` | `#2a2a2a` |
| `--color-text` | `#e8e8e8` |
| `--color-text-strong` | `#ffffff` |
| `--color-muted` | `#888888` |
| `--color-ghost` | `#444444` |
| `--color-heading` | `#ffffff` |
| `--color-cyan` | `#00e5ff` |
| `--color-pink` | `#ff2d6b` |
| `--color-green` | `#00ff99` |
| `--color-amber` | `#ffb347` |
| `--color-violet` | `#9b6dff` |

### Glow variants (theme-aware)

```css
--glow-cyan:  0 0 20px rgba(10, 122, 158, 0.2), 0 0 40px rgba(10, 122, 158, 0.08);  /* light */
--glow-cyan:  0 0 24px rgba(0, 229, 255, 0.3),  0 0 48px rgba(0, 229, 255, 0.1);   /* dark  */
--glow-pink:  same pattern with the pink channel
```

Use these on hover for cards, buttons, and the hero logo. The reduced
opacity in light mode prevents the glow from being harsh against the
tan background.

### Theme application rules

1. **Never** hardcode `#ffffff`, `#000000`, `#1a1408`, `#f5f0e8`, etc.
   Use a token.
2. **Never** write a `[data-theme="light"]` override — light is the
   default. Add `[data-theme="dark"]` for dark-specific values.
3. JSON code blocks (`<div class="json-block">`) stay dark in both
   themes because syntax-highlight colors are designed for a dark
   background. Implemented in `css/theme.css` as `:root` rules.
4. The page has a paper-texture overlay (`body::before`) in light mode
   only (subtle SVG fractal noise at 0.5 opacity).

---

## 3. Typography

### Font stack

```css
--font-display:  'Cinzel Decorative', serif;   /* display: headings, eyebrow, loader wordmark */
--font-body:     'Cormorant Garamond', serif;  /* body: paragraphs, pull-quotes, prose */
--font-mono:     'Fira Code', 'JetBrains Mono', monospace;  /* code, dates, badges, metrics */
```

Loaded from Google Fonts:

```
Cinzel Decorative: weights 400, 700, 900
Cormorant Garamond: weights 300, 400, 500, 600 (regular) + 400, 500 (italic)
Fira Code:         weight 400
```

### Type scale (`:root`)

| Token | Value | Use |
|---|---|---|
| `--type-xs` | `0.75rem` | eyebrows, badges, small mono |
| `--type-sm` | `0.875rem` | nav links, captions, secondary text |
| `--type-base` | `1.1rem` | body, table cells |
| `--type-md` | `1.25rem` | hero subtitle, `.prose-lg` |
| `--type-lg` | `1.5rem` | card titles, organizer names, h4 |
| `--type-xl` | `2rem` | h3 |
| `--type-2xl` | `3rem` | h2, pull-quote, stat cards |
| `--type-3xl` | `4.5rem` | stat-card number (large) |
| `--type-hero` | `clamp(3.5rem, 8vw, 7rem)` | h1 only |

### Heading hierarchy

- `<h1>` — only once per page, used in page-title. Letter-spacing
  `0.08em`, `font-weight: 900`, uppercase. Hero h1 has per-character
  animation delays (`style="animation-delay: 200ms"` etc.).
- `<h2>` — section titles. `font-weight: 700`, `letter-spacing: 0.05em`.
- `<h3>` — subsection. `font-weight: 700`, `letter-spacing: 0.03em`.
- `<h4>` — card / small header. `font-weight: 700`.

### Prose classes

- `.prose` — body text. `font-family: var(--font-body)`, `font-size:
  var(--type-base)`, `line-height: 1.75`, `max-width: 72ch`.
- `.prose-lg` — larger body, used for hero subtitle and lead paragraphs.
- `.prose-sm` — smaller body, used for FAQ answers, organizer bios.
- `.pull-quote` — large italic with a cyan left border, used for the
  "Law aspires to reason" / "Sycophancy is the abdication of reason"
  quotes.
- `.eyebrow` — small uppercase label above section titles, in
  `var(--color-cyan)`.

---

## 4. Layout

### Container system (`css/layout.css`)

```css
.container        { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--content-padding); }
.container--narrow { max-width: 800px; }  /* for centered text blocks like the register section */
```

### Section pattern

```html
<section class="section section-name">
  <div class="container">
    <div class="section__header">
      <span class="eyebrow">Eyebrow</span>
      <h2>Title</h2>
    </div>
    <!-- content -->
  </div>
</section>
```

Sections get a vertical padding of `clamp(80px, 12vw, 160px)` so they
breathe on all viewports. The `.section-problem`, `.section-metrics`,
and `.section-timeline` use `--color-abyss` as background to alternate
with `--color-void` sections.

### Grids

| Class | Columns | Use |
|---|---|---|
| `.grid` | auto-fit minmax(280px, 1fr) | generic responsive grid |
| `.grid--2` | `1fr 1fr` (collapses to 1fr < 900px) | hero, two-task landing, two-column info |
| `.grid--3` | `repeat(auto-fit, minmax(260px, 1fr))` | task1 metrics, baselines |
| `.grid--4` | `repeat(auto-fit, minmax(220px, 1fr))` | task2 stat cards |

### Sidebar layout (task pages, organizers page)

```html
<div class="sidebar-layout">
  <aside class="sidebar">…</aside>
  <main class="main-content">…</main>
</div>
```

`.sidebar` is `position: sticky; top: 96px; width: var(--sidebar-width)`.
`.main-content` is `flex: 1; max-width: 900px;`. Collapses to single
column on `< 900px`.

### Hero

The landing-page hero uses a two-column flex layout: logo on the left
(`clamp(120px, 20vw, 220px)`), title on the right (multi-line char
animation). The title has a per-character `clip-path: inset(0 100% 0 0)`
animation triggered by `.hero--animate` added on DOMContentLoaded. A
subtle grain overlay (`url("data:image/svg+xml,…")`) sits behind the
hero at 0.02-0.03 opacity.

### Responsive breakpoints

| Breakpoint | Effect |
|---|---|
| `< 900px` | nav links hide, hamburger shows; sidebar-layout collapses |
| `< 768px` | hero stacks vertically; metric rows stack |
| `< 700px` | loader chat boxes stack vertically |
| `< 600px` | cookie disclosure stacks; metric rows stack |
| `< 480px` | (no special rules; clamps handle it) |

---

## 5. Components

### Cards

```html
<div class="card">
  <span class="card__badge">BADGE</span>
  <h3 class="card__title">Title</h3>
  <p class="card__desc">Description.</p>
  <span class="card__link">Link →</span>
</div>
```

- `.card` — default card with `1px` border, `2px` border-radius,
  32px padding, top accent line that fades in on hover (cyan).
- `.card:hover` — border lights up to `--color-border-lit`, lifts
  -4px, top accent line becomes opaque.
- `.card__badge` — small uppercase label in the top-right corner.
- `.card__title` — uses `--color-heading` (auto-flips with theme).
- `.card__link` — cyan, with a 4px rightward arrow slide on hover.

### Task cards (landing)

Larger variant of `.card` with 3D tilt + light source on mousemove
(via `js/tilt.js`). 8° rotation on X and Y axes. Tilt is disabled
under `prefers-reduced-motion`.

### Organizer cards (landing + organizers page)

```html
<div class="organizer-card">
  <div class="organizer-card__name">Name</div>
  <div class="organizer-card__affiliation">Affiliation</div>
  <a href="mailto:…" class="organizer-card__email">email</a>
  <div class="organizer-card__role">Role</div>
</div>
```

The organizers page uses a richer variant with avatar circles (initials
on a colored background), header, email, role badge, and bio paragraph.

### Badges (`.badge`)

Small pill labels with a colored border + tinted background:

```html
<span class="badge badge--cyan">…</span>
<span class="badge badge--violet">…</span>
<span class="badge badge--amber">…</span>
<span class="badge badge--pink">…</span>
<span class="badge badge--ghost">…</span>
```

### Buttons

```html
<a href="…" class="btn btn-primary">Primary</a>
<a href="…" class="btn btn-outline">Outline</a>
<a href="…" class="btn btn-ghost">Ghost</a>
```

- `.btn-primary` — cyan background, black text, hover lifts and glows.
- `.btn-outline` — transparent with cyan border, hover glows.
- `.btn-ghost` — transparent with subtle border, hover lightens.
- All buttons: 14px padding, `var(--font-display)`, uppercase,
  `letter-spacing: 0.15em`, 2px border-radius. The `.btn__arrow` child
  slides 4px right on parent hover.

### Tables

Wrapped in `.table-wrapper` for horizontal overflow. Headers are
uppercase `.thead th` with `--color-surface-2` background. Rows
alternate background (zebra) and turn cyan-tinted on hover with a
2px left border in cyan.

### Timeline (`.tl`)

A grid-based timeline. Each item is a 5-column grid
`1fr var(--CONN) var(--DOT) var(--CONN) 1fr`. The center column holds
the dot. Odd/even items flip which side the content sits on. A central
`.tl-track::after` line grows from 0% to 100% height as the timeline
enters the viewport. A today-marker is dynamically inserted by
`js/timeline.js`.

### JSON block

```html
<div class="json-block">
  <div class="json-block__header">
    <span class="json-block__label">Label</span>
    <button class="json-block__copy">⧉ Copy</button>
  </div>
  <pre><code class="json" data-typewriter>{ … }</code></pre>
</div>
```

- Always dark in both themes (syntax highlight colors assume dark).
- Copy button (`.json-block__copy`) writes to clipboard via
  `js/copy.js` with a "Copied!" success state and aria-live
  announcement.
- Code inside the block is tokenized by `js/syntax.js` and optionally
  typewriter-animated by `js/typewriter.js` on first scroll-into-view.

### Loader overlay (landing page only)

Full-screen dark/light overlay that shows on first visit. Two side-by-side
chat mockups of the same LLM agreeing with opposite user framings. Cookie-
gated via `fire2026_loader_seen` (1 day TTL). The animation runs every
visit; the cookie just skips the entire overlay after the first time.

### Cookie disclosure (all pages)

Fixed-bottom banner that lists the three functional cookies used
(loader, theme, ack). Dismissable, 180-day ack cookie, accessible
(`role="region"`, focusable button, aria-label).

### 404 page

The `404.html` at the repo root uses the same design system. Big
`404` number in cyan with a glow, a grid pattern faded behind, and
links to all available pages.

---

## 6. Motion

### Easing tokens

```css
--ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-expo:    cubic-bezier(0.7, 0, 0.84, 0);
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);  /* dots pop */
--ease-cinematic:  cubic-bezier(0.77, 0, 0.175, 1);  /* button shine */
```

### Duration tokens

```css
--dur-instant:  80ms;
--dur-fast:     160ms;
--dur-mid:      320ms;
--dur-slow:     600ms;
--dur-cinema:   1200ms;
```

All five go to `0ms` under `@media (prefers-reduced-motion: reduce)`.

### Conventions

- Use `transform` and `opacity` only for animations (no top/left).
- Hover transitions: 160-320ms with `--ease-out-quart` or `--ease-out-expo`.
- Theme change: 300ms ease on `background-color` and `color` (set on
  `html` and `body` in `css/theme.css`).
- Reveal animations: IntersectionObserver adds `.revealed` class,
  CSS handles the transition. Respect `prefers-reduced-motion`.
- Char-by-char hero animation: per-`<span>` `style="animation-delay: Xms"`
  paired with the `.char` keyframe.

---

## 7. JavaScript modules

| File | Purpose |
|---|---|
| `js/theme.js` | Reads/writes `localStorage('fire2026_theme')`, applies `data-theme` attribute, updates toggle button labels and `meta theme-color`. Default = light. |
| `js/loader.js` | First-visit cookie gate, runs the chat animation, sets `fire2026_loader_seen` cookie. **Not deferred** — must run before paint. |
| `js/nav.js` | Sticky nav, scroll progress, mobile menu, aria-current tracking, Escape to close. |
| `js/scroll-reveal.js` | IntersectionObserver with `data-reveal` attribute; supports `data-stagger` and `data-reveal-delay`. |
| `js/tilt.js` | 3D mouse-tilt + light-source for `.task-card`. Disabled under `prefers-reduced-motion`. |
| `js/counter.js` | Eased count-up animation for `[data-count]` elements on first intersection. |
| `js/timeline.js` | Parses dates, dynamically inserts a "today" marker with a countdown like "X days until <event>". |
| `js/scrollspy.js` | Sidebar link `.active` class + counter "1 / 9 sections" as the user scrolls task pages. |
| `js/syntax.js` | Hand-written JSON tokenizer/highlighter (tokens: key, str, num, bool, null, brace, bracket). |
| `js/typewriter.js` | Tokenizes HTML, animates text + tags one at a time. Triggered by IntersectionObserver. |
| `js/copy.js` | Clipboard write for `.json-block__copy` with success state + aria-live announcement. |
| `js/logo.js` | Reusable logo component (used by `pages/loader.html` only — that page is deprecated). |
| `js/transitions.js` | View Transitions API for SPA-feel same-origin navigation. Falls back gracefully. |
| `js/cookie-disclosure.js` | One-time banner listing functional cookies. 180-day ack cookie. |
| `js/pretext-dynamic.js` | ESM module. Dynamically sizes hero title, section headers, pull-quotes, task descriptions, stat numbers, organizer names, badges, buttons using `pretext` text measurement. |
| `js/vendor/pretext.js` | **Vendored copy of @chenglou/pretext v0.0.7** (MIT, by Cheng Lou). Pinned in `utils/pretext` git submodule. |

### Load order rules

1. `<head>` stylesheets: `base` → `type` → `layout` → `components` →
   page-specific (e.g. `task.css`) → `animations` → `theme` →
   feature-specific (e.g. `cookie-disclosure.css`).
2. `<head>` inline FOUC script — must be in `<head>` BEFORE the
   stylesheet links for correct cascade.
3. `<body>` scripts: `loader.js` (index.html only, blocking) → all
   other external scripts `defer`red. ESM modules (`type="module"`)
   are deferred by spec.
4. Inline scripts after the external ones for page-specific logic
   (e.g. hero `requestAnimationFrame`).

---

## 8. Accessibility

- Skip link: not yet implemented (TODO).
- All interactive elements have `aria-label` where the visible text is
  insufficient (mobile toggle, theme toggle, copy button).
- Color contrast: light theme uses `#2c2416` on `#f5f0e8` (12.6:1) for
  body text and `#0a7a9e` cyan on the same background (4.6:1). Dark
  theme uses `#e8e8e8` on `#000000` (18.4:1) and `#00e5ff` cyan (8.6:1).
  All meet WCAG AA.
- `prefers-reduced-motion`: enforced in `js/tilt.js`, `js/counter.js`,
  `js/typewriter.js`, `js/loader.js`, and the motion CSS in `base.css`.
- Focus styles: `:focus-visible` outline 2px cyan with 2px offset.
- `aria-current="page"` is auto-set on the active nav link by `js/nav.js`.
- `aria-live="polite"` on the copy-success announcement.
- The cookie disclosure uses `role="region"` with `aria-label`.

---

## 9. Performance

- **No build step.** Source is served as-is.
- **CSS** loads in cascade order; no `@import` chains.
- **JS** is `defer`-loaded everywhere except `loader.js` (which must
  run before paint on the landing page) and the inline FOUC script
  (which must run before paint on every page).
- **pretext** is vendored at `js/vendor/pretext.js` and preloaded via
  `<link rel="modulepreload">` on every page that uses
  `pretext-dynamic.js`.
- **Logos** are preloaded via `<link rel="preload" as="image">`.
- **Google Fonts** are preconnected.
- **No analytics, no third-party tracking, no service worker.** The
  vendored pretext is the only non-page-source JS dependency.
- **Critical CSS** is not inlined — the CSS is small enough (≈30KB
  total uncompressed) that the browser handles it fine. If the site
  grows, consider inlining the tokens layer + above-the-fold rules.

---

## 10. Upgrading pretext

When you want to update the vendored pretext:

```bash
# 1. Update the submodule
cd utils/pretext
git fetch
git checkout <new-commit-or-tag>
cd ../..

# 2. Inspect the upstream package.json to find the new version
cat utils/pretext/package.json | grep '"version"'

# 3. Download the matching built dist
curl -L "https://cdn.jsdelivr.net/npm/@chenglou/pretext@<version>/dist/layout.js" \
  -o js/vendor/pretext.js

# 4. Update the version comment at the top of the vendored file

# 5. Smoke-test: load any page, confirm hero title auto-sizing still works
#    and the console has no warnings from pretext-dynamic.js
```

---

## 11. File map

```
/                                 # repo root
├── index.html                    # landing page (with loader)
├── 404.html                      # custom 404 in design style
├── LICENSE                       # CC-BY-4.0
├── README.md                     # project README
├── design.md                     # this file
├── CNAME                         # GitHub Pages custom domain (sycolex.com)
├── .nojekyll                     # skip Jekyll processing
├── .gitmodules                   # pins utils/pretext submodule
├── .github/
│   ├── CODEOWNERS                # auto-reviewer rules
│   └── workflows/
│       └── deploy.yml            # main → gh-pages deploy action
├── assets/
│   ├── logo.svg                  # dark-theme logo (cyan + pink)
│   ├── logo-light.svg            # light-theme logo (deeper blue + deeper pink)
│   ├── favicon.svg / .png
│   └── README.md
├── css/
│   ├── base.css                  # tokens, reset, base, @property
│   ├── type.css                  # type scale, prose, .eyebrow, h1–h6
│   ├── layout.css                # .container, .section, .grid
│   ├── components.css            # .nav, .btn, .card, .badge, table, .footer
│   ├── landing.css               # hero, sections, timeline, organizers
│   ├── task.css                  # task-page sidebar, JSON block, organizer cards
│   ├── loader.css                # session-cookie loader overlay
│   ├── logo.css                  # (legacy, kept for the deprecated loader page)
│   ├── syntax.css                # JSON token colors
│   ├── animations.css            # @keyframes library
│   ├── theme.css                 # theme overrides (light-default rules)
│   ├── cookie-disclosure.css     # cookie banner styles
│   └── styles.css                # (legacy, dev scratch — not used in production)
├── js/
│   ├── theme.js                  # light/dark toggle
│   ├── loader.js                 # cookie-gated loader (landing only)
│   ├── nav.js                    # sticky nav, mobile menu, scroll progress
│   ├── scroll-reveal.js          # IntersectionObserver reveals
│   ├── tilt.js                   # 3D card tilt (task cards on landing)
│   ├── counter.js                # count-up animation
│   ├── timeline.js               # dynamic today-marker + countdown
│   ├── scrollspy.js              # task page sidebar active link
│   ├── syntax.js                 # JSON tokenizer/highlighter
│   ├── typewriter.js             # JSON block typewriter
│   ├── copy.js                   # clipboard copy
│   ├── logo.js                   # (legacy — used by removed pages/loader.html)
│   ├── transitions.js            # View Transitions API
│   ├── cookie-disclosure.js      # functional-cookie banner
│   ├── pretext-dynamic.js         # ESM; uses pretext for auto-sizing
│   └── vendor/
│       └── pretext.js            # vendored @chenglou/pretext v0.0.7 (MIT)
├── pages/
│   ├── README.md                 # how to add a new page
│   ├── task1.html                # Task 1 spec (9 sections, sidebar layout)
│   ├── task2.html                # Task 2 spec (10 sections + interactive demo)
│   ├── faq.html                  # FAQ accordion
│   ├── organizers.html           # organizer bios + prior experience
│   └── registration.html         # registration CTA
├── docs/
│   └── README.md                 # (placeholder)
└── utils/
    └── pretext/                  # git submodule: chenglou/pretext (source of truth)
```

---

## 12. Conventions for new pages

1. Copy the `<head>` from `pages/task1.html` — it has the canonical
   ordering, the FOUC script, the logo preload, and the modulepreload
   for pretext. Adjust the title, theme-color (always `#f5f0e8` since
   light is default), and favicon paths (`../assets/…`).
2. Use the design tokens, not raw colors. If you need a new color,
   add a token to `:root` in `base.css` first.
3. For multi-section pages, use the `.sidebar-layout` shell with a
   `.sidebar` (sticky nav) and `.main-content`. Wire up
   `js/scrollspy.js` and `js/scroll-reveal.js`.
4. Test light AND dark before merging. Toggle between them at every
   breakpoint.
5. Respect `prefers-reduced-motion` in any new animation.
6. Verify the cookie disclosure shows on first visit (clear the
   `fire2026_cookie_ack` cookie to test).
