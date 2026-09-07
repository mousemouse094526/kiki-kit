---
name: warroom
description: >-
  Take one feature from idea to committed code in a single session, with the
  whole picture agreed before any code exists. Interviews the user one
  question at a time (choices with a recommended answer), writes the feature
  docs as markdown (spec.md, decisions.md, flow.md under docs/features/{slug}/
  plus glossary terms in CONTEXT.md), then builds ONLY after the user approves
  the docs, on a fresh feature branch, and commits ONLY after the user
  approves the built result. Code only — tests and review belong to separate
  skills that read the spec and flow afterwards. Invoked explicitly as
  /warroom.
disable-model-invocation: true
---

# Warroom — one session, one feature

Plan the whole feature out loud, get it approved, build exactly that, get the
build approved, commit. Everything happens here: no handoff prompt, no second
session, no "go run another skill". The user's two OKs are the only doors —
nothing is built before the first, nothing is committed before the second.

This skill is self-contained. It never invokes or depends on skills outside
this plugin — testing and code review are deliberately NOT here: a later
skill reads `spec.md` and `flow.md` and generates test cases from them, and
review is its own pass. Building those into this session would spend the
context the build itself needs.

## Per-project knobs — resolve once, before the interview

State the resolved knobs in one line before asking anything, so the user can
correct a bad guess while it is still free:

- **Checks** — the project's real lint and typecheck commands, read from
  `package.json` scripts (or Makefile, pyproject.toml, CI config). Written
  below as `<lint>` / `<typecheck>`. A project may have only one, or neither
  — record which exist. No test command is needed; tests are out of scope.
- **Docs home** — `docs/features/{slug}/` by default; if the project already
  keeps feature docs elsewhere, match that convention instead and read no
  further about paths.
- **Branch style** — `feature/{slug}` by default; copy the repo's own pattern
  if `git branch -a` shows one (e.g. `feat/…`).
- **Glossary** — `CONTEXT.md` at the repo root. Create it lazily, on the
  first resolved term, never empty.

## Phase 1 — Interview, one question at a time

Ask with AskUserQuestion: ONE question per call, choices with your
recommended answer first and marked "(Recommended)". The user is here to
react and decide, not to author from scratch — a question without a
recommendation pushes the authoring back onto them.

- **Facts are your job, decisions are theirs.** Anything the codebase can
  answer (what's in the stack, how the existing module works, which pattern
  the repo already uses), look up before asking — a grep costs nothing, the
  user's attention is the scarce resource. Only genuine decisions reach them.
- **Walk the design tree in dependency order.** Ask the question whose answer
  unblocks the most next questions. A question that depends on an unanswered
  one is not ready to ask.
- **Challenge fuzzy terms as they appear.** When the user says "account" and
  the code has both Customer and User, stop and pin the word before building
  on it. A resolved term goes into `CONTEXT.md` immediately — batching
  glossary updates is how they get lost.
- **Record each decision the moment it lands** as a `D{n}` entry (see
  decisions.md format below). Append-only, never renumber — later phases
  cite these numbers.
- The interview is done when nothing is left silently assumed: you could
  hand the spec to a stranger and they'd build the same thing.

**Too big for one session?** If mid-interview the feature is clearly several
features wearing one name, say so and propose the split — smaller features,
one warroom session each. Do not push on: a session that runs out of context
mid-build is worse than two honest sessions.

## Phase 2 — Write the docs

All docs are **English**, always — chat stays in the conversation's language,
but the files outlive the conversation and other skills read them.
One file per topic in `docs/features/{slug}/`:

**`decisions.md`** — the why. Every decision from the interview, short:

```markdown
## D1: Redis holds OTP state
Chosen over a DB table (slower, needs cleanup job) and JWT (cannot revoke).
Redis is already in the stack and TTL handles expiry for free.
```

3–5 lines each. The rejected options and the reason are the payload — the
choice alone can be read from the code later, the why cannot.

**`spec.md`** — the what and how. Structure (drop empty sections):

```markdown
# Spec: {feature}
## Problem        — from the user's perspective
## Solution       — from the user's perspective
## User Stories   — numbered "As a…, I want…, so that…"
## Implementation — modules touched, interfaces, schema/API contracts;
                    cite decisions as (D1), (D2) instead of retelling them
## Seams          — the public boundaries where behaviour is observable;
                    the future test skill reads this section
## Out of Scope   — what this feature deliberately does not do
```

No file paths or code snippets in the spec — they go stale fast. The
exception: a snippet that IS the decision (a state machine, a schema) may be
inlined where prose would be less precise.

**`flow.md`** — how it runs: mermaid diagram(s) with a one-line caption each.
Keep each diagram to one question and ~10 nodes; if the mermaid-flow skill is
installed its rules apply, but do not block on it.

## Gate 1 — OK before any code

Show the user the whole picture in chat: the doc folder path, the decision
list (`D1: title` per line), and what will be built — modules, rough size,
the branch name. Then ask with AskUserQuestion: **Build / Adjust**.

- **Adjust** → fold the changes into the docs and gate again.
- **Build** → only then continue. Nothing below this line happens without it,
  and asking for code mid-interview does not skip the gate — the answer is
  "the docs come first", one sentence, no negotiation. The gate is what
  guarantees the user has seen the whole picture before anything exists.

## Phase 3 — Build

1. `git checkout -b feature/{slug}` (the branch-style knob) — one feature,
   one branch; the user decides later where it merges.
2. Write the code the spec describes — **code only, no tests**. The spec is
   the contract: a better idea discovered mid-build is a new `D{n}` entry and
   a one-line heads-up to the user, not a silent detour.
3. Run `<lint>` and `<typecheck>` (whichever exist). Fix until clean — a
   summary written on top of red checks hands the user broken code with a
   bow on it.

## Gate 2 — OK before commit

Summarise in chat: files created/changed (one line each), which `D{n}` each
change traces to, check results, and anything the user should look at by eye.
Then ask: **Commit / Fix first**. On OK, commit everything from this session
— docs, CONTEXT.md, code — to the feature branch with a conventional message.
Never commit before the OK; never push unless asked.

## Operating rules

- **Two gates, no exceptions.** Docs before code, OK before build, OK before
  commit. The moment a gate becomes negotiable it stops guaranteeing
  anything.
- **Self-contained.** Never call or defer to skills outside this plugin. The
  session ends with committed code and readable docs; test generation and
  review start from those files, later, in their own sessions.
- **Every decision has a number.** If it was worth asking, it is worth a
  D-entry — decisions.md is the interview's permanent output, and an
  unnumbered decision cannot be cited by the spec or traced by the summary.
- **Docs in English, chat in the user's language.** Different artifacts,
  different readers.
- **One feature per session.** A second feature request mid-session gets its
  own warroom later — say so and finish this one.
