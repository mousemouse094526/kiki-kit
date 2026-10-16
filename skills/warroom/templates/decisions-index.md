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
- **Scope** is `feature` or `system`:
  - `system` — a rule every later feature must follow: who owns which data,
    a technology with real lock-in, a pattern between modules, a
    compliance or partner constraint the code doesn't show, a deliberate
    break from the obvious path. Every warroom reads all `system` rows in
    full before its first question.
  - `feature` — everything else, including tunable numbers and this
    feature's own behaviour.
- **Status** mirrors the entry: `active`, `superseded by {slug} D{n}`,
  `changed by …`, `extended by …`.
- **Old ADRs** (from before this index) are rows too: Feature links the
  ADR file, D is `ADR-NNNN`, Scope is `system`. No new ADRs are written.

## Template

```markdown
# Decisions

Every decision in the project, by subject. Check here before asking a
question; the full entry is in the feature's decisions.md.

## {Subject, e.g. Phone numbers}

| Decision | Feature | D | Scope | Status |
|---|---|---|---|---|
| {e.g. Store phone numbers in E.164} | [user-contact](features/user-contact/decisions.md) | D4 | system | active |
| {e.g. Show the country picker first} | [phone-international](features/phone-international/decisions.md) | D2 | feature | active |
```
