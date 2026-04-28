# CLAUDE.md — Agentic Design System

## Start here

Read these two docs before doing anything:

- **[HANDOVER.md](./HANDOVER.md)** — project goal, constraints, architectural decisions, build plan, and Chakra v3 source values. The authoritative reference for this project.
- **[SKILLS-GUIDE.md](./SKILLS-GUIDE.md)** — what skills are, which ones to build for this project, when to build them, and how to write them well.

---

## Workflow rules

### Plan before outputs
- Output a brief outline before getting into any details; flag concerns or missing information; ask clarification questions.
- If direction or any detail is unclear, ask first — don't make assumptions and generate output straight away.

### Handle token limits proactively
- For longer tasks, break work into phases (e.g. structure first, then content, then details).
- Summarise at the end of each phase and state the next step.
- Never try to complete an entire task in a single output.

### Collaboration model
- Challenge or push back whenever something seems wrong — don't just do whatever is asked.

---

## Current phase

**Phase 1 — Token architecture: in progress**

Repo scaffold (Phase 0) is complete. Token architecture structure is complete and `npm run build` produces `dist/{green,blue,purple}/tokens.css` + `tokens.js`. Remaining work: update primitive values and names to match Chakra UI v3 exactly. See the ⚠ section in HANDOVER.md for the exact list of files and changes.

---

## Repo structure

```
tokens/
  primitives/     # theme-agnostic atoms (color, typography, radius, motion, spacing, border, shadow)
  semantic/       # theme-aware references to primitives; themes/ subdirectory per theme
  component/      # per-component tokens; references semantic layer only — never primitives
components/       # MDX docs: name, props, variants, slots, do, dont, agent_hints
scripts/          # sync-figma.js, drift-check.js, build.js
demo/             # index.html — the single consumer page
dist/             # generated CSS/JS (gitignored)
.claude/skills/   # project-scoped Claude Code skills (to be created)
```

---

## Skills plan

See SKILLS-GUIDE.md Part 3 for the full plan. Summary:

| Skill | Build when | Status |
|-------|-----------|--------|
| `design-system-conventions` | Phase 0 / early Phase 1 | not started |
| `tokens-architecture` | Phase 1 | not started |
| `mdx-component-spec` | Phase 3 | not started |
| `add-component` | Phase 3 | not started |
| `figma-sync` | After Phase 2 works | not started |
| `drift-audit` | Phase 6 | not started |
| `agent-context-bundle` | Phase 7 | not started |
