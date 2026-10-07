# ADRs

Criteria and format from Matt Pocock's `domain-modeling` / `ADR-FORMAT.md`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT © Matt Pocock).
Where to look and the sweep are warroom's.

Feature decisions stay in the feature's `decisions.md`. An ADR is for a
decision that reaches beyond this feature, so the next warroom reads it as a
fact instead of asking again.

## When a decision earns an ADR

All three must be true; if one is missing, skip it:

1. **Hard to reverse** — changing your mind later would cost something real.
2. **Surprising without context** — a future reader of the code would ask
   "why did they do it this way?"
3. **The result of a real trade-off** — there were real alternatives and
   you picked one for specific reasons.

### What qualifies

- **Architectural shape.**
- **Integration patterns between contexts.**
- **Technology choices that carry lock-in** — database, auth provider,
  deployment target. Only libraries that would take a quarter to swap out.
- **Boundary and scope decisions** — who owns which data. The explicit
  no-s count as much as the yes-s.
- **Deliberate deviations from the obvious path** — anything a reasonable
  reader would assume the opposite of, so the next engineer doesn't "fix"
  it.
- **Constraints not visible in the code** — compliance, infrastructure,
  partner contracts.
- **Rejected alternatives when the rejection is non-obvious.**
- **A rule every later feature must follow** — "every Company-owned table is
  deleted with its Company", "every Admin write is audited". The obligation
  is the decision, even when this feature's own use of it looks small.

### Not an ADR, even when it feels important

- Tunable numbers — thresholds, limits, durations, defaults.
- This feature's own behaviour — UX, messages, scope cuts.
- Ops runbooks — deploy order, seed steps.
- Consequences of an existing ADR — cite it instead.
- Implementation detail inside an ADR-worthy decision — id format, key
  names, header names. The ADR keeps the rule; the spec keeps the detail.

## Where candidates hide

Not only in the interview. Check:

- Every `D{n}` — **each bullet** of a bundled one (e.g. "decided from code,
  not asked"), and the ones the red team added.
- `legal.md` — its assumptions and every CONDITIONAL requirement.
- `spec.md` › Implementation — settings and contracts that never became a
  `D{n}`.
- Any clause that says "future features", "every endpoint", "all …",
  "until we have …".

One ADR = one decision. Several `D{n}` that make one decision → one ADR
citing all of them; the source `D{n}` stays in `decisions.md` either way.
A draft whose `Source:` lists more than three `D{n}`, or whose title needs
"and", is usually a feature summary: split it or cut it down to the rule.

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

`docs/adr/NNNN-slug.md` — the highest number in `docs/adr/` plus one.
Create the folder on the first ADR. Skeleton:
[../templates/adr.md](../templates/adr.md).

**Hard limit: three sentences** in the body. No key names, header names,
or numbers unless that exact name or number is the decision. Over three →
split the ADR or move the detail back to the spec. The template's optional
sections are short bullet lists, never a way around the limit.
