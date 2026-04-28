# Skills Guide for the Agentic Design System Project

A practical guide to writing Claude Code skills, plus a concrete plan of which skills to build for this project and why.

---

## Part 1 — What skills are, and why they fit this project perfectly

### The mental model

A **skill** is a folder. Inside is a `SKILL.md` file with two parts:
- **YAML frontmatter** — a name and a description Claude reads at session start to decide *when* to load this skill
- **Markdown body** — the actual instructions Claude follows once the skill is loaded

Optionally, the folder can also contain `scripts/` (executable code), `references/` (deep documentation that loads on demand), and `assets/` (templates, examples, files used in output).

### Why skills, not just CLAUDE.md or prompts

There are four ways to give Claude Code persistent context, and they're not interchangeable:

| Mechanism | When it loads | Best for |
|-----------|--------------|----------|
| **CLAUDE.md** | Every session, always | Always-true facts: "this project uses Style Dictionary," "tokens live in `/tokens`" |
| **Skills** | Only when triggered | Specialised workflows: "how to add a new component," "how to audit drift" |
| **Slash commands** | When you type `/name` | User-invoked actions: `/sync-figma`, `/audit` |
| **MCP servers** | Always available as tools | External data and side-effects: Figma API, GitHub |

The key insight from the docs: **each skill costs ~100 tokens at session start** (just the name and description) and only loads its full body — and any referenced files — when Claude decides it's relevant. This is called *progressive disclosure*. You can install many skills without context bloat, because most stay dormant until needed.

### Why this matters for your project

This project is unusually well-suited to skills because:

1. **The work is highly repetitive.** "Add a new component" follows the same multi-step process every time: write MDX → add component tokens → build in Figma → implement in HTML → update the consumer page. A skill encodes that procedure once.
2. **Conventions are strict.** Three-layer token architecture, semantic-only theming, MDX schema, no primitive references in components. Skills make these rules enforceable rather than aspirational.
3. **The case study itself benefits.** The skills you write *are* part of your portfolio — they're concrete artefacts that show how you'd operationalise an agentic design system. Other teams can install them.
4. **Token efficiency.** Without skills, you'll re-explain the architecture every session. With them, you say "add a new Toast variant" and Claude already knows the seven-step process, the file paths, and the conventions.

---

## Part 2 — How to write a good skill

### The minimum viable skill

```markdown
---
name: skill-name-in-kebab-case
description: One sentence describing what it does. Use when [trigger condition]. Make this pushy if Claude under-triggers it.
---

# Skill Name

Short overview of what this skill does.

## When to use

Specific triggers: "when the user asks to add a component," "when modifying tokens," etc.

## Procedure

1. Step one with exact file paths and conventions
2. Step two
3. Step three

## Conventions to follow

- Bullet list of strict rules
- Things Claude should never do

## References

- See `references/schema.md` for the full MDX schema
- See `scripts/add_component.js` for the helper script
```

### Five rules that separate good skills from useless ones

**1. The description field is everything.** It's the only thing Claude sees at session start when deciding whether to load the skill. Vague descriptions cause the skill to go untriggered. Be explicit and slightly "pushy" — Anthropic's own skill-creator docs note that Claude tends to *under-trigger* skills, so descriptions like "Use this skill whenever the user mentions tokens, theming, or adding/editing colour values" work better than "Helps with tokens."

**2. Keep the body lean — 1,500-2,000 words is the target.** Once a skill loads, every token in it competes with conversation context. Put detailed reference material in `references/` files that Claude can read only when needed. SKILL.md is a table of contents pointing to specifics, not the whole encyclopaedia.

**3. Write standing instructions, not one-time steps.** The skill body loads once and stays in context. Don't write "first do X, then later when you do Y..." — write rules that apply throughout the task.

**4. Tell Claude what to do *and* what not to do.** "Components must reference semantic tokens only — never primitive tokens directly" is far more useful than just "use semantic tokens."

**5. Use scripts for deterministic work.** If a step requires generating a JSON file with a specific shape, or transforming Figma API output, write a script. Scripts are token-efficient (Claude can run them without reading them in full) and reliable (no chance of the model mis-typing a key).

### Where skills live (Claude Code)

Two scopes matter for you:

- **Personal skills** — `~/.claude/skills/<skill-name>/SKILL.md` — available across all your projects. Use this for skills that aren't tied to this specific design system (e.g. a generic "review my MDX frontmatter" skill).
- **Project skills** — `.claude/skills/<skill-name>/SKILL.md` inside the repo — checked in with the project, shared with collaborators, version-controlled. Use this for skills specific to this design system.

**For this project, almost everything should be project skills**, in the repo. That makes them:
- Part of the deliverable (visible on GitHub, part of the case study)
- Versioned alongside the code they describe
- Reusable by anyone who clones the repo

---

## Part 3 — The skill plan for this project

I've designed this set to map directly onto the build phases in the handover doc. Each skill has a clear job, a triggering condition, and a place in the workflow. The total set is intentionally small — start with these, add more only when you notice yourself re-explaining the same thing twice.

### Tier 1 — Build these in Phase 0 or early Phase 1

These set up the rules of the system. Claude Code needs them before doing meaningful work.

**1. `design-system-conventions`** *(the constitution)*
The non-negotiable rules of the system. Three-layer token model. Semantic-only theming. MDX schema. File paths. Naming conventions. C-readiness check. Loaded whenever Claude touches anything in the repo.
*Description should trigger on:* tokens, components, MDX, naming, file structure, conventions.

**2. `tokens-architecture`** *(the token rulebook)*
Specifically about the W3C Design Tokens format, the three-layer structure, how Style Dictionary is configured, how themes work, and how to add or modify tokens correctly. Includes the strict rules ("components reference semantic tokens only").
*Description should trigger on:* tokens, colour, typography, spacing, theming, Style Dictionary, adding/editing tokens.

### Tier 2 — Build these in Phase 3 (when you start making components)

**3. `add-component`** *(the workhorse — you'll use this most)*
The full procedure for adding a new component: write MDX from the schema → add component tokens to `tokens.json` → run build → create Figma component → implement in HTML → add to consumer page → verify. References the MDX schema. Bundles a template MDX file.
*Description should trigger on:* "add a component," "create a new component," "implement [Button/Toast/Modal/etc.]."

**4. `mdx-component-spec`** *(the schema enforcer)*
The canonical MDX frontmatter schema and body structure. What every component doc must contain (name, description, props, variants, slots, do, dont, agent_hints). Examples of good entries. Most importantly: how to write `agent_hints` so the code-side agent (and future Figma-plugin agent) generates correct output.
*Description should trigger on:* MDX, component documentation, component spec, agent hints, frontmatter.

### Tier 3 — Build these in Phases 6 and 7 (the agentic capabilities)

**5. `figma-sync`** *(the JSON → Figma pipe)*
How the sync script works, how to run it, how to authenticate, how to debug common failures (token format mismatches, mode collisions, missing collections). References the Figma REST API docs.
*Description should trigger on:* Figma sync, push to Figma, update Figma variables, Figma API.

**6. `drift-audit`** *(capability #5 — the self-auditing demo)*
How to run the drift-check script, how to interpret its output, how to introduce a deliberate drift for testing, what categories of drift matter (value drift, structural drift, naming drift, rule violations like primitive references).
*Description should trigger on:* drift, audit, check Figma against tokens, validate, consistency.

**7. `agent-context-bundle`** *(capability #2 — the authoring demo)*
How to generate the agent context bundle (the markdown file the user pastes into Claude/Cursor to give it the full system context), what it should contain, how to keep it in sync with the source files, what prompt patterns work for asking the agent to compose new layouts.
*Description should trigger on:* agent context, generate bundle, prompt the agent, AI authoring.

### Tier 4 — Optional, build only if useful

**8. `case-study-writer`** *(portfolio support)*
A skill for drafting case study sections — problem statement, architecture decisions, decision rationale, framework summary, what's next. Useful in Phase 8.

**9. `theme-add`** *(if 3 themes turn into more)*
Procedure for adding a new theme without breaking existing ones. Probably overkill for the case study with only 3 themes, but worth having if the client uses this for real.

---

## Part 4 — Suggested sequencing

Here's how I'd actually write these in your build:

1. **At the very start of Phase 0**, write `design-system-conventions` — even a rough first pass. It establishes the rules everything else follows.
2. **During Phase 1**, write `tokens-architecture` as you design the token structure. The skill and the actual tokens evolve together.
3. **At the start of Phase 3**, write `mdx-component-spec` and `add-component` together. You'll iterate on the MDX schema in real time as you build the Button — that's the right time to encode the schema in a skill.
4. **During Phase 2**, write `figma-sync` after you've got the script working. Encoding it after-the-fact (rather than beforehand) means the skill describes what actually works, not what you hoped would work.
5. **In Phases 6 and 7**, write `drift-audit` and `agent-context-bundle` as the corresponding scripts come together.
6. **Phase 8**, optionally write `case-study-writer`.

This way, you're never writing skills speculatively — every skill describes a real procedure you've already done at least once.

---

## Part 5 — A worked example

Here's what `design-system-conventions` might look like, to give you a concrete template:

```markdown
---
name: design-system-conventions
description: The non-negotiable rules of this design system — token architecture, file structure, naming, theming, and C-readiness requirements. Use this skill whenever working with tokens, components, MDX docs, or any file in /tokens, /components, or /scripts. Use it BEFORE making structural changes.
---

# Design System Conventions

This skill loads the foundational rules of the system. Follow them strictly. If a request would violate one of these rules, raise the conflict before proceeding.

## Repo structure

```
/tokens/
  primitive.json     # theme-agnostic atoms
  semantic.json      # references primitives, theme-aware
  themes/
    green.json       # semantic overrides for green theme
    blue.json
    purple.json
  components/        # component-layer tokens, one file per component
/components/         # MDX docs, one folder per component
/scripts/            # sync, drift-check, agent-bundle scripts
/demo/               # the consumer HTML page
/build/              # generated outputs (gitignored except for demo's CSS)
```

## Token architecture (three layers)

Primitive → Semantic → Component. Strictly enforced.

- **Primitive tokens** are theme-agnostic. They define the full palette and scales.
- **Semantic tokens** reference primitives. They are the only theme-aware layer.
- **Component tokens** reference semantic tokens only. NEVER primitives.

If you find yourself writing `button.bg.primary = {color.blue.500}`, stop. It must be `button.bg.primary = {color.fg.brand}`.

## Theming

Three themes: green, blue, purple. Light mode only. Themes differ in colour only — typography, spacing, radius, shadows, and components are identical across themes.

Implementation: each theme file under `/tokens/themes/` overrides only semantic colour tokens. Style Dictionary builds one CSS file per theme (`build/css/theme-green.css` etc.).

## C-readiness check

Before finalising any structural change, ask: "could a Figma plugin (capability C) consume this exact input later?" If the answer is no, flag it. Examples:
- Tokens must be valid W3C Design Tokens format (Figma plugins parse this)
- MDX frontmatter must be parseable YAML, not free-form prose
- Component metadata must be accessible without reading the body of MDX files

## Naming conventions

- Token paths: `category.subcategory.variant` (e.g. `color.fg.brand`, `space.inset.md`)
- Component MDX folders and Figma component names: PascalCase (`Button`, `TextInput`)
- Component variant names in MDX: kebab-case (`primary`, `ghost`, `danger-outline`)

## What this skill does NOT cover

- How to add a new component → use `add-component` skill
- The MDX frontmatter schema → use `mdx-component-spec` skill
- How tokens build via Style Dictionary → use `tokens-architecture` skill

## References

- `references/token-schema.md` — full W3C Design Tokens shape used here
- `references/c-readiness-checklist.md` — detailed checklist
```

This is roughly 400 words in the body — comfortably under the 1,500–2,000 budget — and it punts detail to references for things Claude only needs sometimes.

---

## Part 6 — Practical tips

- **Don't write skills speculatively.** If you haven't done a thing at least once, you don't know enough about it to write a good skill. Do the work, then encode the procedure.
- **Be willing to delete.** If a skill isn't getting triggered when it should, the description is wrong — fix it. If a skill stops being useful, delete it.
- **Test by starting a fresh Claude Code session** and asking the kind of question the skill should respond to. If the skill doesn't load, it's not discoverable enough.
- **Keep the description "pushy" but specific.** Generic-pushy ("always use this skill for design tasks") triggers too often. Specific-pushy ("Use this skill whenever the user mentions tokens, themes, or adds/edits a colour value, even if they don't say 'design system'") triggers correctly.
- **Skills are part of your case study.** Push them to GitHub. Reference them in the writeup. They show that you understand how to operationalise an agentic system, not just describe one.

---

## TL;DR

Build seven skills, in this order:
1. `design-system-conventions` (Phase 0)
2. `tokens-architecture` (Phase 1)
3. `mdx-component-spec` + `add-component` (Phase 3)
4. `figma-sync` (after Phase 2 works)
5. `drift-audit` (Phase 6)
6. `agent-context-bundle` (Phase 7)

Keep each one under 2,000 words in the body. Use references and scripts for detail. Make descriptions specific and slightly pushy. Write skills *after* you've done the procedure once, not before. Keep them in `.claude/skills/` in the repo so they're versioned and shareable.
