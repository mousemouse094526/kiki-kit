---
name: flow-audit
description: >-
  Full conformance audit of a running system against the project's flow
  documents — every diagram edge and written rule becomes a numbered
  assertion, every assertion is exercised with fresh evidence this round, and
  nothing is skipped or reused from past runs. When the user names a doc,
  audit exactly that flow; when they don't, discover the project's flow docs
  and ask which one to audit. Each selected doc is delegated to a test-runner
  agent with a clean context, then the verdicts are read back edge by edge.
  Trigger on /flow-audit, "test flow", "verify flow", "audit the flow", or
  after implementing or changing any documented flow. Record-only: never
  fixes code or docs, only reports.
---

# Flow Audit — conformance, edge by edge

Answer one question with fresh evidence: **does the running system behave
exactly as the flow document says?** Every assertion is tested this round.
Past results are never consulted for coverage — evidence ages the moment
code, config, or environment moves, and a reused PASS is a guess wearing a
verdict's clothes. If a round is worth running, it is worth running whole.

You are orchestrating from the MAIN session. Do not delegate this skill
wholesale to a subagent — subagents cannot spawn the test agent, and the
assertion contract (Step 2) must survive in your own context so you can tell
when an agent's report dropped an edge.

## Per-project knobs — resolve once, before Step 1

Nothing below assumes a layout. Resolve these from the repo in front of you
and state them in one line before starting, so the user can correct a bad
guess before it costs a round:

- **Flow docs location** — check the project's CLAUDE.md first; it often
  names the convention. Otherwise look for `docs/flows/`, `docs/flow/`,
  `flows/`, `*.flow.md`, or markdown combining mermaid diagrams with rule
  text.
- **Test agent** — prefer the project's own `.claude/agents/test-runner.md`;
  fall back to the global test-runner agent. If neither exists, you will run
  the cases yourself in Step 3 under the same rules the agent would follow —
  note it in the report, since a reader weighs self-run evidence differently.
- **Round record home** — where the report file goes. If the project already
  keeps test results (`docs/test-results/` or whatever CLAUDE.md names),
  match that convention and read no further about naming. Only when the
  project keeps none does the default in Step 5 apply.

## Step 1 — Pick the target

- User named a flow (file, path, or feature name) → audit exactly that. Do
  not widen the round to neighbors; a scoped ask is a scoped round.
- User named nothing → discover the flow docs and ask with AskUserQuestion:
  one option per doc (with its edge count so the user can see the round's
  size), plus "all of them". Never pick silently — the user knows which flow
  they just touched; you don't.
- Found no flow docs at all → ask: where are they, or is there no flow
  documentation yet? Offer: point me to the file / describe the expected
  behavior in chat / stop. Never invent a flow — an audit against an imagined
  contract certifies nothing.

## Step 2 — Extract the assertion contract (yours, not the agent's)

Read each target doc yourself and turn EVERY diagram edge and every written
rule into a numbered assertion — one edge = one assertion, one rule bullet =
one assertion. This numbered list is the contract for the whole round.

You do this in the main session, not the agent, for one reason: the party
that extracts the contract is the only party that can notice a dropped case.
An agent that both writes and grades its own checklist can silently skip an
edge and report complete — with the numbers held here, a report that comes
back missing #7 is caught in Step 4, not never.

## Step 3 — One agent per doc, clean context each

For each selected doc, spawn the test agent with a precise prompt: the
numbered assertions ONLY — each with concrete steps and the expected result
derived from the flow — plus which flow file the round serves, so its report
references the assertion numbers. The agent's report must carry one verdict
line per number with the evidence that produced it.

- **One doc per agent, fresh context.** A finished doc's logs, screenshots,
  and dead ends have zero value to the next doc — carrying them along only
  crowds out the context the next round needs. The agent dies with its
  clutter; the verdict table is all that comes home.
- **Sequential, not parallel.** Flows in one running system share state —
  records, sessions, stock. Two rounds interleaved produce failures neither
  flow actually has, and a FAIL you can't attribute is a round you rerun.
- The agent's own rules govern environment: never restart the user's dev
  processes, report BLOCKED with what it needs opened, clean up test data.
  If it returns a "need this running" list, relay it to the user and mark
  those assertions BLOCKED — do not guess around a missing environment.
- No agent available (knob above) → run the same numbered cases yourself,
  same rules, and say so in the report.

## Step 4 — Verdict, every number accounted for

Read each agent's report against your Step 2 contract and judge EVERY
assertion:

| # | assertion (edge/rule) | evidence | verdict |

- verdict ∈ **PASS** / **FAIL** / **BLOCKED(reason)** / **DOC-MISMATCH**.
- **DOC-MISMATCH** — the system demonstrably does something different from
  the doc. Flag BOTH readings — "doc outdated" vs "code bug" — with your
  best guess and the evidence. Never silently pick one, never fix either:
  which artifact is wrong is the owner's call, and this skill is
  record-only.
- No assertion may be dropped. Every number from Step 2 appears in the final
  table; an agent report missing a number gets that number chased — re-ask
  the agent or test it yourself — before the round closes. A table with
  holes is the exact failure this skill exists to prevent.

## Step 5 — Write the round record

Every round ends with a report file, without being asked — the chat scrolls
away; the record is what the next round diffs against. Follow the round
record home knob. Only when the project keeps no convention: write
`docs/flow-audit/{flow-slug}.md`, flat folder, overwriting the previous
round for the same flow — git history keeps the old rounds, so a dated pile
of files adds nothing but noise.

The report is always written in English, whatever language the flow docs
use — quote doc lines verbatim in their original language where they serve
as evidence.

It contains: the flow file audited, the date, the verdict line (x/y
conform), the full assertion table, one line per FAIL / DOC-MISMATCH with
the evidence, and the BLOCKED list with what each needs. Say the file's path
in your reply and leave committing it to the user.

## Operating rules

- Full coverage is the invariant. There is no small-round shortcut, no
  "obviously fine" edge, no reuse of last week's evidence — the moment
  skipping is negotiable, every edge becomes a candidate for it. One knob
  scales cost honestly: audit fewer docs (Step 1), never fractions of one.
- Record-only, absolutely: no source, schema, config, or flow-doc edits —
  not even the "trivial" fix for a FAIL you just proved. Suggest fixes as a
  list for the user; the round's credibility rests on the auditor having
  touched nothing.
- The Step 2 contract is append-only during a round. If testing reveals the
  doc implies an edge you missed, add it with a new number and test it —
  never renumber or drop, because the numbers are what tie agent reports to
  the final table.
- Chat replies follow the conversation's language; the report file is
  English (Step 5). These are different artifacts with different readers.
