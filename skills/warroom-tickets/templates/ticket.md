# Template: tickets/NN-slug.md

Ticket shape from Matt Pocock's `to-tickets`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT). Copy the
skeleton under **Template**; follow **Rules**. Labels, status values, and
`D{n}` stay in English; everything else is in the docs language.

## Rules

All of [markdown-style.md](../../warroom/references/markdown-style.md), plus:

- **What to build** is what the user can do once this ticket lands, in two
  or three sentences — not a layer-by-layer task list.
- **Blocked by** names ticket numbers and titles, or
  `None (can start immediately)`.
- **Covers** names exactly what this ticket delivers, one kind per bullet:
  decisions, ADRs, seams (by number in spec.md › Seams), user stories,
  legal items. The coverage check reads these.
- **One observable behaviour per bullet**: `{situation} → {result}`. A
  behaviour proven through the UI ends with `(e2e)`. More than eight →
  group them under `###` sub-headings by area, or split the ticket.
- **Status** is `ready-for-agent`, `in-progress`, or `done`.
- No file paths or code snippets — they go stale. A snippet that encodes
  a decision lives in the spec; cite it.

## Template

```markdown
# {NN}: {Ticket title}

**What to build:** {what the user can do once this lands, start to finish — 2–3 sentences}

**Blocked by:** {NN: title of each ticket that must be done first} | None (can start immediately)

**Covers:**
- Decisions: D1, D4
- ADR: 0002
- Seams: 1, 12
- User stories: 3, 5
- Legal: 9

**Status:** ready-for-agent

## Acceptance criteria

- {situation} → {result anyone can check}
- {what the user does on screen} → {what the user sees} (e2e)
```
