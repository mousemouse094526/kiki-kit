---
name: warroom
description: >-
  Plan one feature until nothing is left to decide — documents only, no
  code. Interviews the user one question at a time (choices with a
  recommended answer), writes the feature docs as markdown under
  docs/features/{slug}/ (spec.md, decisions.md, flow.md, legal.md via the
  warroom-legal skill, glossary terms in CONTEXT.md), has five red-team
  subagents (Advocate, Builder, Breaker, Tester, Skeptic) challenge them,
  and has a Successor subagent draft ADRs for docs/adr/. The spec stays
  `draft` while it has Open Questions; only a `ready-to-build` spec passes
  the gate and goes to warroom-tickets. Also re-opens an existing feature
  for the items routed back to it in open-items.md. Invoke with /warroom,
  or whenever a feature needs its plan laid out before anyone builds it.
---

# Warroom — plan one feature, on paper, until nothing is left to decide

Interview → docs → legal → red team → ADR sweep → gate → tickets. Output: a
docs folder a stranger could build from **without asking anything**.

**Why the bar is that high:** every question the plan leaves open gets
asked later, by a build session that is halfway through code, with a tired
context, and with no red team or legal check behind its answer. Fog that
leaves this skill turns into rework. So the spec carries an honest
`## Open Questions` list and a `Status`, and nothing builds from a `draft`.

## Per-project knobs — resolve once, before the interview

State them in one line before asking anything:

- **Docs home** — `docs/features/{slug}/` by default; if the project already
  keeps feature docs elsewhere, match that convention.
- **Glossary** — `CONTEXT.md` at the repo root. Created lazily on the first
  resolved term, never empty.
- **ADRs** — `docs/adr/`. Read the titles of existing ADRs now, and the
  full text of any that touch this feature.

## Re-opening a feature

`docs/features/{slug}/spec.md` exists → this is a change, not a new plan.
Read the folder and its `open-items.md`; the rows that are `open` with
`Next: → /warroom` are the agenda, plus the spec's own Open Questions.
Interview only on those. Each answer is a new `D{n}` (`From:` the row's
source); then run warroom-legal on what it touches and give it to The
Breaker alone instead of the full red team, and go to the gate. On Approve,
set each row's Status to `→ D{n}`; warroom-tickets re-cuts.

## Phase 1 — Interview, one question at a time

Ask with AskUserQuestion: ONE question per call, choices with your
recommended answer first, marked "(Recommended)".

- **Facts are your job, decisions are theirs.** Anything the codebase, the
  ADRs, or a library's docs can answer, look up before asking. Only
  genuine decisions reach the user.
- **Walk the design tree in dependency order.** Ask the question whose
  answer unblocks the most next questions.
- **Sharpen the language as terms appear** (format and rules in
  [references/glossary.md](references/glossary.md)): call out a term that
  conflicts with `CONTEXT.md`, propose one precise word for a vague one,
  probe relationships with invented edge cases, check the code when the
  user says how something works. Write a resolved term into `CONTEXT.md`
  right then.
- **Existing ADRs are facts.** A choice that contradicts one → say so at
  once and ask: follow the ADR, or supersede it.
- **Record each decision the moment it lands** as a `D{n}` in
  [templates/decisions.md](templates/decisions.md) — a session that dies
  with decisions only in its head leaves nothing behind. Append-only, never
  renumber. Don't sort them into ADRs yet; the sweep does that.
- **Make it checkable.** "Fast", "secure", "simple" are placeholders: push
  until each is a number, a scenario, or a named threat.
- **A question the user can't answer yet** goes into spec.md › Open
  Questions, never into a guess.

Interview reveals several features under one name → propose the split:
separate feature folders, one warroom each.

## Phase 2 — Write the docs

Docs are in the user's language; fixed tokens (file names, `##` headings,
field labels, status words, `D{n}`, glossary term names, code identifiers,
verdict words) stay as they are.

| File | What it holds | Template |
|---|---|---|
| `decisions.md` | the why — every decision, its rejected options and reasons | [templates/decisions.md](templates/decisions.md) |
| `spec.md` | the what and how — and its Status and Open Questions | [templates/spec.md](templates/spec.md) |
| `flow.md` | how it runs — mermaid diagrams drawn with the **mermaid-flow** skill (this plugin) | [templates/flow.md](templates/flow.md) |

Read each template before writing its file. Every doc follows
[references/markdown-style.md](references/markdown-style.md).

The spec names what a builder would otherwise have to ask: the seams,
the **Library assumptions** (each behaviour the plan needs from a library,
linked to the doc page of the installed version — `llms.txt` first), and
the **Testing decisions** (the existing tests to copy, by path). Anything
you can't fill in is an Open Question.

## Phase 2.5 — Legal check

Invoke the **warroom-legal** skill (this plugin) on the drafted feature. It
writes `legal.md` or reports "no legal surface". Fold every CONDITIONAL
requirement into the spec's Implementation. Runs every time — risk is not
something to guess.

## Phase 3 — Red team

Spawn five reviewers as separate subagents, in parallel, each with its
checklist from [references/red-team.md](references/red-team.md): **The
Advocate**, **The Builder**, **The Breaker**, **The Tester**, **The
Skeptic**. Each gets only the docs — never another reviewer's output.

Merge the findings yourself, dropping duplicates:

- **Doc gap with an obvious fix** → fix the docs.
- **Needs a decision** → ask the user now; record a `D{n}`. The user wants
  to wait → an Open Question.
- **Noise** (already answered, out of scope, pure taste) → dismiss.

Runs once per warroom.

## Phase 4 — ADR sweep

Which decisions reach beyond this feature only shows once the whole plan
exists. Spawn one subagent, **The Successor** — the engineer who builds the
next feature here — with [references/adr.md](references/adr.md). Drop
candidates that fail its tests, merge duplicates, and draft each survivor
(title + 1–3 sentences + `Source:`). Hold the drafts for the gate. A
conflict with an existing ADR → ask: follow it or supersede it; record a
`D{n}`.

## The Gate

Run the self-check in
[references/markdown-style.md](references/markdown-style.md) on every file
this run wrote. Then show in chat: the folder path, the decision list
(`D1: title` per line), the legal summary, the red team line (`x fixed, y
decided (D7, D8), z dismissed`, plus each BLOCKER and how it was resolved),
the ADR drafts, the **Open Questions**, and the rough build shape.

Ask with AskUserQuestion:

- **Approve** — offered only when Open Questions is empty, or every entry
  says why it doesn't block building. Set the spec's Status to
  `ready-to-build`, write the ADRs to `docs/adr/NNNN-slug.md`
  ([templates/adr.md](templates/adr.md)) and their `ADR` field in
  decisions.md, self-check those files, then invoke **warroom-tickets**
  (this plugin) right away.
- **Adjust** — fold the change into the docs and gate again. A new or
  changed `D{n}` skipped the red team: run warroom-legal on what it
  touches and give it to The Breaker alone first.
- **Stop as draft** — the spec stays `draft`. End with a prompt to paste
  in a new session: `/warroom {slug}` plus the open questions, numbered.

Leave everything uncommitted — committing is the user's call.

## Operating rules

- **No code**, not a prototype, not a stub, not "just the schema". A
  request for code gets one sentence: this skill plans; the build reads the
  approved spec.
- **Nothing leaves as `ready-to-build` with a blocking question in it.**
- **Legal, red team, and ADR sweep run every time.** "No ADR" needs a
  reason.
- **Every decision has a number.**
- **One feature per session.**
