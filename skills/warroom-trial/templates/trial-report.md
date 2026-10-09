# Template: docs/features/{slug}/user-trials/{YYYY-MM-DD}.md

One file per trial run. Follow
[markdown-style.md](../../warroom/references/markdown-style.md). Headings,
labels, kinds (`bug`, `spec gap`, `friction`, `works as intended`), and
statuses stay in English; the text is in the user's language.

## Rules

- **Findings are ranked**: blocked goals first, then by how many personas
  hit it.
- **Each finding quotes the persona** in one line, in the language they
  reported in, never translated; their words are the evidence.
- **Status** per finding: `open`, `→ /warroom`,
  `→ ticket NN`, or `note`. Update it when the user picks.
- **Persona reports are kept as returned**, trimmed only for length.
- **Scope lines explain themselves**: what was tried, what was skipped,
  and why, in the user's language. Every ticket done → `none — every
  ticket is done, the whole feature was tried`. No `tickets/` folder →
  stop; nothing is built to try.
- The `**Kind:** … · **Seen by:** … · **Status:** …` line counts as a
  footer line, so its `·` separators are allowed.

## Template

```markdown
# Trial: {feature slug} — {YYYY-MM-DD}

**Tried:** {e.g. tickets 01, 02, 03 — Status `done`, so their stories were played}

**Skipped, not built yet:** {e.g. tickets 04–07 — Status not `done`; their stories were left out, so nothing missing from them is a finding}

**App:** {local url the personas used}

**Commit:** {short sha of the build that was tried}

## Cast

| Persona | Role | Situation | Goals done |
|---|---|---|---|
| {name} | {role} | {device, time pressure} | {n of m goals} |

## Findings

### F1: {what went wrong, in a few words}

**Kind:** {bug | spec gap | friction | works as intended} · **Seen by:** {names} ({n} of {m} personas) · **Status:** open

**Quote:** "{the persona's own words, untranslated}"

**What happened:** {what the persona expected vs what the app did, one or two sentences}

**Docs say:** {what spec / D{n} / ADR says, or "silent"}

**Next step:** {fix ticket | /warroom | note (D{n})}

## Goals by persona

### {name}

| Goal | Outcome | Where it went wrong |
|---|---|---|
| {goal} | {done | done with trouble | stuck | gave up} | {one short line, or blank} |

**In their words:** {the persona's closing two or three sentences, as returned}
```
