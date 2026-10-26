---
name: warroom
description: >-
  Plan one feature on paper until nothing is left to decide, then cut it
  into 2–4 big tickets — documents only, no code. Interview,
  spec/decisions/flow docs, Thai-law check, red team, ADR sweep, approval
  gate; checks docs/decisions.md and docs/adr/ so nothing already decided
  is asked again.
  Modes: /warroom [slug] (new plan, map, change request, Blocked rows);
  /warroom legal {items or slug} (Thai-law check only, not legal advice);
  /warroom tickets {slug} (re-cut). Use with /warroom, or whenever a
  feature needs its plan laid out before anyone builds it.
---

# Warroom — plan one feature, on paper, until nothing is left to decide

Interview → docs → legal → red team → ADR sweep → gate → tickets. Output:
a docs folder a stranger could build from **without asking anything**, cut
into a few big tickets.

**Modes:**

- `/warroom` or `/warroom {slug}` — plan a feature; continue a map; or
  re-open a feature for a change request or its `open` Blocked rows.
- `/warroom legal {items or slug}` — only the legal check, standalone:
  [references/legal.md](references/legal.md).
- `/warroom tickets {slug}` — only the ticket cut (a re-cut):
  [references/tickets.md](references/tickets.md).

The spec carries an honest `## Open Questions` list and a `Status`.
Nothing builds from a `draft`.

## Where things live

| Path | Holds |
|---|---|
| `docs/decisions.md` | every decision in the project, one line each, by subject ([template](templates/decisions-index.md)) |
| `docs/adr/` | the rules every feature must follow, one short file each ([references/adr.md](references/adr.md)) |
| `docs/features/{slug}/` | what the feature is: spec, decisions, flow, legal, sketches |
| `docs/progress/board.md` | where every feature stands, one row each ([template](templates/board.md)) |
| `docs/progress/{slug}/` | the work in flight: map, tickets, `progress.md`, user trials, bugs |
| `CONTEXT.md` | the glossary, at the repo root; created on the first resolved term, never empty |

The project keeps feature docs somewhere else already → match that, same
split. An older layout (progress or tickets inside `features/{slug}/`, or
no `docs/decisions.md` while features exist) →
[references/migrate.md](references/migrate.md) before anything else.

## Before the first question

1. **Read the ADR titles** in `docs/adr/`, and the full text of any that
   touch this feature.
2. **Read `docs/decisions.md`**: every row under a subject this feature
   touches. Open the full entry of any row a question may turn on. ADRs
   and these rows are facts, not options.
3. **Read the board.** The feature already has a row → this is a re-open
   (below), not a new plan. Another feature in `planning` or `building`
   covers the same ground → say so and ask whether this belongs inside it.
4. State in one line what you read and where the docs will go.

## Map mode — too big for one session

About five or more open decisions, whose answers will raise questions you
can't phrase yet → chart a map: [references/map.md](references/map.md).
Session one charts and stops; later sessions resolve it one question at a
time. `/warroom {slug}` on a feature with an unfinished
`docs/progress/{slug}/map.md` continues the map.

## One feature, or a new one?

**Default: grow the feature you have.** A change to an existing area is a
change request on that feature, even after it shipped. Start a new
feature only when:

- the work has its own users or its own data, and could ship and be used
  on its own; or
- it is a **pivot** — what was built turned into something else. The new
  spec says it supersedes the old one. Never rewrite one spec through
  three products.

The interview shows two such things under one name → propose the split.
Otherwise keep it one feature and let the tickets carry the size.

## Re-opening a feature

`docs/features/{slug}/spec.md` exists → a change request or its Blocked
rows, not a new plan: follow [references/reopen.md](references/reopen.md).

## Phase 1 — Interview, one question at a time

Ask with AskUserQuestion: ONE question per call, choices with your
recommended answer first, marked "(Recommended)".

- **Check the index before every question.** Look under the subject in
  `docs/decisions.md`. Decided there → don't ask: cite it in the spec
  (`(user-contact D4)`), add this feature to its row's **Used by**, tell
  the user in one line that you're reusing it, and move on — no new
  `D{n}`, no copy. Ask only when this feature has a
  concrete reason to differ; then it is follow-or-supersede (below).
- **Facts are your job, decisions are theirs.** Look up anything the
  codebase, the index, or a library's docs can answer. Only real decisions
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
- **Contradicting a decision already made** — this feature's, another
  feature's, or an ADR → say so at once, name it (`user-contact D4`,
  `ADR-0004`), and ask: follow it, or supersede it. Superseding is a new
  `D{n}` here that names the old one; the old entry's Status, in its
  feature file and in the index, becomes `superseded by {this slug} D{n}`.
  The old row has Used by or an ADR → follow
  [templates/decisions-index.md](templates/decisions-index.md) › Changing
  a decision someone uses — the only edit warroom makes in another
  feature's folder.
- **Record each decision the moment it lands** — the `D{n}` in
  [templates/decisions.md](templates/decisions.md), then its row in
  `docs/decisions.md` under its subject. Append-only, never renumber. ADRs
  come later, in the sweep.
- **Make it checkable.** Push "fast", "secure", "simple" until each is a
  number, a scenario, or a named threat. Can't be made checkable → drop
  it.
- **Ask about the qualities nobody brought up** — speed under load,
  behaviour when a dependency is down, who may see the data, how it is run
  once live. Pick the two or three this feature actually stresses; skip the
  rest.
- **Screens → ask for the design once.** The feature has UI and no ADR
  names a design source → ask: a Figma link, images, or none yet. None
  yet → ask: follow the existing components and conventions
  (Recommended), sketch the screens now, or wait for a design (an Open
  Question that blocks the UI tickets). Record a `D{n}`; fill spec ›
  Design. One design source for the whole project → an ADR candidate.
- **Never supply a why you weren't given.** Record a decision that came
  without its reason as `rationale not recorded`, and make the reason the
  next question.
- **Words run out → sketch.** When talk stops settling how something should
  look or behave, make something rough to react to — a state table, a text
  mockup, a sample request and response. Save it in the feature folder and
  link it from the `D{n}` it settled. Never ship it.
- **A question the user can't answer yet** goes into spec.md › Open
  Questions, never into a guess.

## Phase 2 — Write the docs

Docs are in the user's language; fixed tokens stay in English (the list is
in [references/markdown-style.md](references/markdown-style.md) ›
Language). They go in `docs/features/{slug}/`:

| File | What it holds | Template |
|---|---|---|
| `decisions.md` | the why — every decision, its rejected options and reasons | [templates/decisions.md](templates/decisions.md) |
| `spec.md` | the what and how — and its Status and Open Questions | [templates/spec.md](templates/spec.md) |
| `flow.md` | how it runs — mermaid diagrams drawn with the **mermaid-flow** skill (this plugin) | [templates/flow.md](templates/flow.md) |

Read each template before writing its file. Every doc follows
[references/markdown-style.md](references/markdown-style.md). Add or update
the feature's board row: Stage `planning` (or `mapping` for a map).

The spec names what a builder would otherwise have to ask:

- the seams;
- the **Library assumptions** — each library behaviour the plan needs,
  linked to the doc page of the installed version (`llms.txt` first);
- the **Testing decisions** — the existing tests to copy, by path.

Anything you can't fill in is an Open Question.

## Phase 2.5 — Legal check

Follow [references/legal.md](references/legal.md) on the drafted feature.
It writes `legal.md` or reports "no legal surface". Fold every CONDITIONAL
requirement into the spec's Implementation. Run it every time.

Every verdict marked `UNVERIFIED` goes into spec.md › Open Questions as
blocking. It closes when a re-run cites a source, or when the user
accepts the risk at the gate — recorded as a `D{n}` with
**Accepted risk**.

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

Spawn one subagent, **The Successor** — the engineer who builds the next
feature here — with [references/adr.md](references/adr.md), plus every
decision this feature reused from another one (each is a candidate). Then:

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
- the decision list (`D1: title` per line), and the decisions reused from
  other features;
- the legal summary, each `UNVERIFIED` verdict named;
- the red team line (`x fixed, y decided (D7, D8), z dismissed`), plus each
  BLOCKER and how it was resolved;
- the ADR drafts;
- the **Open Questions**;
- the rough build shape.

Ask with AskUserQuestion:

- **Approve** — offered only when Open Questions is empty, or every entry
  says why it doesn't block building. Set the spec's Status to
  `ready-to-build`, write the ADRs to `docs/adr/NNNN-slug.md`
  ([templates/adr.md](templates/adr.md)) and each source row's ADR column
  in `docs/decisions.md`, self-check those files, then go straight to
  **Phase 5**. Context already long
  (a map, many red-team rounds) → instead end with `/warroom tickets
  {slug}` to paste in a new session, and that as the board row's Next.
- **Adjust** — fold the change into the docs and gate again. A new or
  changed `D{n}` skipped the red team: first run the legal check on what it
  touches and give it to The Breaker alone.
- **Stop as draft** — the spec stays `draft`. The board row's Left gives
  the number of open questions and Next is `/warroom {slug}`; end with that
  command plus the open questions, numbered.

## Phase 5 — Cut the tickets

Follow [references/tickets.md](references/tickets.md): conventions where
missing, **2–4 big vertical tickets**, `progress.md`, the board row, and
the hand-off ending with `/warroom-build {slug} 01`.

Leave everything uncommitted; the hand-off gives the commit command.

## End of every session

The board row for this feature is true, and the last thing in chat is its
Next command in its own code block. Only this feature's next step.

## Operating rules

- **No code** — not a prototype, a stub, or a migration. A sketch is a
  table or text, never something that runs. A schema appears only inside
  spec.md, and only when the schema itself is the decision. A request for
  code gets one sentence: this skill plans; the build reads the approved
  spec.
- **Never ask what the index already answers.**
- **Nothing leaves as `ready-to-build` with a blocking question in it.**
- **Legal, red team, and ADR sweep run every time.** "No ADR" needs a
  reason.
- **Every decision has a number and an index row.**
- **One feature per session.**
