---
name: warroom
description: >-
  Plan one feature until the whole picture is clear and approved — documents
  only, no code. Interviews the user one question at a time (choices with a
  recommended answer), then writes the feature docs as markdown under
  docs/features/{slug}/: spec.md, decisions.md, flow.md, plus legal.md via
  the legal-check skill and glossary terms in CONTEXT.md. Ends at the
  approval gate: the user OKs the docs and the session is done — splitting,
  building, testing, and review are later skills that read these files.
  Invoke with /warroom, or whenever a feature needs its plan and docs laid
  out before anyone builds it.
---

# Warroom — plan one feature, on paper, until it's approved

Interview → docs → one approval gate → done. The output is a docs folder a
stranger could build from; writing code is not this skill's job, ever.

**Which skills may be called:** any skill in this plugin's `skills/` — they
ship with the plugin, so they exist on every machine that installs it.
`examples/` is study material and is not part of the plugin: it isn't there
after an install, so nothing may depend on it. A useful outside skill
becomes callable by vendoring it into `skills/` first.

## Per-project knobs — resolve once, before the interview

State them in one line before asking anything, so a bad guess gets corrected
while it's free:

- **Docs home** — `docs/features/{slug}/` by default; if the project already
  keeps feature docs elsewhere, match that convention.
- **Glossary** — `CONTEXT.md` at the repo root. Created lazily on the first
  resolved term, never empty.

## Phase 1 — Interview, one question at a time

Ask with AskUserQuestion: ONE question per call, choices with your
recommended answer first, marked "(Recommended)". The user is here to react
and decide, not to author from scratch.

- **Facts are your job, decisions are theirs.** Anything the codebase can
  answer, look up before asking. Only genuine decisions reach the user.
- **Walk the design tree in dependency order.** Ask the question whose
  answer unblocks the most next questions.
- **Apply the domain-modeling skill (this plugin) as terms appear** — it
  challenges fuzzy words, pins one canonical term into `CONTEXT.md`, and
  cross-checks claims against the code. Interview decisions still land in
  this feature's decisions.md; docs/adr/ is for project-level decisions
  only.
- **Record each decision the moment it lands** as a `D{n}` entry.
  Append-only, never renumber — the spec cites these numbers.
- Done when nothing is left silently assumed: a stranger with the spec
  would build the same thing.

**Big is fine — this is planning.** A large feature just makes a longer
plan. But if the interview reveals several features wearing one name, say
so and propose the split: separate feature folders, one warroom each. The
split itself is a planning outcome worth presenting.

## Phase 2 — Write the docs

All docs are **English**; chat stays in the conversation's language. One
file per topic in `docs/features/{slug}/`:

**`decisions.md`** — the why. Every decision from the interview, 3–5 lines
each; the rejected options and the reason are the payload:

```markdown
## D1: Redis holds OTP state
Chosen over a DB table (slower, needs cleanup job) and JWT (cannot revoke).
Redis is already in the stack and TTL handles expiry for free.
```

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

No file paths or code snippets — they go stale fast. Exception: a snippet
that IS the decision (a state machine, a schema).

**`flow.md`** — how it runs: mermaid diagram(s), one-line caption each,
drawn with the **mermaid-flow** skill (this plugin).

## Phase 2.5 — Legal check, every feature

Invoke the **legal-check** skill (this plugin) on the drafted feature. It
sweeps the risk zones, researches the governing law with web sources, and
writes `legal.md` into the same folder — or reports "no legal surface".
Fold its build obligations into the spec's Implementation section so the
future build cannot skip them. It runs before the gate: the user approves
with the legal picture in view.

## The Gate — approve the plan

Show the whole picture in chat: the doc folder path, the decision list
(`D1: title` per line), the legal summary (zones touched, obligations,
lawyer questions — or "no legal surface"), and the rough build shape
(modules touched, estimated size). Then ask with AskUserQuestion:
**Approve / Adjust**.

- **Adjust** → fold the changes into the docs and gate again.
- **Approve** → warroom is done. Name the doc files in the reply and stop.
  The docs are left uncommitted — committing them is the user's call.
  Building, splitting into tasks, test generation, and review are separate
  skills that start by reading these files.

A request for code at any point gets one sentence — this skill plans; a
build skill reads the approved spec — and the interview continues.

## Operating rules

- **No code, no exceptions.** Not a prototype, not a stub, not "just the
  schema". The moment this skill writes code, its docs stop being the
  contract and start being an afterthought.
- **The gate is the only exit.** Docs the user never approved are a draft,
  not a plan — do not present them as finished.
- **Legal runs every time.** Deciding what is risky is legal-check's job,
  not a hunch made here.
- **Every decision has a number.** An unnumbered decision cannot be cited
  by the spec.
- **Docs in English, chat in the user's language.**
- **One feature per session.** A second feature gets its own warroom.
