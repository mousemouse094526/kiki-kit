# Template: spec.md

The what and how. Copy the skeleton under **Template**; follow **Rules**.
The `##` headings stay in English; everything else is in the docs language.
Drop a section only when it would be empty.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **Cite, don't retell.** A decision appears as `(D3)`; its reasoning lives
  in decisions.md.
- **One idea per bullet.** Nest bullets for steps or sub-cases instead of
  writing long lines.
- **Contracts as tables** — routes, error codes, endpoints and their
  actions, settings.
- **Ordered steps as numbered lists** — checks in order, transaction steps.
- **Implementation is split by `###` area** (modules touched, data, each
  API group, client, ops). One area per heading.
- **Name modules and packages, not files.** `apps/api`, `packages/db`, a
  feature folder are fine; file-level paths and code snippets are not —
  they go stale fast. Exception: a snippet that IS the decision — a state
  machine, a schema.
- **Seams are numbered**, one seam per number, each with observable
  pass/fail bullets. warroom-tickets and the build read this section.
- **Pick seams on purpose**, in this order: reuse a seam that already
  exists (two contracts for one thing drift); take the **highest** one that
  works (everything below stays free to change, and tests survive
  refactors); **fewer is better**, one is the target — each seam is a
  contract kept forever. The set is a `D{n}` with its reason, cited
  above the list.
- **Tag a seam `(e2e)`** when its behaviour can only be observed through
  the UI — a user flow across pages, or across apps (one user acts in one
  app, another sees it in another). Those are proven with the project's
  e2e tool; every other seam is proven below the UI.
- **Status** is `draft` until Open Questions holds nothing that blocks
  building; then `ready-to-build`. warroom-tickets and the build refuse a
  `draft` — fog found mid-build costs far more than a question asked now.
- **Library assumptions** — every library behaviour the plan relies on,
  one row each, linked to the doc page of the installed version (or the
  version to be added). A row with
  no link is an unchecked guess: make it an Open Question.
- **Testing decisions** — the existing tests this feature's tests should
  copy, by path (the one place paths are wanted: "go read this file"), and
  anything unusual about what gets tested. Nothing to decide → say "follow
  {path}" in one line rather than dropping the section.
- **Open Questions** — numbered, each one sentence. One that doesn't block
  building says why after ` — non-blocking: `. Empty → write `None.`
- **Out of Scope** bullets cite the `D{n}` that ruled them out.

## Template

```markdown
# Spec: {feature slug}

{One line: what this feature is.}

**Status:** draft

## Problem

{From the user's perspective.}

## Solution

- {From the user's perspective, one bullet per capability.}

## User Stories

**{Actor}**
1. As a {actor}, I want {feature}, so that {benefit} (D1)

## Expected Outcome

{What exists once this ships — what the user can do that they couldn't before.}
- **{Scenario}:** {what the user sees}

**How success is judged:**
- {checkable outcome}

## Implementation

### Modules touched
- **{module}**
  - {change} (D2)

### Data
{schema block when the schema is the decision}

### Library assumptions
| Library | Version | The plan needs | Docs |
|---|---|---|---|
| {name} | {installed} | {behaviour, one line} | [{page}]({url}) |

### {API group / client / ops area}
| {column} | {column} |
|---|---|
| {row} | {row} |

## Seams

{One line: why this set of seams (D{n}).}

1. **{seam name}** `{interface}`
   - {input or situation} → {observable result}
2. **{user flow}** (e2e) `{app(s) and pages}`
   - {what the user does on screen} → {what they see}

## Testing decisions

- **Copy:** `{path to the closest existing test}` — {what to copy from it}
- {anything unusual about what gets tested, or how}

## Out of Scope

- {what this feature deliberately does not do} (D4)

## Open Questions

1. {a question still to be decided}
2. {a question} — non-blocking: {why building can start without it}

## Sources

- [{title}]({url}) — {what it backs} (accessed {YYYY-MM-DD})
```
