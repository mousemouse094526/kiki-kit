# Template: docs/features/{slug}/progress.md

The one file that says where a feature stands: which tickets are done,
what each one built, what the next one must know, and what is stuck.
**Every build session reads it first and updates it before it ends.**
Follow [markdown-style.md](../../warroom/references/markdown-style.md).
Labels, status words, and commands stay in English; the text is in the
docs language.

## Rules

- **Created by warroom** when it cuts the tickets. A re-cut rewrites only
  the Tickets table.
- **Now** and **Next** are rewritten at the end of every session. Next is
  always a command ready to paste, with the ticket number.
- **Tickets** — one row per ticket. Status is `ready`, `in-progress`, or
  `done`. A ticket's commit is found by `(#NN)` in `git log`.
- **Log** — one entry per finished ticket, newest first, written in the
  ticket's commit. It is how one ticket talks to the next:
  - **Built** — what works now, in the user's terms, two or three bullets.
  - **Decided** — each `D{n}` the build made, one line each.
  - **For the next ticket** — anything a later ticket must know: a helper
    it should reuse, a name that was chosen, a shortcut that must be
    finished later. "Nothing" when there is nothing.
  - **Checks** — the CI checks run, and their result.
- **A ticket stopped part-way** gets a Log entry too, marked `stopped`:
  what is done, what is left, and the `wip/` branch if there is one.
- **Blocked** — only what the build may not settle itself: a change to the
  spec's behaviour, a legal item, or an ADR the user wants to wait on; a
  bug it couldn't reproduce; a CI failure that was there before the
  feature. Review findings are fixed in the ticket, never parked here.
  - Rows are numbered, never deleted.
  - **Needs** is the one command that closes it.
  - **Status** is `open` until that command closes it, then `→ D{n}`,
    `→ ticket NN`, `done ({short sha})`, or `dropped ({why})` when the user
    says so.

## Template

````markdown
# Progress: {feature slug}

**Now:** {where the feature stands, one line — e.g. "02 done; 03 next"}

**Next:**

```
/warroom-build {slug} {NN}
```

## Tickets

| # | Title | Status |
|---|---|---|
| 01 | {title} | done |
| 02 | {title} | ready |

## Log

### 01: {title} — done {YYYY-MM-DD}

**Built:**
- {what the user can do now}

**Decided:**
- D14 — {the decision, one line}

**For the next ticket:**
- {something a later ticket must know, or "Nothing"}

**Checks:** {commands} — all green

## Blocked

| # | Ticket | What | Needs | Status |
|---|---|---|---|---|
| 1 | 02 | {what is stuck, one line} | `/warroom {slug}` | open |
````
