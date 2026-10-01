---
name: warroom-tickets
description: >-
  Break an approved warroom feature into tracer-bullet tickets, each
  declaring the tickets that block it — one markdown file per ticket under
  docs/features/{slug}/tickets/. Reads the feature docs (spec.md,
  decisions.md, flow.md, legal.md) and CONTEXT.md, explores the codebase
  for prefactoring, drafts vertical slices, quizzes the user on
  granularity and blocking edges, and writes the tickets only after the
  user approves the breakdown. No code. Warroom runs it right after its
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
stop.

### 2. Explore the codebase

If you have not already explored the codebase, do so to understand the
current state of the code. Ticket titles and descriptions use the
`CONTEXT.md` glossary vocabulary and respect the feature's `D{n}`
decisions and any ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation
easier. "Make the change easy, then make the easy change."

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
does. A gap the docs don't answer is a missing decision: say so and send
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

Finish by listing the ticket files and the frontier (the tickets that can
start now). Leave the files uncommitted. Do NOT edit
spec.md or decisions.md.
