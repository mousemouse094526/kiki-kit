# Template: spec.md

The what and how. Copy the skeleton under **Template**; follow **Rules**.
The `##` headings stay in English; everything else is in the docs language.
Drop a section only when it would be empty.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **Cite, don't retell.** A decision appears as `(D3)`; its reasoning lives
  in decisions.md.
- **Tables for contracts** — routes, error codes, endpoints and their
  actions, settings. **Numbered lists for ordered steps** — checks in
  order, transaction steps.
- **Implementation is split by `###` area** (modules touched, data, each
  API group, client, ops), one area per heading.
- **Name modules and packages, not files.** `apps/api`, `packages/db`, or a
  feature folder are fine; file paths and code snippets go stale fast.
  Exception: a snippet that IS the decision — a state machine, a schema.
- **Seams are numbered**, one seam per number, each with observable
  pass/fail bullets. warroom-tickets and the build read this section.
- **Pick seams on purpose**, in this order:
  1. Reuse a seam that already exists — two contracts for one thing drift.
  2. Take the **highest** one that works — everything below stays free to
     change, and tests survive refactors.
  3. **Fewer is better**; one is the target — each seam is a contract kept
     forever.

  The chosen set is a `D{n}` with its reason, cited above the list.
- **Tag a seam `(e2e)`** when its behaviour can only be observed through
  the UI — a user flow across pages, or across apps (one user acts in one
  app, another sees it in another). Those are proven with the project's
  e2e tool; every other seam is proven below the UI.
- **Status** is `draft` until Open Questions holds nothing that blocks
  building; then `ready-to-build`. warroom-tickets and the build refuse a
  `draft`.
- **Library assumptions** — every library behaviour the plan relies on,
  one row each, linked to the doc page of the installed version (or the
  version to be added). A row with no link is an unchecked guess: make it
  an Open Question.
- **Testing decisions** — the existing tests to copy, by path (the one
  place paths are wanted), and anything unusual about what gets tested.
  Nothing to decide → one line, "follow {path}"; don't drop the section.
- **Open Questions** — numbered, one sentence each. One that doesn't block
  building says why after ` — non-blocking: `. Empty → write `None.`
- **Out of Scope** bullets cite the `D{n}` that ruled them out.

## Template

```markdown
# Spec: {feature slug}

{What this feature lets the user do, one sentence.}

**Status:** draft

## Problem

{What goes wrong for the user today, in their words.}

## Solution

- {One thing the user will be able to do, one bullet per capability.}

## User Stories

**{Actor}**
1. As a {actor}, I want {feature}, so that {benefit} (D1)

## Expected Outcome

{What the user can do after this ships that they couldn't before, one sentence.}
- **{Scenario}:** {what the user sees}

**How success is judged:**
- {an outcome someone can check, pass or fail}

## Implementation

### Modules touched
- **{module}**
  - {what changes in it} (D2)

### Data
{schema block, only when the schema is the decision}

### Library assumptions
| Library | Version | The plan needs | Docs |
|---|---|---|---|
| {name} | {installed version} | {the behaviour relied on, one line} | [{page}]({url}) |

### {API group / client / ops area}
| {column} | {column} |
|---|---|
| {row} | {row} |

## Seams

{Why these seams, one line (D{n}).}

1. **{seam name}** `{interface}`
   - {input or situation} → {observable result}
2. **{user flow}** (e2e) `{app(s) and pages}`
   - {what the user does on screen} → {what they see}

## Testing decisions

- **Copy:** `{path to the closest existing test}` — {what to copy from it}
- {anything unusual about what gets tested, or how}

## Out of Scope

- {something this feature deliberately does not do} (D4)

## Open Questions

1. {a question still to be decided}
2. {a question} — non-blocking: {why building can start without it}

## Sources

- [{title}]({url}) — {what it backs} (accessed {YYYY-MM-DD})
```
