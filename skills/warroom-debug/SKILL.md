---
name: warroom-debug
description: >-
  Disciplined debugging for any bug, failing test, or regression — reproduce
  it first, narrow the scope with the docs and git history, find the fail
  path, falsify ranked hypotheses (with an Outsider subagent for a
  third-person view), keep a ledger of every run, fix behind a regression
  test, then close with a blameless postmortem. Everything is written to one
  record file under docs/debug/ that can be read cold the next morning.
  Use when the user says debug / diagnose / something is broken, throwing,
  failing, flaky, or slow, pastes a stack trace or error log, or when
  warroom-build hits a failure it can't explain.
---

# Warroom Debug

Built from Matt Pocock's `diagnosing-bugs`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT), the four
debug mantras of 9arm's `debug-mantra`
([thananon/9arm-skills](https://github.com/thananon/9arm-skills)), and the
blameless postmortem of lyndonkl's `postmortem`
([lyndonkl/claude](https://github.com/lyndonkl/claude)).

State the four mantras once, at the start of the session, then work through
the phases in order:

> 1. **Reproduce first.** No reliable repro, no theory.
> 2. **Know the fail path.** Debugger, then knobs, then tagged logs.
> 3. **Try to kill your hypothesis.** Run the disproof first.
> 4. **Every run is a breadcrumb.** A theory must explain all of them.

## Phase 0 — Open the record

Create `docs/debug/{YYYY-MM-DD}-{slug}.md` from
[templates/debug-record.md](templates/debug-record.md) before anything
else. Fill in the symptom in the user's words. **Every later phase writes
into this file as it happens** — the ledger is the memory of the session,
and the file is what someone reads cold the next morning. Write in the
user's language; follow
[markdown-style.md](../warroom/references/markdown-style.md).

## Phase 1 — Reproduce

Build one command that goes red on **this** bug: a failing test at the
nearest seam, a curl script, a CLI call with a fixture, an e2e test with
the project's e2e tool (for a bug only visible in the UI), a replayed
request, or a throwaway harness.

- **Fails every time** → go on.
- **Fails sometimes** → not debuggable yet. Raise the rate: loop the
  trigger, run in parallel, add load, inject sleeps to widen the timing
  window. 50% is debuggable; 1% is not.
- **Can't make it fail** → stop. Say so plainly, list what you tried, and
  ask for a log, HAR, core dump, or access to the environment where it
  fails. **Do not guess a cause.**

Done when the command is red-capable (it asserts the user's exact symptom),
deterministic, fast (seconds), and you have run it at least once. Then
**minimise**: cut inputs, steps, config one at a time; keep only what keeps
it red.

## Phase 2 — Narrow the scope

Before reading code for a theory, shrink where the bug can be:

- **Docs** — what do spec.md, decisions.md, and the ADRs say should
  happen? If the code does what the docs say, this is a spec gap, not a
  bug: set the record's Status to `spec gap → warroom`, stop, and
  recommend `/warroom` on the feature.
- **History** — find the last known good state (a commit, tag, branch, or
  ticket). `git log` and `git diff` since then; if the window is wide,
  `git bisect run` with the Phase 1 command.
- **Branches** — does it fail on the default branch too, or only here? A
  differential between two states is the cheapest narrowing there is.

Write what was ruled in and out to the record.

## Phase 3 — Find the fail path

Escalate only when the previous step can't move the failure:

1. **Debugger first.** One breakpoint beats ten log lines. Do this before
   touching any knob.
2. **Enumerate the knobs** along the traced path — config flags, env vars,
   feature toggles, branch conditions, input shape, timing, concurrency,
   build options. Flip **one at a time**.
3. **Tagged logs** inside the code when outside knobs can't move it. Every
   probe carries one unique prefix, e.g. `[DBG-a3d2]`, so cleanup is one
   grep.

## Phase 4 — Hypothesise, then try to kill it

- Write **3–5 ranked hypotheses**, never one. Each states its prediction:
  "If X is the cause, changing Y makes it disappear."
- For each: does it explain the symptom end to end, walking every step?
  What is the simplest proof, and the cleanest disproof?
- **Run the disproof first.** Survives → it's real. Dies → you saved the
  chase.
- Show the ranked list to the user before testing — they often know which
  one was just deployed. Don't block if they're away.

**Third-person check — The Outsider.** Before committing to a fix, and
whenever five runs pass without progress, spawn a subagent with **only the
record file** — symptom, repro, scope, ledger, hypotheses; none of your
reasoning. Ask it: "Rank your own hypotheses from this record. Which ledger
rows contradict the leading one? What single experiment would decide it?"
Fold its answer into the record.

## Phase 5 — Ledger

After **every** run, add a row: what changed, what happened, what it ruled
in or out.

- A new hypothesis must explain **every** row, not just the latest. Any row
  that contradicts it → sharpen it or drop it.
- Unsure between two → design the **one experiment** whose result decides
  it, and run that instead of nearby variations.

## Phase 6 — Fix behind a regression test

1. Turn the minimised repro into a failing test at a seam that exercises
   the real bug pattern — an e2e test when the bug only shows in the UI.
   No such seam exists → that is a finding; write it down.
2. Watch it fail, apply the fix, watch it pass.
3. Re-run the original, un-minimised Phase 1 command.
4. Remove every tagged probe (grep the prefix) and throwaway harness.

## Phase 7 — Postmortem

Finish the record's postmortem section. **Blameless**: ask what in the
system let this happen, never who.

- **Timeline** — when it started, was noticed, was found, was fixed.
- **Root cause** — ask "why?" until you reach something the system could
  have prevented.
- **Prevention** — prefer, in order: remove the hazard, a safer
  substitute, an automated check or test, a process change, a note. Each
  action says where it is tracked: a ticket, an ADR, a check in CI.
  Actions that need new work → propose them to the user with
  AskUserQuestion; each one accepted becomes a new ticket after the highest
  number, in [warroom-tickets' template](../warroom-tickets/templates/ticket.md),
  `**Status:** ready-for-agent`. Nothing is created without the user's yes.
- **What helped** — what made this fast or slow to find.

Put the confirmed hypothesis in the fix's commit message, in English. Report in one
line per phase, plus the record path.

## Operating rules

- **No fix before a reliable repro.** Caught yourself proposing one → back
  to Phase 1.
- **No hypothesis testing before the scope is narrowed.**
- **No hypothesis is "the cause" until it explains every ledger row.**
- **The record is updated as you go**, never reconstructed at the end.
- **Redact secrets** in everything shown or recorded — write `<REDACTED>`.
- **The record is committed with the fix.** Called from warroom-build →
  return the fix, the regression test, and the record to it; they go in
  the ticket's commit, not a separate one. Run on its own → commit the
  fix, its regression test, and the record together.
