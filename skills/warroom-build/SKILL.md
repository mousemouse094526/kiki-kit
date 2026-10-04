---
name: warroom-build
description: >-
  Implement ONE warroom ticket into committed code, in this session. Picks
  the frontier ticket from docs/features/{slug}/tickets/ (or the one named),
  first makes sure every language, runtime, and library it touches has a
  reference note with best practices from the current official docs
  (llms.txt first, indexed in docs/reference/) — fetching and writing any
  that are missing — builds it test-first at the seams agreed in
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
  `in-progress` → ask: resume it (Recommended) or pick another.
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

**Follow the project conventions: new code goes where the folder structure
says, in the layers it names. A ticket that sets a new pattern updates the
project's pattern file in the same commit.

Never redesign.** A real choice the docs don't answer → ask with
AskUserQuestion, recommended answer first, and append it to decisions.md as
the next `D{n}`. The ticket can't be built as cut → stop, leave it
`in-progress`, report why.

**Unexplained failure → warroom-debug.** A test that fails for a reason you
can't name in one look, a previously green test that breaks, or behaviour
that contradicts the spec → call the Skill tool with `warroom-debug`. Come
back here with its fix and regression test.

## 4. Full suite

Run the full suite, typecheck, and lint once. Fix what this ticket broke.
Failures that were already there → report, don't fix.

## 5. Review on three axes

Follow [references/review.md](references/review.md), ticket scope: fixed
point = the start commit; spec = this ticket plus the docs it covers. Three
subagents in parallel — **Standards**, **Spec**, and **Newcomer** — reported
side by side.

Fix findings inside the ticket's scope; refactoring happens here, not in
the TDD loop. Then run focused checks on what you fixed — never a second
broad review. List what you left and why.

## 6. Commit

Every acceptance criterion holds → `**Status:** done`. Commit code, tests,
and the ticket file to the current branch:
`feat({slug}): {ticket title} (#{NN})` — `refactor` for prefactor tickets.
Don't push, don't open a PR.

Report: what landed, new `D{n}`, library notes added, any debug record
written, review findings left, and the next frontier ticket. Recommend
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
3. Show the findings. Ask with AskUserQuestion which to fix now. Fix the
   picked ones, run focused checks, commit as
   `refactor({slug}): feature review fixes`. Leave the rest listed in the
   reply. No second broad review.
