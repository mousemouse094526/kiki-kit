---
name: warroom-build
description: >-
  Implement ONE warroom ticket into committed code, in this session. Picks
  the frontier ticket from docs/features/{slug}/tickets/ (or the one named),
  reads the project's own conventions (CLAUDE.md, .claude/skills/), checks
  installed versions against the latest and asks before any upgrade, makes
  sure every language, runtime, and library it touches has a reference note
  for the installed version (llms.txt first, indexed in docs/reference/) —
  fetching and writing any that are missing — then builds it test-first at the seams agreed in
  spec.md, runs typecheck and single test files regularly and the full
  suite once at the end, reviews the diff on three axes (Standards, Spec,
  and a Newcomer who knows nothing about the ticket) with parallel
  subagents, marks the ticket done, and commits to the current branch. An
  unexplained failure hands off to warroom-debug. One ticket per session.
  Invoke with /warroom-build {slug} [ticket-number]; /warroom-build {slug}
  --review-feature reviews the whole feature branch before merge. Use only
  when the user explicitly asks to build a warroom ticket or review a
  warroom feature — including a pasted build prompt — never on your own
  initiative.
---

# Warroom Build

Adapted from Matt Pocock's `implement`, `tdd`, and `code-review`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT): a simple
work → feedback → commit loop over one ticket. You are the dispatcher — one
session per ticket, clearing context between tickets.

Implement the work described in the ticket. Use TDD at pre-agreed seams.
Run typechecking regularly, single test files regularly, and the full test
suite once at the end. Once done, review the work. Commit to the current
branch.

## 1. Pick the ticket

Tickets live in `docs/features/{slug}/tickets/`. No folder → tell the user
to run `/warroom-tickets {slug}` first.

- A number given → that ticket. A **Blocked by** ticket not `done` → say
  which, stop.
- None given → the **frontier**: the lowest-numbered ticket at
  `**Status:** ready-for-agent` whose every blocker is `done`. A ticket left
  `in-progress` → read its rows in `open-items.md` first, then ask:
  resume it (Recommended) or pick another.
- Nothing ready → report what blocks the rest, stop.

## 2. Load the context

Read the ticket, then what its **Covers** names: the `D{n}` in
decisions.md, the ADRs in `docs/adr/`, the Seams in spec.md, the legal
items. Read `CONTEXT.md` so names match the domain. Then:

- Record the **start commit** (`git rev-parse HEAD`) — the review diffs
  from it.
- On the default branch → ask once: new branch `feat/{slug}` (Recommended)
  or stay.
- Find the typecheck, single-test-file, full-suite, and lint commands
  (package.json scripts, Makefile, CI config). State them in one line.
- Set `**Status:** in-progress`.
- **Project conventions** — follow
  [references/conventions.md](references/conventions.md): read the
  project's `CLAUDE.md`, `.claude/rules/`, and its conventions skill under
  `.claude/skills/` for the area this ticket touches. None yet → propose
  one, get the user's OK, and write it into the project before coding.
  They live in the project, never in this skill.
- **Versions, then language and library docs** — follow
  [references/library-docs.md](references/library-docs.md) for every
  language, runtime, and library this ticket's code touches:
  1. Show the version table (installed, latest, gap, note version); a
     minor or major gap → read the changelog and ask: stay (Recommended)
     or upgrade now as its own commit or a prefactor ticket. Never upgrade
     silently or inside the ticket's commit.
  2. Note version equals installed → use it. Older or missing → fetch the
     docs for the installed version (`llms.txt` first; versioned docs or the
     changelog when installed ≠ latest) and update the note and index row
     **before writing any code**.

Language: code, comments, test names, commits, and `docs/reference/` notes
are English; replies to the user follow their language — see
[markdown-style.md](../warroom/references/markdown-style.md#language--english-except-the-docs).

## 3. Build test-first

Follow [references/tdd.md](references/tdd.md). The seams are the ones the
ticket's Covers names from spec.md › Seams — agreed at the warroom gate, so
don't re-ask. A behaviour no agreed seam can observe → ask the user which
seam to add, with each option's trade-off.

One acceptance criterion at a time: red → green. Run the typecheck and the
test file after each green.

**`(e2e)` criteria come last.** Once the behaviour below them is green,
write the e2e test for each `(e2e)` criterion with the project's e2e tool,
where the conventions say, through the real UI against the running apps.
No e2e setup yet and this ticket has `(e2e)` criteria → set it up first,
as the conventions describe.

**Follow the project conventions:** new code goes where the folder
structure says, in the layers it names. A ticket that sets a new pattern
updates the project's pattern file in the same commit.

**Never redesign.** Anything unfinished goes in
`docs/features/{slug}/open-items.md`
([templates/open-items.md](templates/open-items.md)) — never only in chat.

**Decisions.** Before asking anything, search for the answer: the whole
`decisions.md` (not only the Covers), the ADRs, spec.md, the conventions
skill, `docs/reference/`. Found → use it and add the `D{n}` to Covers;
never re-ask what the docs answer. Not found → the question says where you
looked. Then sort it:

- **Local** — it changes only how this ticket does its own work; no other
  ticket, seam, legal item, ADR, or active `D{n}` changes (wording of an
  error, a default page size). → ask with AskUserQuestion, recommended
  answer first; append the next `D{n}` with `**From:** build ticket NN`;
  add it to this ticket's Covers; carry on. The ruling is complete — it
  never leaves part of the choice to a later ticket; a part that can't be
  settled now is wide.
- **Wide** — it changes what the spec, another ticket, a legal item, or an
  ADR says, or contradicts an active `D{n}`. → never decided here: it
  skips the red team and legal check. Stop, leave the ticket
  `in-progress`, add a row `From: decision · Next: → /warroom`, and
  recommend `/warroom {slug}` — its Adjust records the `D{n}`, re-runs
  warroom-legal and The Breaker on it, then re-cuts.
- Unsure which → treat it as wide.

**Can't be built as cut** (too big, needs work no ticket has) → stop,
leave it `in-progress`, add a row `From: build stop · Next: →
/warroom-tickets`, and recommend `/warroom-tickets {slug}` to re-cut. The
docs themselves wrong → `Next: → /warroom` instead.

**Unexplained failure → warroom-debug.** A test that fails for a reason you
can't name in one look, a previously green test that breaks, or behaviour
that contradicts the spec → call the Skill tool with `warroom-debug`. Come
back here with its fix and regression test.

## 4. Full suite

Run the full suite, typecheck, and lint once — plus the e2e suite when the
ticket has `(e2e)` criteria or touched a page an e2e test covers. Fix what
this ticket broke.
Failures that were already there → don't fix; add a row `From: full suite
· Next: → /warroom-debug`.

## 5. Review on three axes

Follow [references/review.md](references/review.md), ticket scope: fixed
point = the start commit; spec = this ticket plus the docs it covers. Three
subagents in parallel — **Standards**, **Spec**, and **Newcomer** — reported
side by side.

Fix findings inside the ticket's scope; refactoring happens here, not in
the TDD loop. Then run focused checks on what you fixed — never a second
broad review. Each finding left → a row `From: review: {axis} · Next: →
feature review`.

## 6. Commit

Every acceptance criterion holds → `**Status:** done`. Commit code, tests,
and the ticket file to the current branch:
`feat({slug}): {ticket title} (#{NN})` — `refactor` for prefactor tickets.
Don't push, don't open a PR.

Report: what landed, new `D{n}`, library notes added, any debug record
written, rows added to `open-items.md`, and the next frontier ticket. Recommend
clearing context before the next `/warroom-build {slug}`. Every ticket
`done` → recommend `/warroom-build {slug} --review-feature`.

## Feature review — `/warroom-build {slug} --review-feature`

Run once every ticket is `done`, before merge or PR. Ticket reviews can't
see what goes wrong across tickets: the same thing built twice, two names
for one concept, a seam one ticket tested and another bypassed.

1. Fixed point = `git merge-base HEAD {default branch}`. Run the full suite,
   typecheck, and lint first.
2. Follow [references/review.md](references/review.md), feature scope —
   the three axes over the whole branch, with the whole feature folder as
   the spec source.
3. Show the findings together with every `open` row in `open-items.md`
   whose Next is `→ feature review`. Ask with AskUserQuestion which to fix
   now. Fix the picked ones, run focused checks, commit as
   `refactor({slug}): feature review fixes`. Picked rows → `done ({sha})`;
   new findings not picked → new rows `From: feature review`. No second
   broad review.
4. Any row still `open` → list it with its Next before recommending
   merge.
