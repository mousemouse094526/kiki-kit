# Template: docs/progress/{slug}/tickets/NN-slug.md

Ticket shape from Matt Pocock's `to-tickets`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT). Copy the
skeleton under **Template**; follow **Rules**. Labels, status values, and
`D{n}` stay in English; everything else is in the docs language.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **What to build** is what the user can do once this ticket lands, in two
  or three sentences — not a layer-by-layer task list.
- **Blocked by** names ticket numbers and titles, or
  `None (can start immediately)`. A ticket of another feature is written
  `{slug} {NN}: {title}`, so `/warroom next` can check it.
- **Covers** names exactly what this ticket delivers, one kind per bullet:
  decisions (another feature's with its slug), ADRs, seams (by number in
  spec.md › Seams), user stories, screens (by name in spec.md › Design),
  legal items.
- **One observable behaviour per bullet**: `{situation} → {result}`. A
  behaviour proven through the UI ends with `(e2e)`. More than eight →
  group them under `###` sub-headings by area.
- **Status** is `ready-for-agent`, `in-progress`, or `done`.
- No file paths or code snippets. A snippet that encodes a decision lives
  in the spec; cite it.

## Template

```markdown
# {NN}: {Ticket title}

**What to build:** {what the user can do once this lands, start to finish — 2–3 sentences}

**Blocked by:** {NN: title of each ticket that must be done first} | None (can start immediately)

**Covers:**
- Decisions: D1, D4, user-contact D4
- ADR: 0002
- Screens: Contact form
- Seams: 1, 12
- User stories: 3, 5
- Legal: 9

**Status:** ready-for-agent

## Acceptance criteria

- {situation} → {result anyone can check}
- {what the user does on screen} → {what the user sees} (e2e)
```
