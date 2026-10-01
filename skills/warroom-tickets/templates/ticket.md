# Template: tickets/NN-slug.md

Ticket shape from Matt Pocock's `to-tickets`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT). Copy the
skeleton under **Template**; follow **Rules**. Labels, status values, and
`D{n}` stay in English; everything else is in the docs language.

## Rules

- **What to build** is the end-to-end behaviour from the user's side, two
  or three sentences — not a layer-by-layer task list.
- **Blocked by** names ticket numbers and titles, or
  `None (can start immediately)`.
- **Covers** names exactly what this ticket delivers, one kind per bullet:
  decisions, ADRs, seams (by number in spec.md › Seams), user stories,
  legal items. warroom-tickets' coverage check reads these.
- **One observable behaviour per checkbox**: `{situation} → {result}`.
  More than eight → group them under `###` sub-headings by area, or split
  the ticket.
- **Status** is `ready-for-agent`, `in-progress`, or `done`.
- No file paths or code snippets — they go stale fast. A snippet that
  encodes a decision lives in the spec; cite it.

## Template

```markdown
# {NN}: {Ticket title}

**What to build:** {the end-to-end behaviour this ticket makes work, from the user's perspective}

**Blocked by:** {NN: title} | None (can start immediately)

**Covers:**
- Decisions: D1, D4
- ADR: 0002
- Seams: 1, 12
- User stories: 3, 5
- Legal: 9

**Status:** ready-for-agent

## Acceptance criteria

- [ ] {situation} → {observable result}
- [ ] {situation} → {observable result}
```
