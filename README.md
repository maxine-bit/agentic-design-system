# Agentic Design System

A machine-readable design system demonstrating AI-assisted UI authoring and automated drift detection between code and Figma.

Built with Chakra UI v3 conventions, W3C Design Tokens format, and Style Dictionary.

## Architecture

```
Primitive tokens  →  Semantic tokens  →  Component tokens
     (theme-agnostic)      (theme-aware)        (semantic refs only)
```

Three colour themes (green, blue, purple). Light mode only. No dark mode.

## Structure

```
tokens/
  primitives/     # colour.blue.500, etc — theme-agnostic
  semantic/       # colour.fg.brand per theme — theme-aware
  component/      # button.bg.primary — semantic refs only
components/       # MDX docs: name, props, variants, agent_hints
scripts/
  sync-figma.js   # push tokens → Figma variables via REST API
  drift-check.js  # diff Figma variables ↔ tokens.json, report mismatches
demo/
  index.html      # visual showcase + agent-generated layout demo
dist/             # generated CSS/JS (gitignored)
```

## Quick start

```bash
npm install
npm run build        # generate CSS/JS from tokens
npm run sync:figma   # push tokens to Figma (requires .env with FIGMA_TOKEN + FIGMA_FILE_ID)
npm run audit:drift  # check for Figma ↔ code drift
```

## Capabilities

- **Capability B — AI authoring:** paste the agent context bundle (`dist/agent-context.json`) into Claude or Cursor and prompt it to generate UI using system components.
- **Capability 5 — Drift detection:** `npm run audit:drift` pulls live Figma variables and diffs them against `tokens.json`.

## Phases

- [x] Phase 0 — Repo scaffolding
- [ ] Phase 1 — Token architecture
- [ ] Phase 2 — Figma sync
- [ ] Phase 3 — Button (first component) + MDX schema
- [ ] Phase 7 — Agent integration (moved up for schema feedback)
- [ ] Phase 4 — Remaining components
- [ ] Phase 5 — Form pattern
- [ ] Phase 6 — Drift-check script
- [ ] Phase 8 — Live demo + case study
