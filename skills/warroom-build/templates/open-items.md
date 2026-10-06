# Template: docs/features/{slug}/open-items.md

Everything found but not finished for one feature, in one table — so
nothing lives only in chat, and "what's left?" has one answer. Build,
debug, and trial write rows; the skill that closes a row updates it. Follow
[markdown-style.md](../../warroom/references/markdown-style.md). Column
words stay in English; **Found** is in the docs language.

## Rules

- **One row per item**, numbered in order, never renumbered or deleted.
- **From** — where it came from:
  - `build stop` — the ticket can't be built as cut;
  - `decision` — a choice that reaches beyond the ticket, which the build must not make;
  - `review: Standards` / `review: Spec` / `review: Newcomer` — a ticket review finding outside the ticket;
  - `feature review` — a finding the user didn't pick;
  - `full suite` — a failure that was already there;
  - `debug` — a spec gap or a bug blocked on missing data;
  - `trial` — a spec gap the user picked.
- **Found** — one short line: what, and where; a stopped build adds its
  `wip/{slug}-{NN}` branch.
- **Next** — the one flow that closes it: `→ /warroom-tickets` (re-cut),
  `→ /warroom` (docs or a decision), `→ /warroom-debug`, `→ /warroom-build`
  (finish a ticket stopped part-way), `→ feature review`.
- **Status** — `open` until a flow closes it, then `→ ticket NN`,
  `→ D{n}`, `done ({short sha})`, `done (docs fixed)`, or
  `dropped ({why})` when the user says so.
- The skill that closes a row updates its Status; nothing else edits it.
- Created on the first row; no file while there is nothing open.
- Trial findings the user didn't pick stay in the trial report only —
  they are observations, not work yet.

## Template

```markdown
# Open items: {feature slug}

| # | Ticket | From | Found | Next | Status |
|---|---|---|---|---|---|
| 1 | 04 | build stop | {needs a session store before lockout can work} | → /warroom-tickets | open |
| 2 | 04 | review: Newcomer | {`check()` name hides that it also locks the account} | → feature review | open |
| 3 | 06 | decision | {should a suspended company's employees be signed out at once?} | → /warroom | → D32 |
```
