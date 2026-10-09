---
name: warroom-build
description: >-
  Build a warroom feature's tickets into committed code — one ticket after
  another, in this session, while the context holds. Reads the feature's
  progress.md first (what earlier tickets built and what they left for the
  next), the project's conventions, and reference notes for the installed
  library versions; builds test-first at the seams agreed in spec.md; runs
  the same checks CI runs; reviews the diff on three axes (Standards, Spec,
  Newcomer) and fixes what it finds; commits; and writes the ticket's
  summary into progress.md. Small implementation choices it decides and
  records; anything that changes what the spec promises it asks about.
  Debugs any failure it can't explain with a reproduce-first discipline.
  Invoke with /warroom-build {slug} [ticket-number];
  /warroom-build {slug} --review-feature reviews the whole branch before
  merge; /warroom-build debug {symptom} debugs any bug, in a feature or
  not. Use only when the user explicitly asks — including a pasted build
  command — never on your own initiative.
---

# Warroom Build

Adapted from Matt Pocock's `implement`, `tdd`, and `code-review`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT).

Build tickets one after another and keep `progress.md` true. That file is
the memory between tickets and between sessions: read it first, write it
last.

## 1. Start the session

Tickets live in `docs/features/{slug}/tickets/`. No folder, or spec.md is
`draft` → stop and end with `/warroom {slug}`.

1. **Read `progress.md`** — Now, every Log entry's **For the next
   ticket**, and the open Blocked rows. Missing (an older feature) →
   create it from [templates/progress.md](templates/progress.md) using the
   tickets' Status lines. An old `open-items.md` → move its `open` rows
   into Blocked (review findings go to **For the next ticket** instead),
   then delete it; commit both as `docs({slug}): move to progress.md`.
2. **Clean tree.** `git status` shows changes → list them and ask: commit
   them as their own commit (Recommended for docs) or stash them. Never
   build on top of them.
3. **Branch.** On the default branch → create `feat/{slug}` (ask once).
4. **The CI checks.** Read the CI config and list its exact commands
   ([ci-checks.md](../warroom/references/ci-checks.md)), plus the
   single-test-file command, in one line. **Run them all now.** Anything
   already red was red before this session: add one Blocked row for it
   (Needs: `/warroom-build debug {symptom}`) and don't let it hide a new
   failure later.
5. **Pick the ticket** — the one named, else the lowest `ready` or
   `in-progress` ticket whose blockers are `done`. Its blocker isn't done →
   say which and stop. Nothing ready → say what blocks the rest and stop.

## 2. Build one ticket

### Load

Read the ticket, what its **Covers** names (the `D{n}`, ADRs, Seams, legal
items), spec.md › Testing decisions, and `CONTEXT.md`. Then:

- **Conventions** for the area touched
  ([conventions.md](../warroom/references/conventions.md) says where).
  None for this area → set them up now as that file describes, asking the
  user, and record a `D{n}`.
- **Library docs** —
  [references/library-docs.md](references/library-docs.md): the version
  table, ask before any upgrade, and a reference note for the language and
  every library whose API the new code calls, **before writing code**.
- Set the ticket and its progress row to `in-progress`.

Code, comments, test names, commits, and `docs/library-notes/` are
English; replies follow the user's language.

### Test-first

[references/tdd.md](references/tdd.md) at the seams the ticket's Covers
names. One acceptance criterion at a time: red → green, then the typecheck
and that test file. `(e2e)` criteria come last, through the real UI with
the project's e2e tool (set it up first if the conventions say so and it
isn't there). New code goes where the conventions say; a ticket that sets
a layer's rules updates its `rules/{layer}.md` in the same commit.

### When the docs don't settle something

1. **Look it up first** — all of decisions.md, the ADRs, spec.md, the
   conventions, `docs/library-notes/`, and `progress.md`. Answered → use
   it.
2. **A small implementation choice** that stays inside this feature and
   doesn't change what the spec promises — a default, a message's wording,
   a limit, where a helper lives → **decide it yourself**, the way the
   conventions and the existing code point. Record it as the next `D{n}`
   (`**From:** build ticket NN`, with its why) and list it in the ticket's
   Log entry. Don't stop, don't ask.
3. **Anything the user would notice, or that touches a legal item or an
   ADR** → ask now with AskUserQuestion: your recommendation first, and
   where you looked. The answer stays inside the spec's intent → record a
   `D{n}` and carry on. It changes what the spec promises, the user wants
   to think about it, or the docs contradict each other → add a Blocked
   row (Needs: `/warroom {slug}`) and **stop the ticket** (section 4).

**Failure you can't explain at a glance** — a test failing for no reason
you can name, a green test breaking, behaviour contradicting the spec →
follow [references/debug.md](references/debug.md) right here, then carry
on with its fix and regression test.

### Check

Run **every CI check** (section 1, step 4) — plus the e2e suite when the
ticket has `(e2e)` criteria or touched a page an e2e test covers. Fix what
this ticket broke. Red that was there at session start isn't this
ticket's. No commit while a check this ticket broke is red.

### Review on three axes

[references/review.md](references/review.md), ticket scope: three parallel
subagents — **Standards**, **Spec**, **Newcomer** — from the commit before
this ticket. **Fix every finding now**, inside the ticket: refactoring
happens here, not in the TDD loop. A finding too big to fix here goes in
the Log's **For the next ticket**, not in Blocked. Recheck only what you
fixed, then run the CI checks again if any code changed.

### Commit and log

Every acceptance criterion holds → ticket `**Status:** done`. In
`progress.md`:

- the ticket's row → `done`;
- a new Log entry on top — **Built**, **Decided**, **For the next ticket**,
  **Checks** ([template](templates/progress.md));
- Blocked rows this ticket closed → `done (this ticket)`;
- **Now** and **Next**.

Commit code, tests, the ticket, `progress.md`, and any doc it changed:
`feat({slug}): {ticket title} (#{NN})` — `refactor` for a prefactor
ticket. Don't push, don't open a PR.

Then show the ticket's Log entry in chat — that is the summary.

## 3. Next ticket, or stop

After each commit, ask with AskUserQuestion:

- **Continue here** with ticket {NN} (Recommended while this session is
  still short — usually after the first ticket);
- **Stop** — end with the Next command for a new session.

After two big tickets in one session, recommend Stop: a nearly full
context is where mistakes creep in. Every ticket `done` → offer the
feature review instead.

## 4. Stopping part-way

Context running low, or a Blocked row stops the ticket:

1. Finish the acceptance-criteria group you're in, or roll it back — never
   half a group.
2. Ask about the unfinished code: keep it on `wip/{slug}-{NN}`
   (Recommended) or discard it.
3. In `progress.md`: a Log entry marked `stopped` — what is done, what is
   left, the `wip/` branch; the ticket stays `in-progress`; Now and Next.
4. Commit `progress.md`, the ticket, and any new `D{n}` **on the feature
   branch** — `docs({slug}): stop ticket {NN}` — so the next session reads
   them. Then move the code to the `wip/` branch, or discard it. The tree
   ends clean.
5. End with the Next command in its own code block.

## Feature review — `/warroom-build {slug} --review-feature`

Every ticket `done`, before merge. It catches what ticket reviews can't:
the same thing built twice, two names for one concept, a seam one ticket
tested and another bypassed.

1. Run the CI checks. Fixed point = `git merge-base HEAD {default
   branch}`.
2. [references/review.md](references/review.md), feature scope — the three
   axes over the whole branch, the whole feature folder as the spec — plus
   every **For the next ticket** item in the Log that was never picked up.
3. Show the findings; ask which to fix now. Fix them, run the CI checks,
   commit `refactor({slug}): feature review fixes`. The rest → a Blocked
   row each (Needs: `/warroom tickets {slug}`), or dropped when the user
   says so.
4. Update `progress.md`: Now = "ready to merge", or the rows still open and
   their commands. Recommend merging only when no Blocked row is `open`.

## Debug mode — `/warroom-build debug {symptom}`

Any bug, in a feature or not: follow
[references/debug.md](references/debug.md) from Phase 0. No ticket, no
progress.md unless the bug belongs to a feature.

## End of every session

The last thing in chat, always:

- what was done this session, one line per ticket;
- anything now Blocked, with its command;
- **Next**, in its own code block, ready to paste in a new session.
