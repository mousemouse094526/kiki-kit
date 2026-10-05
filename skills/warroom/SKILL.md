---
name: warroom
description: >-
  Plan one feature until the whole picture is clear and approved — documents
  only, no code. Interviews the user one question at a time (choices with a
  recommended answer), then writes the feature docs as markdown under
  docs/features/{slug}/: spec.md, decisions.md, flow.md, plus legal.md via
  the warroom-legal skill and glossary terms in CONTEXT.md, then has five
  red-team reviewer subagents (Advocate, Builder, Breaker, Tester, Skeptic)
  challenge the docs, then a Successor subagent sweeps decisions, legal
  findings, and spec constraints for ADR-worthy decisions and drafts them
  for docs/adr/. After the user approves at the gate,
  hands off to the warroom-tickets skill to split the docs into tickets —
  building, testing, and review are later skills that read these files.
  Invoke with /warroom, or whenever a feature needs its plan and docs laid
  out before anyone builds it.
---

# Warroom — plan one feature, on paper, until it's approved

Interview → docs → legal → red team → ADR sweep → one approval gate → tickets. Output: a docs folder a
stranger could build from.

## Per-project knobs — resolve once, before the interview

State them in one line before asking anything:

- **Docs home** — `docs/features/{slug}/` by default; if the project already
  keeps feature docs elsewhere, match that convention.
- **Glossary** — `CONTEXT.md` at the repo root. Created lazily on the first
  resolved term, never empty.
- **ADRs** — `docs/adr/`. Read the titles of existing ADRs now, and the
  full text of any that touch this feature.

## Re-opening a feature that already has docs

`docs/features/{slug}/spec.md` exists → this is a change, not a new plan.
Read the folder, then gather what sent the user back:

- `open-items.md` rows that are `open` with `Next: → /warroom`;
- trial findings in `trial/*.md` with Status `→ warroom`;
- a `docs/debug/` record with Status `spec gap → warroom`.

List them, then interview only on those items. Each answer is a new `D{n}`
(`From:` the item's source); skip straight to the gate's **Adjust** path —
warroom-legal and The Breaker on each new `D{n}` — instead of the full red
team. On Approve: set each source row's Status to `→ D{n}` (the trial
finding's and the debug record's too), then warroom-tickets re-cuts.

## Phase 1 — Interview, one question at a time

Ask with AskUserQuestion: ONE question per call, choices with your
recommended answer first, marked "(Recommended)".

- **Facts are your job, decisions are theirs.** Anything the codebase can
  answer, look up before asking. Only genuine decisions reach the user.
- **Walk the design tree in dependency order.** Ask the question whose
  answer unblocks the most next questions.
- **Sharpen the language as terms appear** (format and rules in
  [references/glossary.md](references/glossary.md)):
  - Term conflicts with `CONTEXT.md` → call it out immediately: "Glossary
    defines 'cancellation' as X, you seem to mean Y. Which?"
  - Vague or overloaded word → propose one precise term: "'account' — the
    Customer or the User?"
  - Relationship between concepts → probe it with invented edge-case
    scenarios until the boundary is precise.
  - User states how something works → check the code; surface any
    contradiction.
  - Term resolved → write it into `CONTEXT.md` right then, not batched.
- **Existing ADRs are facts.** Answer from them instead of asking. A
  choice that contradicts one → say so at once and ask: follow the ADR, or
  supersede it.
- Interview decisions land in this feature's decisions.md. Don't sort them
  into ADRs mid-interview — the sweep does that with the whole picture.
- **Record each decision the moment it lands** as a `D{n}` entry in the
  format of [templates/decisions.md](templates/decisions.md). Append-only,
  never renumber.
- Done when nothing is left silently assumed: a stranger with the spec
  would build the same thing.

Large feature → longer plan, no problem. Interview reveals several features
under one name → say so and propose the split: separate feature folders,
one warroom each.

## Phase 2 — Write the docs

**Docs language = the language the user writes in.** Thai prompts → Thai
docs. Keep fixed tokens as-is: file names, the `##` section headings of
spec.md and decisions.md, the field labels and Status / From words of
decisions.md, `D{n}` ids, glossary term names, code
identifiers, and verdict words (ALLOWED / NOT ALLOWED / CONDITIONAL).

One file per topic in `docs/features/{slug}/`. Read each template before
writing its file, copy its skeleton, and follow its rules:

| File | What it holds | Template |
|---|---|---|
| `decisions.md` | the why — every decision, its rejected options and reasons | [templates/decisions.md](templates/decisions.md) |
| `spec.md` | the what and how — problem, stories, outcome, implementation, seams, out of scope | [templates/spec.md](templates/spec.md) |
| `flow.md` | how it runs — mermaid diagrams drawn with the **mermaid-flow** skill (this plugin) | [templates/flow.md](templates/flow.md) |

Every doc also follows [references/markdown-style.md](references/markdown-style.md).

## Phase 2.5 — Legal check, every feature

Invoke the **warroom-legal** skill (this plugin) on the drafted feature. It
researches the governing law with web sources, rules each legally relevant
action ALLOWED / NOT ALLOWED / CONDITIONAL, and writes one `legal.md` into
the same folder in the docs language — or reports "no legal surface". Fold every CONDITIONAL
requirement into the spec's Implementation section. Run it before the gate.

## Phase 3 — Red team, every feature

Spawn five reviewers as separate subagents, in parallel, each with its own
checklist from [references/red-team.md](references/red-team.md):
**The Advocate** (end user), **The Builder** (implementer), **The Breaker**
(failure and abuse), **The Tester** (provability), **The Skeptic** (scope).
Label each subagent with its name. Give each only the docs — never another
reviewer's output.

Then merge the findings yourself, dropping duplicates:

- **Doc gap or contradiction with an obvious fix** → fix the docs.
- **Needs a decision** (including two reviewers pulling opposite ways) →
  ask the user with AskUserQuestion, recommended answer first; record it
  as a new `D{n}`.
- **Noise** (already answered, out of scope, pure taste) → dismiss.

Runs once per warroom. Another round only if the user asks for one.

## Phase 4 — ADR sweep, every feature

One question at a time, every decision looks local to the feature; which
ones reach beyond it only shows once the whole plan exists. So after the
red team merge, spawn one subagent, **The Successor** — the engineer who
builds the next feature here — with the prompt and criteria in
[references/adr.md](references/adr.md).

Then, yourself: drop candidates that fail a test or hit "Not an ADR",
merge candidates that are one decision, and draft each survivor (title +
1–3 sentences + `Source:`). Hold the drafts for the gate — no files yet.
A conflict with an existing ADR → ask the user with AskUserQuestion:
follow it or supersede it; record the answer as a new `D{n}`.

## The Gate — approve the plan

First run the self-check in
[references/markdown-style.md](references/markdown-style.md) on every file
this warroom wrote or changed — docs, ADR drafts, and `CONTEXT.md`. Then
show the whole picture in chat: the doc folder path, the decision list
(`D1: title` per line), the legal summary (verdict per item — ALLOWED /
NOT ALLOWED / CONDITIONAL with its requirements — or "no legal surface"),
the red team line (`Red team: x fixed, y decided (D7, D8), z dismissed`,
plus one line per BLOCKER and how it was resolved), the ADR block (each
draft in full, any conflict with an existing ADR and how it was decided —
or `ADR: none — {reason}`), and the rough build shape (modules touched,
estimated size). Then ask with AskUserQuestion: **Approve / Adjust**.

- **Adjust** → fold the changes into the docs — including cutting or
  rewording an ADR draft — and gate again. An adjustment that adds or
  changes a `D{n}` (more than ADR wording) skipped the red team: rerun
  warroom-legal on the items it touches, give that `D{n}` to The Breaker
  alone, fold the findings, re-check it against the ADR criteria, then
  gate again.
- **Approve** → the docs are done. Write each ADR draft to
  `docs/adr/NNNN-slug.md` ([templates/adr.md](templates/adr.md)) and set
  the `ADR` field of each source `D{n}` and its index row in decisions.md;
  self-check those files. Name the doc and ADR files in the reply, then
  invoke the **warroom-tickets** skill (this plugin) on this feature right
  away — it quizzes the user on the breakdown before writing anything.
  Stop after the tickets are written. Leave everything uncommitted —
  committing is the user's call.

A request for code at any point gets one sentence — this skill plans; a
build skill reads the approved spec — and the interview continues.

## Operating rules

- **No code, no exceptions.** Not a prototype, not a stub, not "just the
  schema".
- **The gate is the only exit.** Never present unapproved docs as finished.
- **Legal runs every time.** Never skip it on a hunch that nothing is risky.
- **Red team runs every time**, after legal, before the gate.
- **ADR sweep runs every time**, after the red team. "None" needs a reason.
- **Self-check before every gate**, and again after writing ADR files.
- **Every decision has a number.**
- **Docs and chat in the user's language**; fixed tokens stay as-is.
- **One feature per session.** A second feature gets its own warroom.
