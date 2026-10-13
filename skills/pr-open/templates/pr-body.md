# Template: pull request body

Copy the skeleton. Every heading stays; **Screenshots** only for UI
changes. Fill from facts gathered in SKILL.md › 2 — never from guesses.

## Template

```markdown
## What changes

{One or two sentences: what a user or operator notices after this merges.}

## Why

{The problem, in one or two sentences, with its evidence — a log line, a
ticket (`docs/features/{slug}/tickets/NN-…`), an issue, a `D{n}`.}

## Changes

| Area | Change |
|---|---|
| `{app or package}` | {what changed there, one line} |

## Deploy notes

- **Env:** {`OLD_NAME` → `NEW_NAME` in {service}; set it on {staging and prod} before merge} — or `none`
- **Migrations:** {what runs, and whether it is reversible} — or `none`
- **Config:** {Dockerfile, Railway watch paths, CI, start script changes} — or `none`
- **Dependencies:** {added / removed} — or `none`
- **Breaking:** {removed or renamed route, field, export} — or `none`
- **Rollback:** {revert this PR; plus anything else to undo}

## Verified

- `{command}` — {pass, with a count when there is one}
- {manual check} — {what you saw}

## After merge

- {what to check, where} — {who} — or `none`

## Screenshots

{before / after — UI changes only}
```
