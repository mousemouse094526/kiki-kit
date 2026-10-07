---
name: warroom-tickets
description: >-
  Break a ready-to-build warroom feature into tracer-bullet tickets, each
  declaring the tickets that block it — one markdown file per ticket under
  docs/features/{slug}/tickets/. Refuses a draft spec. Sets up the
  project's conventions skill (.claude/skills/{framework}-{surface}/) for
  any area that has none, explores the codebase for prefactoring, drafts
  vertical slices, quizzes the user on granularity and blocking edges, and
  writes the tickets only after the user approves. Re-cuts fold in the
  open-items.md rows routed to it. Ends with a ready-to-paste prompt for
  warroom-build. No code. Warroom runs it right after its approval gate;
  also runs standalone as /warroom-tickets {slug}.
---

# Warroom Tickets

Adapted from Matt Pocock's `to-tickets`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT). Same
process; the source is a warroom feature folder and the tracker is local
files beside it.

Split the approved feature into **tickets**: tracer-bullet vertical slices,
each naming the tickets that **block** it.

## Process

### 1. Gather context

Work from the feature folder: `docs/features/{slug}/` (or wherever warroom
put it). Called from warroom → the feature just approved. Standalone with
no slug → list the feature folders and ask which.

Read `spec.md`, `decisions.md`, `flow.md`, `legal.md`, and `CONTEXT.md` in
full. No `spec.md`, or its Status is `draft` → stop and recommend
`/warroom {slug}`: open questions left in tickets get answered mid-build,
where they cost the most.

`tickets/` already exists → ask: re-cut the tickets not yet `done`, or
stop. A re-cut **renumbers every ticket that is not `done`** in dependency
order after the `done` ones — a new blocker never gets a higher number than
the tickets it blocks. Update every reference to a renumbered ticket,
including the Ticket column of `open-items.md` (a `wip/` branch keeps its
old name; its row says which ticket it now belongs to). Fold every `open`
row in `open-items.md` whose Next is `→ /warroom-tickets` into the new cut,
and set its Status to `→ ticket NN`.

### 2. Explore the codebase

Explore the codebase if you haven't yet. Ticket titles and descriptions
use the `CONTEXT.md` glossary terms and follow the feature's `D{n}`
decisions and any ADRs in the area touched.

**Conventions first.** Read the project's conventions for every area the
spec touches. An area with planned code and no conventions → set them up
now, before slicing, as [references/conventions.md](references/conventions.md)
describes. Cut the tickets against that structure.

Look for prefactors that make the build easier, including existing code
that doesn't match the conventions. "Make the change easy, then make the
easy change." Prefactor tickets are numbered first.

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema,
  API, UI, tests): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each ticket its **blocking edges**: the tickets that must finish
before it can start. A ticket with no blockers can start now.

**Wide refactors are the exception to vertical slicing.** A **wide
refactor** is one mechanical change (rename a column, retype a shared
symbol) whose **blast radius** fans across the whole codebase, so no
vertical slice can land green. Sequence it as **expand–contract**: expand
(add the new form beside the old; blocked by nothing), migrate call sites
in batches sized by blast radius (each its own ticket, blocked by the
expand), contract (delete the old form; blocked by every migrate batch).

**Warroom addition — cover the docs.** Before the quiz, check that every
User Story, every Seam, and every CONDITIONAL requirement in `legal.md`
lands in at least one ticket's acceptance criteria, and nothing from Out of
Scope does. Every `(e2e)` seam lands in the ticket that completes its flow — the
first ticket where every page and app it crosses exists — as acceptance
criteria tagged `(e2e)`. The first such ticket also sets up the e2e
package if the project has none.

**Warroom addition — walk each ticket as its builder.** A choice the docs,
ADRs, and conventions leave open would stop that build halfway. Structural
(where a shared piece lives) → settle it now in the conventions. About
behaviour → it's an open question, and only warroom may answer it:

1. Add a row to `open-items.md`
   ([template](../warroom-build/templates/open-items.md)):
   `From: tickets · Next: → /warroom`, the question in Found.
2. Write no tickets — a cut around a hole gets re-cut anyway.
3. Stop and recommend `/warroom {slug}`; its re-open answers the row, and
   its Approve runs this skill again.

Don't guess, and don't leave it for "ticket NN".

### 4. Quiz the user

Show the breakdown as a numbered list. For each ticket:

- **Title**: short descriptive name
- **Blocked by**: the tickets (if any) that must finish first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the user with AskUserQuestion, one question per call, recommended
answer first marked "(Recommended)":

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges right: does each ticket depend only on tickets
  that really gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

### 5. Write the tickets

Write one file per ticket under `docs/features/{slug}/tickets/<NN>-<slug>.md`,
numbered from `01` in dependency order (blockers first) — never one
combined file.

**Language = the docs language** (the language the user writes in, same as
warroom). Fixed tokens stay as-is: the file names, the template's labels
and headings, status values, `D{n}` ids, glossary terms, code identifiers.

Read [templates/ticket.md](templates/ticket.md) first, copy its skeleton,
and follow its rules.

Work the **frontier**: the tickets whose blockers are all done. A linear
chain runs top to bottom.

Before finishing, check that every **Blocked by** points only to
lower-numbered tickets, then run the self-check in
[markdown-style.md](../warroom/references/markdown-style.md) on every ticket
file against [templates/ticket.md](templates/ticket.md).

### 6. Hand off to the build

List the ticket files and the frontier (the tickets that can start now).
Then generate the **build prompt** from
[templates/build-prompt.md](templates/build-prompt.md): run its checks and
show the steps that apply, then one ready-to-paste **English** prompt for
`/warroom-build {slug} {first frontier ticket}` in a new session.

Leave the files uncommitted — the build prompt's first step commits them.
Do NOT edit spec.md; decisions.md gets only the conventions `D{n}`.
