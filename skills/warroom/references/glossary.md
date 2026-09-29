# Glossary and ADR format

Adapted from Matt Pocock's `domain-modeling` skill
([mattpocock/skills](https://github.com/mattpocock/skills), MIT © Matt Pocock).

## Where the glossary lives

- `CONTEXT-MAP.md` at the repo root → multiple contexts; read it to find each
  context's `CONTEXT.md`. Infer which context the feature belongs to; if unclear, ask.
- Only a root `CONTEXT.md` → single context.
- Neither → create a root `CONTEXT.md` when the first term is resolved. Never create
  an empty one.

## CONTEXT.md format

```md
# {Context Name}

{One or two sentences: what this context is.}

## Language

**Order**:
A customer's request to buy one or more items.
_Avoid_: Purchase, transaction

**Customer**:
A person or organization that places orders.
_Avoid_: Client, buyer, account
```

Rules:

- **One canonical word per concept.** List the rejected synonyms under `_Avoid_`.
- **Definitions one or two sentences.** Define what it IS, not what it does.
- **Project-specific terms only.** No general programming concepts (timeouts, error
  types, utility patterns).
- **Glossary only.** No implementation details, no decisions, no scratch notes.
- **Group under subheadings** when natural clusters emerge; otherwise a flat list.
- **Term names match the code** (usually English). Descriptions follow the docs
  language rule in SKILL.md.

Multi-context `CONTEXT-MAP.md` lists each context with a link and one line, plus a
Relationships section (`**Ordering → Billing**: Ordering emits OrderPlaced; Billing
consumes it`).

## ADRs — project-level decisions only

Feature decisions go in the feature's `decisions.md`. Offer an ADR in `docs/adr/`
only when a decision reaches beyond this feature AND all three hold:

1. **Hard to reverse** — changing it later is costly.
2. **Surprising without context** — a future reader would ask "why this way?"
3. **Real trade-off** — genuine alternatives existed.

Qualifies: architectural shape, integration patterns between contexts, technology
choices with lock-in, ownership/boundary rules, deliberate deviations from the obvious
path, constraints not visible in the code.

Format: `docs/adr/NNNN-slug.md`, next number after the highest existing one, folder
created on first ADR.

```md
# {Short title of the decision}

{1-3 sentences: context, what was decided, and why.}
```

Add `Status`, `Considered Options`, or `Consequences` sections only when they carry
real information.
