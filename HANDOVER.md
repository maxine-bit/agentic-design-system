# Agentic Design System — Handover Doc

## Context for Claude Code

You're picking up a project mid-build. Read this end-to-end before suggesting or writing anything. The user has done the strategic thinking; your job is to execute the build plan in the order specified, with the constraints listed.

**Workflow rule (important):** Always output a brief outline and flag any questions BEFORE writing any code or files. If direction is unclear on any detail, ask first — do not assume and generate. See `/Users/pangaea/Desktop/Workflow orchestration for planning and coworing.rtf` for full collaboration rules.

---

## Project goal

Build an **agentic design system** end-to-end. Two intertwined motivations:

1. **Personal fluency** — the user wants to experience every joint of a modern, machine-readable design system, because their enterprise SaaS client may ask them to build this for real next.
2. **Portfolio case study** — the work becomes a "rebuilt our system on Chakra v3 with agentic principles" narrative, demonstrating:
   - Capability #2: AI-assisted authoring (agent reads the system and generates UI)
   - Capability #5: Self-auditing (agent detects drift between Figma and code)

The user is the original main contributor of the client's existing Chakra UI v3-based design system. The legacy system has Figma docs + Storybook (with drift between the two) but is not machine-readable. They have view-only access to the legacy Figma. We are **not** rebuilding the legacy system — we are building a fresh, open-source-based foundation.

---

## Constraints (non-negotiable)

- **Open source / free only.** No paid tools (specifically: no Token Studio paid tier).
- **Minimal resource and token usage.** Lean by default. Cut polish, not learning.
- **No skipping the hard parts** — Figma sync, drift detection, theme handling are all required.
- **Build now for capability B (code-side agent), but stay C-ready** — tokens + component metadata must be consumable by a future Figma-plugin agent without rework.

---

## Architectural decisions

### Foundation
- **Hybrid base:** Chakra UI v3 structure + Carbon/Spectrum-style token rigor for machine-readability.
- **Naming convention:** Mirror Chakra UI v3 token naming and props as closely as possible throughout.
- **Source of truth:** code-first. Canonical artifact is `tokens/` in W3C Design Tokens format. Figma is a *view*, not the source.
- **Build tool:** Style Dictionary v4 (Node.js, free). Run via `node scripts/build.js` — NOT the SD CLI (SD CLI does not support array config exports).
- **Outputs:** CSS variables + JS/TS module per theme. No iOS/Android.
- **Figma sync:** native Figma Variables, populated via a custom Node script using the Figma REST API. One-way: JSON → Figma.
- **Consumer:** a single plain `index.html` — no React.

### Token architecture (three layers + theme dimension)
```
Primitive (theme-agnostic):  color.blue.500 = #3b82f6
Semantic  (theme-aware):     color.fg.brand = {color.blue.600}
Component (semantic only):   button.bg.primary = {color.fg.brand}
```
- **Strict rule:** components never reference primitives directly. Only semantic tokens.
- **Strict rule:** only the semantic layer is theme-aware.

### Token naming
All primitive token names mirror Chakra UI v3 exactly. Key conventions:
- Font weights: `thin / extralight / light / normal / medium / semibold / bold / extrabold / black`
- Line heights: `shorter / short / moderate / tall / taller`
- Letter spacing: `tighter / tight / wide / wider / widest`
- Radius: `none / 2xs / xs / sm / md / lg / xl / 2xl / 3xl / 4xl / full`
- Durations: `fastest / faster / fast / moderate / slow / slower / slowest`
- Font families: `heading / body / mono` (not `sans`)
- Colors: use Chakra's `orange` (not `amber`) for warning palette

### Theming
- 3 themes: **green, blue, purple**. Light mode only. No dark mode.
- All themes share typography, spacing, radius, shadows — only colour swaps.
- In JSON: separate theme files at the semantic layer (`tokens/semantic/themes/`).
- In Figma: implemented as modes on a colour collection.

### Component metadata
- Every component has a companion **MDX file** in `components/`.
- Frontmatter fields: `name`, `description`, `props`, `variants`, `slots`, `do`, `dont`, `agent_hints`.
- This is the canonical doc. Figma component descriptions mirror it but are downstream.

### Component scope
- **Primitives:** Button, Icon, Text Input, Single Select, Multi Select, Range Select
- **Composed:** Modal, Toast (inline + notification variants)
- **Pattern:** Form (proof-of-agent target)
- Not building: Table, anything else not listed.

---

## Environment

- **Repo:** `/Users/pangaea/agentic-design-system`
- **GitHub:** `https://github.com/maxine-bit/agentic-design-system` (public)
- **Node:** v20.20.2 / npm 10.8.2
- **Figma:** User needs to generate a personal access token at figma.com/settings → "Personal access tokens" before Phase 2. Fresh Figma file will be the target (separate from view-only legacy file).

---

## Build plan

### Phase 0 — Repo scaffolding ✅ COMPLETE
Folder structure, package.json, Style Dictionary v4, build script wired for three themes. `npm run build` runs cleanly.

### Phase 1 — Token architecture ✅ COMPLETE (pending token value update)
Three-layer W3C token structure in place. `npm run build` produces `dist/{green,blue,purple}/tokens.css` + `tokens.js`. All cross-layer references resolve correctly.

**⚠ IN PROGRESS AT SESSION END:** Token primitive VALUES and NAMES need updating to match Chakra UI v3 exactly. Files to update:
1. `tokens/primitives/color.json` — replace all hex values with Chakra v3 values; add `950` step; rename `amber` → `orange`
2. `tokens/primitives/typography.json` — update font stacks; rename weight/lineHeight/letterSpacing keys to Chakra names; add `2xs` font size; rename `font.family.sans` → `font.family.body` + add `font.family.heading`
3. `tokens/primitives/radius.json` — update to Chakra's full scale (`2xs` through `4xl`)
4. `tokens/primitives/motion.json` — rename duration keys to `fastest/faster/fast/moderate/slow/slower/slowest`; update easing cubic-bezier values to Chakra's exact values; add `ease-in-smooth`
5. `tokens/semantic/base.json` — update references: `{font.family.sans}` → `{font.family.body}`, `{font.weight.regular}` → `{font.weight.normal}`, `{font.lineHeight.normal}` → `{font.lineHeight.moderate}`, `{font.lineHeight.snug}` → `{font.lineHeight.short}`, `{color.amber.500}` → `{color.orange.500}`, `{color.amber.50}` → `{color.orange.50}`, `{motion.duration.base}` → `{motion.duration.moderate}`

All Chakra v3 source values have already been fetched and verified. **Do not re-fetch — write the files directly.**

Checkpoint for Phase 1: `npm run build` produces inspectable CSS/JS with Chakra-accurate values.

### Phase 2 — Figma sync (one-way: JSON → Figma)
Node script using Figma REST API to push tokens into Figma variables. User needs personal access token + fresh Figma file ID first.

### Phase 3 — Component metadata schema + Button
Define MDX schema. Write Button MDX. Build Button in Figma using tokens only. Implement Button in HTML/CSS.

### Phase 7 — Agent integration (moved up — run after Phase 3)
Generate agent context bundle. Use real agent feedback to validate the MDX schema before applying it to all components.

### Phase 4 — Remaining components
Icon, Text Input, Single Select, Multi Select, Range Select, Modal, Toast.

### Phase 5 — Form pattern
### Phase 6 — Drift-check script
### Phase 8 — Live demo + case study

---

## Chakra UI v3 source values (fetched — use these directly)

### Colors (all verified from chakra-ui/chakra-ui main)
black: #09090B | white: #FFFFFF

gray: 50=#fafafa 100=#f4f4f5 200=#e4e4e7 300=#d4d4d8 400=#a1a1aa 500=#71717a 600=#52525b 700=#3f3f46 800=#27272a 900=#18181b 950=#111111

red: 50=#fef2f2 100=#fee2e2 200=#fecaca 300=#fca5a5 400=#f87171 500=#ef4444 600=#dc2626 700=#991919 800=#511111 900=#300c0c 950=#1f0808

orange: 50=#fff7ed 100=#ffedd5 200=#fed7aa 300=#fdba74 400=#fb923c 500=#f97316 600=#ea580c 700=#92310a 800=#6c2710 900=#3b1106 950=#220a04

yellow: 50=#fefce8 100=#fef9c3 200=#fef08a 300=#fde047 400=#facc15 500=#eab308 600=#ca8a04 700=#845209 800=#713f12 900=#422006 950=#281304

green: 50=#f0fdf4 100=#dcfce7 200=#bbf7d0 300=#86efac 400=#4ade80 500=#22c55e 600=#16a34a 700=#116932 800=#124a28 900=#042713 950=#03190c

teal: 50=#f0fdfa 100=#ccfbf1 200=#99f6e4 300=#5eead4 400=#2dd4bf 500=#14b8a6 600=#0d9488 700=#0c5d56 800=#114240 900=#032726 950=#021716

blue: 50=#eff6ff 100=#dbeafe 200=#bfdbfe 300=#a3cfff 400=#60a5fa 500=#3b82f6 600=#2563eb 700=#173da6 800=#1a3478 900=#14204a 950=#0c142e

cyan: 50=#ecfeff 100=#cffafe 200=#a5f3fc 300=#67e8f9 400=#22d3ee 500=#06b6d4 600=#0891b2 700=#0c5c72 800=#134152 900=#072a38 950=#051b24

purple: 50=#faf5ff 100=#f3e8ff 200=#e9d5ff 300=#d8b4fe 400=#c084fc 500=#a855f7 600=#9333ea 700=#641ba3 800=#4a1772 900=#2f0553 950=#1a032e

pink: 50=#fdf2f8 100=#fce7f3 200=#fbcfe8 300=#f9a8d4 400=#f472b6 500=#ec4899 600=#db2777 700=#a41752 800=#6d0e34 900=#45061f 950=#2c0514

### Typography
Font families:
- heading: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`
- body: same as heading
- mono: `SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

Font sizes: 2xs=0.625rem xs=0.75rem sm=0.875rem md=1rem lg=1.125rem xl=1.25rem 2xl=1.5rem 3xl=1.875rem 4xl=2.25rem 5xl=3rem 6xl=3.75rem

Font weights: thin=100 extralight=200 light=300 normal=400 medium=500 semibold=600 bold=700 extrabold=800 black=900

Line heights: shorter=1.25 short=1.375 moderate=1.5 tall=1.625 taller=2

Letter spacings: tighter=-0.05em tight=-0.025em wide=0.025em wider=0.05em widest=0.1em

### Radius
none=0 2xs=0.0625rem xs=0.125rem sm=0.25rem md=0.375rem lg=0.5rem xl=0.75rem 2xl=1rem 3xl=1.5rem 4xl=2rem full=9999px

### Borders
xs=0.5px solid  sm=1px solid  md=2px solid  lg=4px solid  xl=8px solid

### Durations
fastest=50ms faster=100ms fast=150ms moderate=200ms slow=300ms slower=400ms slowest=500ms

### Easings
ease-in: cubic-bezier(0.42, 0, 1, 1)
ease-out: cubic-bezier(0, 0, 0.58, 1)
ease-in-out: cubic-bezier(0.42, 0, 0.58, 1)
ease-in-smooth: cubic-bezier(0.32, 0.72, 0, 1)

---

## Working principles

- **Outline first, ask before assuming.** Output a brief plan and flag any questions before writing any files.
- **Lean by default.** Don't add tokens, components, or features beyond what's listed.
- **Explain, don't just do.** The user's primary goal is fluency — briefly explain decisions so they learn the framework.
- **One phase at a time.** Confirm checkpoint before moving on.
- **C-readiness check.** Before finalising any structure, ask: "could a Figma plugin consume this exact input later?"
