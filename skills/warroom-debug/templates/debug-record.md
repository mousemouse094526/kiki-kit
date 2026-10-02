# Template: docs/debug/{YYYY-MM-DD}-{slug}.md

One file per bug, opened in Phase 0 and written as you go. Follow
[markdown-style.md](../../warroom/references/markdown-style.md). Headings
and labels stay in English; the text is in the user's language.

## Rules

- **Status** moves `investigating` → `fixed` (or `blocked: {what is
  needed}`).
- **Ledger rows are never edited or deleted** — a wrong turn is still a
  breadcrumb.
- **Hypotheses keep their number**; mark them `alive`, `killed by #{run}`,
  or `confirmed`.
- **The Summary is written last**, three lines a reader can act on without
  scrolling.

## Template

```markdown
# Debug: {short symptom}

**Status:** investigating

**Summary:**
- **Cause:** {one sentence}
- **Fix:** {one sentence, commit}
- **Prevention:** {one sentence}

## Symptom

{What the user sees, in their words. Error text, wrong output, timing.}

## Reproduce

**Command:** `{the one command that goes red}`

**Rate:** {always | n of m runs}

**Minimised to:** {the smallest scenario that still fails}

## Scope

- **Docs say:** {expected behaviour} ({D3}, {ADR 0007})
- **Last good:** {commit / branch / ticket}
- **Ruled out:** {area} — {how}

## Fail path

{Where it breaks and which knob moves it.}

## Hypotheses

| # | Hypothesis | Prediction | Disproof | State |
|---|---|---|---|---|
| H1 | {cause} | {changing Y fixes it} | {cleanest test that would kill it} | alive |

## Ledger

| Run | Changed | Result | Rules in / out |
|---|---|---|---|
| 1 | {what was changed} | {red / green / other} | {H2 out} |

## Outsider

{The third-person subagent's ranking and the experiment it proposed.}

## Fix

- **Regression test:** {test name and seam, or why no correct seam exists}
- **Change:** {what changed and why it removes the cause}
- **Probes removed:** {prefix grepped clean}

## Postmortem

**Timeline:**
- {time} — {started / noticed / found / fixed}

**Root cause:** {why → why → … down to what the system allowed}

**Prevention:**
- {action} — tracked in {ticket / ADR / CI check}

**What helped:** {what made this fast or slow to find}

## Sources

- [{title}]({url}) — {what it backs: a doc page, an issue, a changelog} (accessed {YYYY-MM-DD})
```
