# Template: docs/features/{slug}/trial/{YYYY-MM-DD}.md

One file per trial run. Follow
[markdown-style.md](../../warroom/references/markdown-style.md). Headings,
labels, kinds (`bug`, `spec gap`, `friction`, `works as intended`), and
statuses stay in English; the text is in the user's language.

## Rules

- **Findings are ranked**: blocked goals first, then by how many personas
  hit it.
- **Each finding quotes the persona** in one line, in the language they
  reported in — never translated; their words are the evidence.
- **Status** per finding: `open`, `→ debug`, `→ warroom`, `→ ticket NN`, or
  `note`. Update it when the user picks.
- **Persona reports are kept as returned**, trimmed only for length.
- **Scope lines explain themselves** — say what was tried, what was
  skipped, and why, in the user's language. Every ticket done → `none —
  every ticket is done, the whole feature was tried`. No `tickets/` folder
  → stop; there is nothing built to try.
- The `**Kind:** … · **Seen by:** … · **Status:** …` line counts as a footer
  line, so its `·` separators are allowed.

## Template

```markdown
# Trial: {feature slug} — {YYYY-MM-DD}

**Tried:** tickets 01, 02, 03 — Status `done`, so their stories were played

**Skipped, not built yet:** tickets 04–07 — Status not `done`; their stories were left out, so nothing missing from them is a finding

**App:** {local url}

**Commit:** {short sha}

## Cast

| Persona | Role | Situation | Goals done |
|---|---|---|---|
| {name} | {role} | {device, pressure} | {n of m} |

## Findings

### F1: {short title}

**Kind:** friction · **Seen by:** {names} ({n} of {m}) · **Status:** open

**Quote:** "{the persona's words}"

**What happened:** {expected vs actual, one or two sentences}

**Docs say:** {what spec / D{n} / ADR says, or "silent"}

**Next step:** {new ticket | warroom-debug | warroom | note (D{n})}

## Goals by persona

### {name}

| Goal | Outcome | Where it went wrong |
|---|---|---|
| {goal} | done with trouble | {short} |

**In their words:** {the persona's closing two or three sentences}
```
