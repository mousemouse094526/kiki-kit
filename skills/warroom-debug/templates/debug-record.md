# Template: docs/debug/{YYYY-MM-DD}-{slug}.md

One file per bug, opened in Phase 0 and filled in as you go. Follow
[markdown-style.md](../../warroom/references/markdown-style.md). Headings
and labels stay in English; the text is in the user's language.

## Rules

- **Status** moves `investigating` → `fixed`, or ends as
  `blocked: {what is needed}`, or as `spec gap → warroom` when the code
  does what the docs say and the docs are wrong.
- **Ledger rows are never edited or deleted** — a wrong turn is still a
  breadcrumb.
- **Hypotheses keep their number**; mark them `alive`, `killed by #{run}`,
  or `confirmed`.
- **The Summary is written last**: three lines a reader can act on without
  scrolling.

## Template

```markdown
# Debug: {the symptom in a few words}

**Status:** investigating

**Summary:**
- **Cause:** {what caused it, one sentence}
- **Fix:** {what changed, one sentence; commit sha}
- **Prevention:** {what stops it coming back, one sentence}

## Symptom

{What the user sees, in their words: the error text, the wrong output, when it happens.}

## Reproduce

**Command:** `{the one command that goes red}`

**Rate:** {always | fails n of m runs}

**Minimised to:** {the smallest input and steps that still fail}

## Scope

- **Docs say:** {what should happen} ({D3}, {ADR 0007})
- **Last good:** {last commit / branch / ticket where it worked}
- **Ruled out:** {area} — {how you ruled it out}

## Fail path

{Where it breaks (file, function) and which knob turns the failure on or off.}

## Hypotheses

| # | Hypothesis | Prediction | Disproof | State |
|---|---|---|---|---|
| H1 | {possible cause} | {if so, changing Y fixes it} | {simplest test that would prove it wrong} | alive |

## Ledger

| Run | Changed | Result | Rules in / out |
|---|---|---|---|
| 1 | {what you changed} | {red / green / other} | {e.g. H2 out} |

## Outsider

{How the Outsider subagent ranked the hypotheses, and the experiment it proposed.}

## Fix

- **Regression test:** {test name and seam, or why no right seam exists}
- **Change:** {what changed and why that removes the cause}
- **Probes removed:** {the prefix; grep finds none left}

## Postmortem

**Timeline:**
- {time} — {started / noticed / found / fixed}

**Root cause:** {why → why → … until you reach what the system let happen}

**Prevention:**
- {action} — tracked in {ticket / ADR / CI check}

**What helped:** {what made this fast or slow to find}

## Sources

- [{title}]({url}) — {what it backs: a doc page, an issue, a changelog} (accessed {YYYY-MM-DD})
```
