---
name: warroom-build
description: >-
  Implement ONE warroom ticket into committed code, in this session. Picks
  the frontier ticket from docs/features/{slug}/tickets/ (or the one named),
  reads the project's conventions skill and the reference notes for the
  installed library versions (fetching any that are missing, llms.txt
  first, asking before any upgrade), builds test-first at the seams agreed
  in spec.md, runs the full suite once at the end, reviews the diff on
  three axes (Standards, Spec, Newcomer) with parallel subagents, and
  commits. It implements decisions, it doesn't make them: anything the
  docs don't settle stops the build and is routed through open-items.md.
  An unexplained failure hands off to warroom-debug. One ticket per
  session. Invoke with /warroom-build {slug} [ticket-number];
  /warroom-build {slug} --review-feature reviews the whole feature branch
  before merge. Use only when the user explicitly asks to build a warroom
  ticket or review a warroom feature — including a pasted build prompt —
  never on your own initiative.
---

# Warroom Build

Adapted from Matt Pocock's `implement`, `tdd`, and `code-review`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT): a simple
work → feedback → commit loop over one ticket. One session per ticket: a
fresh context reads only what the ticket needs, the review diffs only this
ticket, and its one commit can be reverted alone. Memory between sessions
lives in files — the ticket, decisions.md, open-items.md — never in chat.

## 1. Pick the ticket

Tickets live in `docs/features/{slug}/tickets/`. No folder, or spec.md is
still `draft` → stop and name the skill to run first (`/warroom-tickets`,
`/warroom`).

- A number given → that ticket. A **Blocked by** ticket not `done` → say
  which, stop.
- None given → the **frontier**: the lowest-numbered `ready-for-agent`
  ticket whose blockers are all `done`. One left `in-progress` → read its
  rows in `open-items.md`, then ask: resume it (Recommended) or pick
  another.
- Nothing ready → report what blocks the rest, stop.

## 2. Load the context

Read the ticket and what its **Covers** names (the `D{n}`, ADRs, Seams,
legal items), spec.md › Testing decisions, and `CONTEXT.md` so names match
the domain. Then:

- **Clean tree first.** `git status` shows changes → list them and ask:
  commit them as their own commit (Recommended for warroom docs — tickets,
  a trial report, open-items rows, seed accounts) or stash them. Never
  start on top of them: they would land in this ticket's review and commit.
- Record the **start commit** (`git rev-parse HEAD`) — the review diffs
  from it.
- On the default branch → ask once: new branch `feat/{slug}` (Recommended)
  or stay.
- State the typecheck, single-test-file, full-suite, and lint commands in
  one line.
- **Conventions** — read the project's conventions for the area touched
  ([conventions.md](../warroom-tickets/references/conventions.md) says
  where). None for this area → stop and recommend `/warroom-tickets
  {slug}`: structure is set up before slicing, not mid-ticket.
- **Library docs** — follow [references/library-docs.md](references/library-docs.md):
  show the version table, ask before any upgrade, and make sure the
  language and every library whose API this ticket's new code calls has a
  reference note for the installed version **before writing code**.
- Only now set `**Status:** in-progress` — a ticket stopped before this
  point was never started.

Code, comments, test names, commits, and `docs/library-notes/` notes are
English; replies follow the user's language.

## 3. Build test-first

Follow [references/tdd.md](references/tdd.md) at the seams the ticket's
Covers names — agreed at the gate, so don't re-ask. One acceptance
criterion at a time: red → green, then the typecheck and the test file.

- **`(e2e)` criteria come last**, once the behaviour below them is green,
  with the project's e2e tool, through the real UI. No e2e setup yet → set
  it up first as the conventions describe.
- **New code goes where the conventions say.** A ticket that sets or
  changes a layer's rules updates its `rules/{layer}.md` in the same commit.
- **A ticket too big for one session** → stop at the end of a criteria
  group: commit what is green as `wip({slug}): {title} (#{NN}, part n)`,
  never half a group; leave it `in-progress` and add a row `From: build
  stop · Next: → /warroom-build` naming the groups left. The full suite
  and review run once, in the session that finishes it.

### The build implements decisions; it doesn't make them

A decision made here skips the red team and the legal check, and lands
halfway through code. When something is not settled:

1. **Look it up before asking.** The whole decisions.md (not only Covers),
   the ADRs, spec.md, the conventions, `docs/library-notes/`. Answered → use it
   and add the `D{n}` to Covers.
2. **Only this ticket's own how** — an error message's wording, a default
   page size, a rules file for a layer no ticket had yet — and
   nothing else changes because of it → ask with AskUserQuestion,
   recommended answer first, saying where you looked. Record the whole
   answer as the next `D{n}` (`**From:** build ticket NN`) or in the
   conventions — no part left "for ticket NN". Carry on.
3. **Anything else** — it changes the spec, another ticket, a legal item,
   an ADR, or an active `D{n}`; the ticket can't be built as cut; the docs
   contradict each other; or you're unsure which → **stop**. Add a row to
   `open-items.md` ([templates/open-items.md](templates/open-items.md))
   whose Next names the flow that closes it (`→ /warroom` for docs and
   decisions, `→ /warroom-tickets` for the cut), leave the ticket
   `in-progress`, and recommend that flow.

**Never end a session with a dirty tree** — the next session would start on
code nobody can explain. Before stopping:

1. Ask about the code: keep it on branch `wip/{slug}-{NN}` (Recommended) or
   discard it. Note the answer in the row.
2. Commit the docs **on the feature branch**: the ticket's
   `**Status:** in-progress`, the open-items row, and any new `D{n}` —
   `docs({slug}): stop ticket {NN}`. The next flow reads them from here; on
   the `wip/` branch nobody would see them.
3. Then move the code to `wip/{slug}-{NN}` and commit it there, or discard
   it. The feature branch is left clean.

**Unexplained failure → warroom-debug.** A test that fails for a reason you
can't name at a glance, a green test that breaks, behaviour that
contradicts the spec → call the Skill tool with `warroom-debug`, then come
back with its fix and regression test. Debug ends `blocked` or finds a spec
gap → it has added the row; stop as in rule 3 (ticket `in-progress`, clean
tree).

## 4. Full suite

Run the full suite, typecheck, and lint once — plus the e2e suite when the
ticket has `(e2e)` criteria or touched a page an e2e test covers. Fix what
this ticket broke. A failure that was already there isn't this ticket's:
add a row `From: full suite · Next: → /warroom-debug`.

## 5. Review on three axes

Follow [references/review.md](references/review.md), ticket scope: fixed
point = the start commit. Three subagents in parallel — **Standards**,
**Spec**, **Newcomer** — reported side by side. Fix findings inside the
ticket; refactoring happens here, not in the TDD loop. Recheck only what
you fixed — never a second broad review. Any fix changed code → run the
full suite, typecheck, and lint again before the commit; a refactor can
break a test the review never looked at. A finding left → a row
`From: review: {axis} · Next: → feature review`.

## 6. Commit

Every acceptance criterion holds → `**Status:** done`. Commit code, tests,
the ticket, and any doc this ticket changed:
`feat({slug}): {ticket title} (#{NN})` — `refactor` for prefactor tickets.
Don't push, don't open a PR.

Report: what landed, new `D{n}`, reference notes added, rows added to
`open-items.md`, and the next frontier ticket. Recommend a new session for
it; every ticket `done` → recommend `--review-feature`.

## Feature review — `/warroom-build {slug} --review-feature`

Once every ticket is `done`, before merge. It catches what ticket reviews
can't see: the same thing built twice, two names for one concept, a seam
one ticket tested and another bypassed.

1. Fixed point = `git merge-base HEAD {default branch}`. Run the full
   suite, typecheck, and lint first.
2. [references/review.md](references/review.md), feature scope — the three
   axes over the whole branch, the whole feature folder as the spec.
3. Show the findings with every `open` row whose Next is `→ feature
   review`. Ask which to fix now; fix them, run the full suite, typecheck,
   and lint again, commit
   `refactor({slug}): feature review fixes`. Fixed rows → `done ({sha})`.
   Findings not picked → new rows `From: feature review · Next: →
   /warroom-tickets`, or `dropped ({why})` when the user says so.
4. Any row still `open` → list it with its Next and don't recommend merge
   until each is closed or dropped.
