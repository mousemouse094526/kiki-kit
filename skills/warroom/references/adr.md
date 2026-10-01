# ADRs

Criteria and format from Matt Pocock's `domain-modeling` / `ADR-FORMAT.md`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT © Matt Pocock).
Where to look and the sweep are warroom's.

Feature decisions stay in the feature's `decisions.md`. An ADR is for a
decision that reaches beyond this feature, so the next warroom reads it as a
fact instead of asking again.

## When a decision earns an ADR

All three must be true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful.
2. **Surprising without context** — a future reader will look at the code and
   wonder "why on earth did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and
   you picked one for specific reasons.

If any one is missing, skip it.

### What qualifies

- **Architectural shape.**
- **Integration patterns between contexts.**
- **Technology choices that carry lock-in** — database, auth provider,
  deployment target. Not every library: just the ones that would take a
  quarter to swap out.
- **Boundary and scope decisions** — who owns which data. The explicit no-s
  are as valuable as the yes-s.
- **Deliberate deviations from the obvious path** — anything a reasonable
  reader would assume the opposite of. These stop the next engineer from
  "fixing" something that was deliberate.
- **Constraints not visible in the code** — compliance, infrastructure,
  partner contracts.
- **Rejected alternatives when the rejection is non-obvious.**

### Not an ADR, even when it feels important

An ADR is not a diary of every choice made this session.

- Tunable numbers — thresholds, limits, durations, defaults.
- This feature's own behaviour — UX, messages, scope cuts.
- Ops runbooks — deploy order, seed steps.
- Consequences of an existing ADR — cite it instead.

## Where candidates hide

The interview is not the only source. Check:

- Every `D{n}` — **each bullet** of a bundled one (e.g. "decided from code,
  not asked"), and the ones the red team added.
- `legal.md` — its assumptions and every CONDITIONAL requirement.
- `spec.md` › Implementation — settings and contracts that never became a
  `D{n}`.
- Any clause that says "future features", "every endpoint", "all …",
  "until we have …".

One ADR = one decision. Several `D{n}` that make one decision → one ADR
citing all of them. The source `D{n}` stays in `decisions.md` either way.

## The Successor — sweep subagent

```
You are The Successor: next month you build the next feature in this repo.
Read: {feature folder}, {CONTEXT.md}, {docs/adr/ — may not exist}. Codebase at {repo root}.
Criteria: {"When a decision earns an ADR" and "Where candidates hide", pasted}
1. Every decision from this feature that you would have to know to avoid
   breaking it: one sentence, sources (D{n} / legal item / spec section),
   and how it passes each of the three tests.
2. Every place this feature contradicts an existing ADR.
3. Candidates you rejected: one line each, naming the test that failed.
Do not edit files.
```

## Format

`docs/adr/NNNN-slug.md` — scan `docs/adr/` for the highest number and add
one. Create the folder lazily, on the first ADR.

```md
# {Short title of the decision}

{1-3 sentences: what's the context, what did we decide, and why.}

Source: {feature slug} D1, D2 · legal 3
```

Optional, only when they add genuine value: **Status** (`proposed |
accepted | deprecated | superseded by ADR-NNNN`), **Considered Options**,
**Consequences**.
