# DESIGN.md — Impeccable Design System for Industrias Kisser

## Visual World & Thesis
- **World:** Industrial Argentine Agricultural Metalworking (*Taller Metalúrgico Entrerriano*).
- **Surface Modes:**
  - **Persuade** on the Hero, Real Factory Showcase (`@industriaskisser`), and Heritage sections.
  - **Operate** on the 3D Color Configurator Studio & Meshy.ai `.GLB` Workbench.
- **Theme Polarity:** Daylight Industrial Stone & Forged Charcoal — anchored directly in the official `@industriaskisser` emblem (hexagonal gunmetal badge with 12-tooth gear and warm ivory plate) and the real factory environment in Hasenkamp (exposed brick, green corrugated sheet metal roof, yellow `/// Kisser` bridge crane, and high-gloss machinery enamel).

## Color Tokens (Derived from `@industriaskisser`)
- **Surfaces:**
  - `--bg-canvas`: `#F3F1EA` (Warm Alabaster / Parchment Stone from the Kisser emblem plate)
  - `--bg-surface`: `#E7E4DA` (Architectural Concrete / Hasenkamp Workshop Floor)
  - `--bg-stage`: `#191B1A` (Deep Forged Carbon for the 3D inspection viewport and footer anchor)
- **Ink & Typography:**
  - `--ink-primary`: `#181A18` (Anthracite Iron — ≥13.5:1 contrast on canvas)
  - `--ink-secondary`: `#454843` (Tempered Gunmetal — ≥7.2:1 contrast on canvas)
  - `--ink-muted`: `#636760` (Weathered Steel — ≥4.8:1 contrast on canvas)
- **Brand & Machinery Enamel Accents:**
  - `--kisser-green`: `#146B38` (Official Kisser Factory Roof & Rome Plow / Cattle Trailer Green)
  - `--kisser-red`: `#9E1B22` (Official Kisser Cattle Trailer & Truck Bed Crimson Red)
  - `--kisser-graphite`: `#373B40` (Official Kisser Front Loader Anthracite)
  - `--kisser-yellow`: `#D99B10` (Official `/// Kisser` Bridge Crane & Agricultural Rim Yellow)

## Typography (`pbakaus/impeccable` Compliant)
- **Display Face (`--font-display`):** `Barlow Condensed` (700/800) — Industrial chassis stencil proportion matching the physical `KISSER` and `INDUSTRIA ARGENTINA` lettering on the machinery. Tracking `-0.02em` to `-0.03em`, max size `4.5rem`.
- **Body Face (`--font-sans`):** `Plus Jakarta Sans` (400/500/600/700) — High-legibility humanist sans. Measure strictly constrained to `60ch–72ch`.
- **Technical / Data Face (`--font-mono`):** `JetBrains Mono` (500) with `font-variant-numeric: tabular-nums` — Used exclusively for dimensions, weights, capacities, RAL/HEX codes, and telephone numbers.

## Impeccable Craft Floor Rules Enforced Across All Views
1. **No Eyebrows / Kickers above headings** (`skill-ban-eyebrow-on-every-section`): Headings speak directly without small uppercase badge labels above them.
2. **No Gradient Text** (`skill-ban-gradient-text`): Emphasis is achieved via scale, weight, and solid enamel color contrast.
3. **No Nested Cards or Ghost Cards** (`skill-layout-cards-lazy`, `skill-ban-codex-ghost-card`): Elevation is declared once (1px structural border, never border + wide drop shadow). Radii stay crisp (`8px` to `12px`), never over-rounded `24px+` blobs.
4. **No Decorative Grid Overlays or Glow Halos** (`skill-ban-codex-grid-backgrounds`, `skill-color-no-glow-halo`): Surfaces are solid architectural tones with crisp structural Hairline rules (`1px solid #D2CEC2`).
5. **No Modals by Reflex** (`skill-reflex-modal-by-reflex`): The Meshy.ai `.GLB` loader and instructions live inline inside the studio workbench drawer.
6. **Browser Surfaces Themed** (`skill-craft-browser-surfaces`): Custom selection, scrollbar, caret, focus ring (`2px solid #146B38`), and `tabular-nums`.

