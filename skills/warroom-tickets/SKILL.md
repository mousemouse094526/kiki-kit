---
name: warroom-tickets
description: >-
  Break an approved warroom feature into tracer-bullet tickets, each
  declaring the tickets that block it — one markdown file per ticket under
  docs/features/{slug}/tickets/. Reads the feature docs (spec.md,
  decisions.md, flow.md, legal.md) and CONTEXT.md, explores the codebase
  for prefactoring, drafts vertical slices, quizzes the user on
  granularity and blocking edges, and writes the tickets only after the
  user approves the breakdown. Ends with a ready-to-paste prompt for
  warroom-build, checked against the project (uncommitted docs, branch,
  services, test setup, conventions, reference notes and library
  versions, secrets, ticket size). No code. Warroom runs it right after its
  approval gate; also runs standalone as /warroom-tickets {slug}.
---

# Warroom Tickets

Adapted from Matt Pocock's `to-tickets`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT). Same
process; the source is a warroom feature folder and the tracker is local
files beside it.

Break the approved feature into a set of **tickets**: tracer-bullet
vertical slices, each declaring the tickets that **block** it.

## Process

### 1. Gather context

Work from the feature folder: `docs/features/{slug}/` (or wherever warroom
put it). Called from warroom → it's the feature just approved. Standalone
without a slug → list the feature folders and ask which.

Read `spec.md`, `decisions.md`, `flow.md`, `legal.md`, and `CONTEXT.md` in
full. No `spec.md` → stop and tell the user to run `/warroom` first.

`tickets/` already exists → ask: re-cut the tickets not yet `done`, or
stop. A re-cut **renumbers every ticket that is not `done`** in dependency
order after the `done` ones — a new blocker never gets a higher number than
the tickets it blocks. Update every reference to a renumbered ticket.
Fold every `open` row in `open-items.md` whose Next is `→
/warroom-tickets` into the new cut, and set its Status to `→ ticket NN`.

### 2. Explore the codebase

If you have not already explored the codebase, do so to understand the
current state of the code. Ticket titles and descriptions use the
`CONTEXT.md` glossary vocabulary and respect the feature's `D{n}`
decisions and any ADRs in the area you're touching.

**Conventions first.** Read the project's conventions for every area the
spec touches — `CLAUDE.md`, `.claude/rules/`, its conventions skill under
`.claude/skills/` (see warroom-build's
[conventions.md](../warroom-build/references/conventions.md)). An area with
code planned but no conventions → set them up now, before slicing: propose
the folder structure, layers, and testing stack (runner, and the e2e tool
and its location when the spec has `(e2e)` seams), get the user's OK with
AskUserQuestion,
write the project skill from
[conventions-skill.md](../warroom-build/templates/conventions-skill.md), and
record it as a `D{n}`. Tickets are then cut against that structure, so no
build invents one and no prefactor ticket appears later out of order.

Look for opportunities to prefactor the code to make the implementation
easier — including existing code that doesn't match the conventions.
"Make the change easy, then make the easy change." Prefactor tickets are
numbered first.

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema,
  API, UI, tests): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each ticket its **blocking edges**: the other tickets that must
complete before it can start. A ticket with no blockers can start
immediately.

**Wide refactors are the exception to vertical slicing.** A **wide
refactor** is one mechanical change (rename a column, retype a shared
symbol) whose **blast radius** fans across the whole codebase, so no
vertical slice can land green. Sequence it as **expand–contract**: expand
(add the new form beside the old; blocked by nothing), migrate call sites
in batches sized by blast radius (each its own ticket, blocked by the
expand), contract (delete the old form; blocked by every migrate batch).

**Warroom addition — cover the docs.** Before the quiz, check every User
Story, every Seam, and every CONDITIONAL requirement in `legal.md` lands in
at least one ticket's acceptance criteria, and nothing from Out of Scope
does. Every `(e2e)` seam lands in the ticket that completes its flow — the
first ticket where every page and app it crosses exists — as acceptance
criteria tagged `(e2e)`. The first such ticket also sets up the e2e
package if the project has none. A gap the docs don't answer is a missing decision: say so and send
it back to warroom instead of guessing.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the user with AskUserQuestion, one question per call, recommended
answer first marked "(Recommended)":

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on tickets
  that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

### 5. Write the tickets

Write one file per ticket under `docs/features/{slug}/tickets/<NN>-<slug>.md`,
numbered from `01` in dependency order (blockers first). One ticket per
file, never a single combined file.

**Language = the docs language** (the language the user writes in, same as
warroom). Fixed tokens stay as-is: the file names, the template's labels
and headings, status values, `D{n}` ids, glossary terms, code identifiers.

Read [templates/ticket.md](templates/ticket.md) before writing, copy its
skeleton, and follow its rules.

Work the **frontier**: any ticket whose blockers are all done. For a
purely linear chain that means top to bottom.

Before finishing, check that every **Blocked by** points only to
lower-numbered tickets, then run the self-check in
[markdown-style.md](../warroom/references/markdown-style.md) on every ticket
file against [templates/ticket.md](templates/ticket.md).

### 6. Hand off to the build

List the ticket files and the frontier (the tickets that can start now).
Then generate the **build prompt** from
[templates/build-prompt.md](templates/build-prompt.md): run its checks on
the project — uncommitted docs, branch, services, test setup,
conventions, reference notes and versions, secrets, ticket size — and show the steps that apply followed by one
ready-to-paste **English** prompt for `/warroom-build {slug} {first frontier ticket}` in
a new session.

Leave the files uncommitted — the build prompt's first step commits them.
Do NOT edit spec.md or decisions.md.
