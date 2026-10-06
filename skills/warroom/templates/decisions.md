# Template: decisions.md

The why behind the feature. Copy the skeleton under **Template**; follow
**Rules**. Labels, `##` headings, `D{n}`, and the words in the Status and
From fields stay in English; everything else is in the docs language.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **Index first.** The table at the top lists every decision. Update its row
  whenever a decision is added or its Status or ADR changes.
- **Chosen and Why are one or two sentences each.** Anything longer belongs
  in Details.
- **Rejected lists every real alternative with its reason**, one per bullet:
  `{option} — {why not}`.
- **Details holds at most eight bullets.** More than that is spec material:
  move it to spec.md › Implementation and cite the `D{n}` there.
- **Bundle form** for many small rulings from one source (decided from the
  code, red-team fixes): Chosen says what the bundle covers; each Details
  bullet is `**{topic}:** {ruling} — {why}`. Skip Why and Rejected unless one
  applies to the whole bundle.
- **Append-only.** A new decision takes the next number. Changing an older
  one is a new `D{n}`; the old entry keeps its text and only its Status
  changes (`superseded by D10`, `changed by D21`, `extended by D25`).
- **Footer on every entry:** `From` (`interview`, `code`, `legal`,
  `red team`, `gate`, `warroom-tickets`, or `build ticket NN` for a decision made while
  building), `Status` (`active` unless changed), `ADR` (`—` until
  the gate writes one).
- **Sources** on an entry links the outside facts it rests on (a library
  limit, a law, a vendor constraint); the file's `## Sources` at the end
  collects them all.
- Drop empty optional fields (Details, Accepted risk, Sources).

## Template

```markdown
# Decisions: {feature slug}

| D | Decision | Status | ADR |
|---|---|---|---|
| D1 | {title} | active | — |
| D2 | {title} | superseded by D5 | — |

## D1: {title — the decision as a short statement}

**Chosen:** {what we do, one or two sentences}

**Why:** {the reason, one or two sentences}

**Rejected:**
- {option} — {why not}
- {option} — {why not}

**Details:**
- {one fact per bullet}

**Accepted risk:** {only when a known risk was accepted, and why it is tolerable}

**Sources:** {only when the decision rests on an outside fact — [page](url), …}

**From:** interview · **Status:** active · **ADR:** —

## Sources

- [{title}]({url}) — {what it backs} (accessed {YYYY-MM-DD})
```
