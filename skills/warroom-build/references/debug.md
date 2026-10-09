# Debug — find a bug's cause before fixing it

warroom-build follows this whenever a failure has no reason it can name at
a glance, and for any bug in its debug mode: `/warroom-build debug
{symptom}`. Not for a failure whose cause is plain (a typo, a missing
import): just fix that.

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

Create the record — `docs/features/{feature}/bugs/{YYYY-MM-DD}-{slug}.md`
when the bug is in a warroom feature, otherwise
`docs/bugs/{YYYY-MM-DD}-{slug}.md` — from
[templates/debug-record.md](../templates/debug-record.md) before anything
else. Fill in the symptom in the user's words. **Every later phase writes
into this file as it happens**; someone will read it cold the next morning.
Write in the user's language; follow
[markdown-style.md](../../warroom/references/markdown-style.md).

## Phase 1 — Reproduce

Build one command that goes red on **this** bug: a failing test at the
nearest seam, a curl script, a CLI call with a fixture, an e2e test with
the project's e2e tool (for a bug only visible in the UI), a replayed
request, or a throwaway harness.

- **Fails every time** → go on.
- **Fails sometimes** → not debuggable yet. Raise the rate: loop the
  trigger, run in parallel, add load, add sleeps to widen the timing
  window (tagged like the probes in Phase 3, so cleanup finds them). 50% is debuggable; 1% is not.
- **Can't make it fail** → stop. Say so, list what you tried, and ask for
  a log, HAR, core dump, or access to the environment where it fails.
  **Do not guess a cause.** Status `blocked: {what is needed}`; in a
  warroom feature also add a row to `progress.md` › Blocked (Needs:
  `/warroom-build debug {symptom}` once the data is in), so the stuck bug
  sits with the other unfinished work.

Done when the command checks the user's exact symptom, gives the same
result every run, takes seconds, and you have run it at least once. Then
**minimise**: cut inputs, steps, and config one at a time; keep only what
keeps it red.

## Phase 2 — Narrow the scope

Before reading code for a theory, shrink where the bug can be:

- **Docs** — what do spec.md, decisions.md, and the ADRs say should
  happen? If the code does what the docs say, this is a spec gap, not a
  bug: set the record's Status to `spec gap → warroom`. Ask the user which
  behaviour they want (AskUserQuestion). The answer stays inside the
  spec's intent → record a `D{n}` and carry on. It changes what the spec
  promises, a legal item, or an ADR → add a row to `progress.md` › Blocked
  (Needs: `/warroom {slug}`, citing the record), stop, and end with that
  command.
- **History** — find the last known good state (a commit, tag, branch, or
  ticket). `git log` and `git diff` since then; if the window is wide,
  `git bisect run` with the Phase 1 command. Bisect needs a clean tree:
  commit or stash tracked changes first (the untracked record and repro
  can stay), keep the repro outside tracked files, and `git bisect reset`
  when done.
- **Branches** — does it fail on the default branch too, or only here?
  Comparing two states is the cheapest way to narrow.

Write what was ruled in and out to the record.

## Phase 3 — Find the fail path

Go to the next step only when the one before can't move the failure:

1. **Debugger first.** One breakpoint beats ten log lines. Use it before
   touching any knob.
2. **List the knobs** along the traced path — config flags, env vars,
   feature toggles, branch conditions, input shape, timing, concurrency,
   build options. Flip **one at a time**.
3. **Tagged logs** inside the code when outside knobs can't move it. Every
   probe has the same unique prefix, e.g. `[DBG-a3d2]`, so cleanup is one
   grep.

## Phase 4 — Hypothesise, then try to kill it

- Write **3–5 ranked hypotheses**, never one. Each states its prediction:
  "If X is the cause, changing Y makes it disappear."
- For each: does it explain the symptom end to end, step by step? What is
  the simplest proof, and the cleanest disproof?
- **Run the disproof first.** Survives → it's real. Dies → you skipped a
  wasted chase.
- Show the ranked list to the user before testing; they often know what
  was just deployed. Don't wait if they're away.

**Third-person check — The Outsider.** Before committing to a fix, and
whenever five runs pass without progress, spawn a subagent with **only the
record file** (symptom, repro, scope, ledger, hypotheses), none of your
reasoning. Ask it: "Rank your own hypotheses from this record. Which ledger
rows contradict the leading one? What single experiment would decide it?"
Fold its answer into the record.

## Phase 5 — Ledger

After **every** run, add a row: what changed, what happened, what it ruled
in or out.

- A new hypothesis must explain **every** row, not just the latest. A row
  contradicts it → sharpen it or drop it.
- Unsure between two → design the **one experiment** whose result decides,
  and run that instead of small variations.

## Phase 6 — Fix behind a regression test

1. Turn the minimised repro into a failing test at a seam that hits the
   real bug pattern; an e2e test when the bug only shows in the UI. No such
   seam exists → that is a finding; write it down.
2. Watch it fail, apply the fix, watch it pass.
3. Re-run the original, un-minimised Phase 1 command.
4. Remove every tagged probe (grep the prefix) and throwaway harness.
   Then run the CI checks
   ([ci-checks.md](../../warroom/references/ci-checks.md)) — the fix must
   not break lint, format, or another test. Inside a ticket, the ticket's
   own check step covers this.
5. The bug has an `open` row in `progress.md` › Blocked → set it to
   `done ({short sha})`, or `done (this ticket)` when the fix goes in the
   ticket's commit.

## Phase 7 — Postmortem

Finish the record's postmortem section. **Blameless**: ask what in the
system let this happen, never who.

- **Timeline** — when it started, was noticed, was found, was fixed.
- **Root cause** — ask "why?" until you reach something the system could
  have prevented.
- **Prevention** — prefer, in order: remove the hazard, a safer
  substitute, an automated check or test, a process change, a note. Each
  action says where it is tracked: a ticket, an ADR, a CI check. Actions
  that need new work → propose them with AskUserQuestion; each one
  accepted becomes a new ticket after the highest number, in
  [the ticket template](../../warroom/templates/ticket.md),
  `**Status:** ready-for-agent`, with its row in `progress.md`. Nothing is
  created without the user's yes.
- **What helped** — what made this fast or slow to find.

Put the confirmed hypothesis in the fix's commit message, in English.
Report one line per phase, plus the record path.

## Operating rules

- **No fix before a reliable repro.** Caught proposing one → back to
  Phase 1.
- **No hypothesis testing before the scope is narrowed.**
- **No hypothesis is "the cause" until it explains every ledger row.**
- **The record is updated as you go**, never reconstructed at the end.
- **Redact secrets** in everything shown or recorded — write `<REDACTED>`.
- **The record is committed with the fix.** Inside a ticket → they go in
  the ticket's commit, not a separate one. Debug mode → ask first:
  commit all three together (Recommended) or leave them uncommitted. On
  the default branch, offer a `fix/{slug}` branch before committing.
