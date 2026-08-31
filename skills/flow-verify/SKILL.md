---
name: flow-verify
description: >-
  Verify that the running system behaves exactly as the project's flow
  documents say — reusing existing test evidence first and testing only the
  gaps. Finds the project's flow docs (asks if none exist), audits existing
  test scenarios/results for coverage and freshness, delegates only the
  missing/stale cases to the test-runner agent, then reads the results back
  against the flow edge-by-edge and reports conformance. Trigger on
  /flow-verify, "ตรวจ flow", "verify the flow", "flow ตรงกับระบบไหม", or after
  implementing/changing any documented flow. Record-only: never fixes code or
  docs, only reports.
---

You are orchestrating a flow-conformance round from the MAIN session (this
skill must not be delegated wholesale to a subagent — subagents cannot spawn
the test agent). The question to answer: **does the system behave exactly as
the flow document says?** — spending as little re-testing as possible.

## Step 1 — Find the flow docs

- If the user named a flow (file, path, or feature name), use that.
- Otherwise discover: look for `docs/flows/`, `docs/flow/`, `flows/`,
  `*.flow.md`, or markdown files combining mermaid diagrams with rule text.
  A project CLAUDE.md often names the convention — check it first.
- **Found nothing → ask the user** (AskUserQuestion): where are the flow
  docs, or is there no flow documentation yet? Offer: point me to the file /
  describe the expected behavior in chat / stop. Never invent a flow.
- Multiple flows and no target given → list them and ask which to verify
  (or "all").

## Step 2 — Extract assertions

Read the target flow doc(s). Turn EVERY diagram edge and every written rule
into a numbered assertion (edge like "ยัง → เด้งแจ้งให้สแกน" = one
assertion; each กติกา/summary bullet = one assertion). This list is the
contract for the whole round — later steps map onto these numbers.

## Step 3 — Audit existing evidence (the whole point: test less)

Find the project's test artifacts — default conventions `docs/test-scenarios/`
and `docs/test-results/` (or whatever the project CLAUDE.md names). For each
assertion classify:

- **COVERED-FRESH** — a past result case exercises this assertion with real
  evidence AND is newer than the last change to both the flow doc and the
  feature's source. Check with git: `git log -1 --format=%ci` on the flow
  file and the feature's main source dirs, versus the result round's date
  (in its filename/header) . Reuse it — do NOT re-test.
- **STALE** — evidence exists but code/flow changed after that round.
- **UNCOVERED** — no scenario/result touches this assertion.
- **MISMATCH** — a scenario exists but tests different behavior than the
  flow now specifies (scenario itself may be outdated — note it).

Read result files for content, not just dates: a case only counts as
covering an assertion if its steps actually exercise that edge and the
recorded evidence supports the verdict. A bare PASS with no evidence does
not count as coverage.

## Step 4 — Test only the gaps

If any STALE / UNCOVERED / MISMATCH assertions remain:

- Spawn the **test-runner agent** (prefer the project's own
  `.claude/agents/test-runner.md` if it exists; else the global one) with a
  precise prompt: ONLY the gap assertions, numbered, each with steps and
  expected result derived from the flow. Tell it which flow file it serves
  so its report references the assertion numbers.
- Do not re-send assertions that are COVERED-FRESH — that defeats the round.
- The test agent's own rules handle environment (never restart the user's
  dev processes, BLOCKED(รอ environment) lists, test-data cleanup). If it
  comes back with a "ต้องเปิดให้หน่อย" list, relay it to the user and mark
  those assertions BLOCKED.
- No gaps at all → skip straight to Step 5 with reused evidence only.

## Step 5 — Verdict: read results against the flow

Read the new results file (and the reused ones) and judge EVERY assertion
from Step 2:

| # | assertion (edge/กติกา) | หลักฐาน | ผล |

- ผล ∈ **PASS(ใหม่)** / **PASS(ใช้ผลเดิม — ไฟล์+วันที่)** / **FAIL** /
  **BLOCKED(เหตุผล)** / **DOC-MISMATCH**.
- **DOC-MISMATCH** = the system demonstrably does something different from
  the doc. Flag BOTH readings — "doc outdated" vs "code bug" — with your
  best guess and the evidence. Never silently pick one, never fix either.
- No assertion may be dropped: every number from Step 2 appears in the
  final table.

## Output & guardrails

- Final message: verdict line (x/y ตรง flow), the table (or a path to it if
  long — you may write the round summary next to the project's test-results
  convention), FAIL/DOC-MISMATCH details one line each, the BLOCKED list,
  and which assertions were satisfied by REUSED evidence (this is the win —
  show how much testing was saved).
- Record-only: no source, schema, config, or flow-doc edits. Suggest fixes
  and doc updates as a list for the user to pick up.
- Respect the project's rules (CLAUDE.md) at every step; language of the
  report follows the project's convention (this repo's docs are Thai).
