# Template: decisions.md

Copy the skeleton under **Template**; follow **Rules**. Labels, `##`
headings, `D{n}`, and the words in the Status and From fields stay in
English; everything else is in the docs language.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **Indexed centrally.** Every entry has a row in `docs/decisions.md`
  ([decisions-index.md](decisions-index.md)), written the moment the entry
  is, and every Status change is made in both. This file has no index
  table of its own.
- **Chosen and Why are one or two sentences each.** Anything longer goes
  in Details.
- **Rejected lists every real alternative with its reason**, one per
  bullet: `{option} — {why not}`.
- **Details holds at most eight bullets.** More → move it to spec.md ›
  Implementation and cite the `D{n}` there.
- **Bundle form** for many small rulings from one source (decided from the
  code, red-team fixes): Chosen says what the bundle covers; each Details
  bullet is `**{topic}:** {ruling} — {why}`. Skip Why and Rejected unless
  one applies to the whole bundle.
- **Append-only.** A new decision takes the next number in this file.
  Changing an older one is a new `D{n}`; the old entry keeps its text and
  only its Status changes (`superseded by D10`, `changed by D21`,
  `extended by D25`).
- **Another feature's decision** is cited with its slug: `user-contact D4`.
  Reusing it needs no new entry — the spec cites it. Superseding it is a
  new entry here whose Details says `supersedes user-contact D4`; that old
  entry's Status becomes `superseded by {this slug} D{n}`.
- **Footer on every entry:**
  - `From` — `interview`, `code`, `legal`, `red team`, `gate`,
    `tickets`, `build ticket NN` (decided while building),
    `blocked #{n}` (a re-opened feature), or `change request`;
  - `Status` — `active` unless changed.
- **Never invent a Why.** A decision that arrived without its reason gets
  `**Why:** rationale not recorded`.
- **Sources** on an entry links the outside facts it rests on (a library
  limit, a law, a vendor constraint); the file's `## Sources` at the end
  collects them all.
- Drop empty optional fields (Details, Accepted risk, Sources).

## Template

```markdown
# Decisions: {feature slug}

## D1: {the decision as a short statement, e.g. "Log in with email links, not passwords"}

**Chosen:** {what we will do, one or two sentences}

**Why:** {the reason the user gave, one or two sentences — or `rationale not recorded`}

**Rejected:**
- {an option we considered} — {why not}
- {another option} — {why not}

**Details:**
- {one fact per bullet}

**Accepted risk:** {a known risk we accepted, and why it is tolerable — only if there is one}

**Sources:** {[page](url) for each outside fact this rests on — only if there is one}

**From:** interview · **Status:** active

## Sources

- [{title}]({url}) — {what it backs} (accessed {YYYY-MM-DD})
```
