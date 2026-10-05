# Template: docs/features/{slug}/open-items.md

Everything the build found but did not finish, in one table per feature —
so nothing lives only in chat. Follow
[markdown-style.md](../../warroom/references/markdown-style.md). Column
words stay in English; **Found** is in the docs language.

## Rules

- **One row per item**, numbered in order, never renumbered or deleted.
- **From** — where it came from:
  - `build stop` — the ticket can't be built as cut;
  - `decision` — a wide decision the build must not make (see SKILL.md › Decisions);
  - `review: Standards` / `review: Spec` / `review: Newcomer` — a ticket review finding outside the ticket;
  - `feature review` — a finding the user didn't pick;
  - `full suite` — a failure that was already there.
- **Found** — one short line: what, and where.
- **Next** — the one flow that closes it: `→ /warroom-tickets` (re-cut),
  `→ /warroom` (docs or a wide decision), `→ /warroom-debug`,
  `→ feature review`.
- **Status** — `open` until a flow closes it, then `→ ticket NN`,
  `→ D{n}`, `done ({short sha})`, or `dropped ({why})`.
- The skill that closes a row updates its Status; nothing else edits it.
- Created on the first row; no file while there is nothing open.

## Template

```markdown
# Open items: {feature slug}

| # | Ticket | From | Found | Next | Status |
|---|---|---|---|---|---|
| 1 | 04 | build stop | {needs a session store before lockout can work} | → /warroom-tickets | open |
| 2 | 04 | review: Newcomer | {`check()` name hides that it also locks the account} | → feature review | open |
| 3 | 06 | decision | {should a suspended company's employees be signed out at once?} | → /warroom | → D32 |
```
