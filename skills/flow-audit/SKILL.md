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
exactly as the flow document says?** Test every assertion this round. Never
consult past results for coverage.

Run from the MAIN session. Do not delegate this skill wholesale to a
subagent — subagents cannot spawn the test agent, and the Step 2 contract
must stay in your own context to catch dropped edges.

## Per-project knobs — resolve once, before Step 1

Resolve these from the repo and state them in one line before starting:

- **Flow docs location** — check the project's CLAUDE.md first. Otherwise
  look for `docs/flows/`, `docs/flow/`, `flows/`, `*.flow.md`, or markdown
  combining mermaid diagrams with rule text.
- **Test agent** — prefer the project's own `.claude/agents/test-runner.md`;
  fall back to the global test-runner agent. If neither exists, run the
  cases yourself in Step 3 under the same rules and note it in the report.
- **Round record home** — where the report file goes. If the project already
  keeps test results (`docs/test-results/` or whatever CLAUDE.md names),
  match that convention. Otherwise use the Step 5 default.

## Step 1 — Pick the target

- User named a flow (file, path, or feature name) → audit exactly that. Do
  not widen to neighbors.
- User named nothing → discover the flow docs and ask with AskUserQuestion:
  one option per doc (with its edge count), plus "all of them". Never pick
  silently.
- Found no flow docs → ask: point me to the file / describe the expected
  behavior in chat / stop. Never invent a flow.

## Step 2 — Extract the assertion contract (yours, not the agent's)

Read each target doc yourself and turn EVERY diagram edge and every written
rule into a numbered assertion — one edge = one assertion, one rule bullet =
one assertion. This numbered list is the contract for the whole round. Keep
it in the main session so Step 4 can catch a report that drops a number.

## Step 3 — One agent per doc, clean context each

For each selected doc, spawn the test agent with a precise prompt: the
numbered assertions ONLY — each with concrete steps and the expected result
derived from the flow — plus which flow file the round serves. The agent's
report must carry one verdict line per number with its evidence.

- **One doc per agent, fresh context.** Only the verdict table comes back.
- **Sequential, not parallel.** Flows in one running system share state
  (records, sessions, stock); interleaved rounds produce false failures.
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
  best guess and the evidence. Never pick one silently, never fix either.
- No assertion may be dropped. Every number from Step 2 appears in the final
  table; a number missing from an agent report gets chased — re-ask the
  agent or test it yourself — before the round closes.

## Step 5 — Write the round record

Every round ends with a report file, without being asked. Follow the round
record home knob. No project convention → write
`docs/flow-audit/{flow-slug}.md`, flat folder, overwriting the previous
round for the same flow.

Write the report in English, whatever language the flow docs use — quote
doc lines verbatim in their original language where they serve as evidence.

It contains: the flow file audited, the date, the verdict line (x/y
conform), the full assertion table, one line per FAIL / DOC-MISMATCH with
the evidence, and the BLOCKED list with what each needs. Say the file's path
in your reply and leave committing it to the user.

## Operating rules

- Full coverage always. No small-round shortcut, no "obviously fine" edge,
  no reused evidence. To cut cost, audit fewer docs — never part of one.
- Record-only: no source, schema, config, or flow-doc edits — not even a
  trivial fix for a proven FAIL. Suggest fixes as a list for the user.
- The Step 2 contract is append-only during a round. A missed edge found
  mid-round gets a new number and is tested — never renumber or drop.
- Chat replies follow the conversation's language; the report file is
  English.
