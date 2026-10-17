# Glossary format

Adapted from Matt Pocock's `domain-modeling` skill
([mattpocock/skills](https://github.com/mattpocock/skills), MIT © Matt Pocock).

## Where the glossary lives

- `CONTEXT-MAP.md` at the repo root → multiple contexts; it points to each
  context's `CONTEXT.md`. Infer which context the feature belongs to; if
  unclear, ask.
- Only a root `CONTEXT.md` → single context.
- Neither → create a root `CONTEXT.md` when the first term is resolved.
  Never create an empty one.

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

- **One canonical word per concept.** List rejected synonyms under `_Avoid_`.
- **Definitions are one or two sentences.** Say what it IS, not what it does.
- **Project-specific terms only.** No general programming concepts
  (timeouts, error types, utility patterns).
- **Glossary only.** No implementation details, decisions, or scratch notes.
- **Group under subheadings** when natural clusters appear; otherwise a
  flat list.
- **Term names match the code** (usually English). Descriptions follow the
  docs language rule in markdown-style.md.

A multi-context `CONTEXT-MAP.md` lists each context with a link and one
line, plus a Relationships section (`**Ordering → Billing**: Ordering emits
OrderPlaced; Billing consumes it`).

## ADRs

Criteria, sweep, and format in [adr.md](adr.md).
