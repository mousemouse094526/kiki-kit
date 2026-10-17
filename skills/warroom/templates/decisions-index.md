# Template: docs/decisions.md

Every decision of every feature, one line each, **grouped by subject**
(phone numbers, login, payments). The full entry stays in the feature's
`decisions.md`; this file only points to it. Follow
[markdown-style.md](../references/markdown-style.md). Labels, status and
scope words, and `D{n}` stay in English; subjects and decision lines are in
the docs language.

## Rules

- **Written in the same moment as the entry.** Every new `D{n}` gets its
  row here right after it lands in the feature's `decisions.md`, and every
  Status change is made in both places.
- **Subjects, not features.** Put the row under the subject a later feature
  would look for. Reuse an existing subject before adding one; split a
  subject only when it outgrows one screen.
- **Decision** is the decision as one short statement — enough to answer
  the question without opening the entry.
- **Feature** links the feature's `decisions.md`; **D** is its number there.
  Numbers are per feature, so outside its own folder a decision is always
  cited with its slug: `user-contact D4`.
- **Used by** lists every other feature whose docs cite this decision
  (`checkout`), else `—`. Add a feature the moment it reuses the decision;
  remove it when it stops citing it.
- **ADR** is the ADR number the gate wrote from this decision (`0003`),
  else `—`. An ADR with no source decision gets its own row: Feature and
  D are `—`.
- **Status** mirrors the entry: `active`, `superseded by {slug} D{n}`,
  `changed by …`, `extended by …`.

## Changing a decision someone uses

Any skill that supersedes or changes a decision whose row has Used by or
an ADR:

1. Show the owner and every Used-by feature, with what each cites it for.
2. Record the new `D{n}` in the deciding feature; the old row's Status
   becomes `superseded by {slug} D{n}`. The new row takes over Used by and
   ADR (the ADR is superseded as `references/adr.md` says).
3. In every Used-by feature: rewrite the citation to the new decision in
   its spec, flow, and open tickets.
4. A Used-by feature whose behaviour changes because of it, and that has
   tickets `done` or `in-progress` → add a row to its `progress.md` ›
   Blocked (`follow {slug} D{n}`, Needs `/warroom {its slug}`) and set its
   board row's Stage to `blocked`. Docs-only changes need no row.
5. List every file changed and every feature now blocked.

## Template

```markdown
# Decisions

Every decision in the project, by subject. Check here before asking a
question; the full entry is in the feature's decisions.md.

## {Subject, e.g. Phone numbers}

| Decision | Feature | D | Used by | ADR | Status |
|---|---|---|---|---|---|
| {e.g. Store phone numbers in E.164} | [user-contact](features/user-contact/decisions.md) | D4 | checkout, sms-otp | [0003](adr/0003-phone-e164.md) | active |
| {e.g. Show the country picker first} | [user-contact](features/user-contact/decisions.md) | D9 | — | — | active |
```
