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
  the gate and goes to warroom-tickets. A plan too big for one session is
  charted as a map (docs/features/{slug}/map.md) and resolved over several
  sessions first. Also re-opens an existing feature
  for the items routed back to it in open-items.md. Invoke with /warroom,
  or whenever a feature needs its plan laid out before anyone builds it.
---

# Warroom — plan one feature, on paper, until nothing is left to decide

Interview → docs → legal → red team → ADR sweep → gate → tickets. Output: a
docs folder a stranger could build from **without asking anything**.

**Why the bar is that high:** any question the plan leaves open gets asked
later, mid-build, with no red team or legal check behind the answer. So the
spec carries an honest `## Open Questions` list and a `Status`, and nothing
builds from a `draft`.

## Per-project knobs — resolve once, before the interview

State them in one line before asking anything:

- **Docs home** — `docs/features/{slug}/`, unless the project already keeps
  feature docs elsewhere; then match that.
- **Glossary** — `CONTEXT.md` at the repo root. Create it on the first
  resolved term, never empty.
- **ADRs** — `docs/adr/`. Read the titles of existing ADRs now, and the
  full text of any that touch this feature.

## Map mode — too big for one session

About five or more open decisions, whose answers will raise questions you
can't phrase yet → chart a map instead of interviewing until the context
runs out: [references/map.md](references/map.md). Session one charts and
stops; later sessions resolve it one question at a time. `/warroom {slug}`
on a folder with an unfinished `map.md` continues the map.

## Re-opening a feature

**A pivot is a new feature.** If what is being built turned into something
else, start a new feature folder whose spec says it supersedes the old one.
Never rewrite one spec through three products.

`docs/features/{slug}/spec.md` exists → this is a change, not a new plan:

1. Set the spec back to `draft` while it changes.
2. Read the folder and its `open-items.md`. The agenda is the rows that are
   `open` with `Next: → /warroom`, plus the spec's own Open Questions.
   Interview only on those.
3. Record each answer as a new `D{n}` (`From: open-items #{n}`).
4. Run warroom-legal on the items it touches (it updates those verdicts in
   legal.md and keeps the rest).
5. Give it to The Breaker alone instead of the full red team, then go to
   the gate.
6. On Approve, set each row's Status to `→ D{n}`, or `done (docs fixed)`
   when only the docs needed correcting; warroom-tickets re-cuts.

## Phase 1 — Interview, one question at a time

Ask with AskUserQuestion: ONE question per call, choices with your
recommended answer first, marked "(Recommended)".

- **Facts are your job, decisions are theirs.** Look up anything the
  codebase, the ADRs, or a library's docs can answer. Only real decisions
  reach the user.
- **Walk the design tree in dependency order.** Ask the question whose
  answer unblocks the most next questions.
- **Sharpen the language as terms appear** (format and rules in
  [references/glossary.md](references/glossary.md)):
  - call out a term that conflicts with `CONTEXT.md`;
  - propose one precise word for a vague one;
  - probe relationships with invented edge cases;
  - check the code when the user says how something works.

  Write a resolved term into `CONTEXT.md` right then.
- **Existing ADRs are facts.** A choice that contradicts one → say so at
  once and ask: follow the ADR, or supersede it.
- **Record each decision the moment it lands** as a `D{n}` in
  [templates/decisions.md](templates/decisions.md) — if the session dies,
  only what is written survives. Append-only, never renumber. Don't sort
  them into ADRs yet; the sweep does that.
- **Make it checkable.** Push "fast", "secure", "simple" until each is a
  number, a scenario, or a named threat. A requirement nothing could ever
  fail is not a requirement — make it checkable or drop it.
- **Ask about the qualities nobody brought up** — speed under load,
  behaviour when a dependency is down, who may see the data, how it is run
  once live. Pick the two or three this feature actually stresses; skip the
  rest.
- **Never supply a why you weren't given.** Record a decision that came
  without its reason as `rationale not recorded`, and make the reason the
  next question. A guessed reason reads as fact six months on.
- **Words run out → sketch.** When talk stops settling how something should
  look or behave, make something rough to react to — a state table, a text
  mockup, a sample request and response. Save it in the feature folder and
  link it from the `D{n}` it settled. It is argued with, never shipped.
- **A question the user can't answer yet** goes into spec.md › Open
  Questions, never into a guess.

The interview shows several features under one name → propose the split:
separate feature folders, one warroom each.

## Phase 2 — Write the docs

Docs are in the user's language; fixed tokens stay in English (the list is
in [references/markdown-style.md](references/markdown-style.md) ›
Language).

| File | What it holds | Template |
|---|---|---|
| `decisions.md` | the why — every decision, its rejected options and reasons | [templates/decisions.md](templates/decisions.md) |
| `spec.md` | the what and how — and its Status and Open Questions | [templates/spec.md](templates/spec.md) |
| `flow.md` | how it runs — mermaid diagrams drawn with the **mermaid-flow** skill (this plugin) | [templates/flow.md](templates/flow.md) |

Read each template before writing its file. Every doc follows
[references/markdown-style.md](references/markdown-style.md).

The spec names what a builder would otherwise have to ask:

- the seams;
- the **Library assumptions** — each library behaviour the plan needs,
  linked to the doc page of the installed version (`llms.txt` first);
- the **Testing decisions** — the existing tests to copy, by path.

Anything you can't fill in is an Open Question.

## Phase 2.5 — Legal check

Invoke the **warroom-legal** skill (this plugin) on the drafted feature. It
writes `legal.md` or reports "no legal surface". Fold every CONDITIONAL
requirement into the spec's Implementation. Run it every time — don't guess
at risk.

## Phase 3 — Red team

Spawn five reviewers as separate subagents, in parallel, each with its
checklist from [references/red-team.md](references/red-team.md): **The
Advocate**, **The Builder**, **The Breaker**, **The Tester**, **The
Skeptic**. Each gets only the docs, never another reviewer's output.

Merge the findings yourself and drop duplicates:

- **Doc gap with an obvious fix** → fix the docs.
- **Needs a decision** → ask the user now and record a `D{n}`. If the user
  wants to wait → an Open Question.
- **Noise** (already answered, out of scope, pure taste) → dismiss.

Runs once per warroom.

## Phase 4 — ADR sweep

Only once the whole plan exists can you see which decisions reach beyond
this feature. Spawn one subagent, **The Successor** — the engineer who
builds the next feature here — with [references/adr.md](references/adr.md).
Then:

- drop candidates that fail its tests and merge duplicates;
- draft each survivor (title + 1–3 sentences + `Source:`) and hold the
  drafts for the gate;
- a conflict with an existing ADR → ask: follow it or supersede it; record
  a `D{n}`.

## The Gate

Run the self-check in
[references/markdown-style.md](references/markdown-style.md) on every file
this run wrote. Then show in chat:

- the folder path;
- the decision list (`D1: title` per line);
- the legal summary;
- the red team line (`x fixed, y decided (D7, D8), z dismissed`), plus each
  BLOCKER and how it was resolved;
- the ADR drafts;
- the **Open Questions**;
- the rough build shape.

Ask with AskUserQuestion:

- **Approve** — offered only when Open Questions is empty, or every entry
  says why it doesn't block building. Set the spec's Status to
  `ready-to-build`, write the ADRs to `docs/adr/NNNN-slug.md`
  ([templates/adr.md](templates/adr.md)) and their `ADR` field in
  decisions.md, self-check those files, then invoke **warroom-tickets**
  (this plugin) right away.
- **Adjust** — fold the change into the docs and gate again. A new or
  changed `D{n}` skipped the red team: first run warroom-legal on what it
  touches and give it to The Breaker alone.
- **Stop as draft** — the spec stays `draft`. End with a prompt to paste
  in a new session: `/warroom {slug}` plus the open questions, numbered.

Leave everything uncommitted — committing is the user's call.

## Operating rules

- **No code** — not a prototype, a stub, or "just the schema". A sketch is
  a table or text, never something that runs. A request for code gets one
  sentence: this skill plans; the build reads the approved spec.
- **Nothing leaves as `ready-to-build` with a blocking question in it.**
- **Legal, red team, and ADR sweep run every time.** "No ADR" needs a
  reason.
- **Every decision has a number.**
- **One feature per session.**
