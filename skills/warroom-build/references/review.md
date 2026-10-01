# Review on three axes

Standards and Spec are from Matt Pocock's `code-review`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT); Newcomer
is warroom's. The spec source is the warroom ticket and the docs it covers.

- **Standards** — does the code follow this repo's documented standards?
- **Spec** — does the code faithfully implement the ticket?
- **Newcomer** — can a developer who knows nothing about the ticket tell
  what the code does?

All three run as **parallel subagents** so they don't pollute each other's
context. Report them side by side; never merge or rerank across axes — a
change can pass one and fail another.

## Two scopes

| | Ticket review | Feature review |
|---|---|---|
| When | end of every ticket, before its commit | every ticket `done`, before merge or PR |
| Fixed point | the ticket's start commit | merge-base with the default branch |
| Spec source | the ticket + what its Covers names | the whole feature folder + ADRs |
| Newcomer compares against | the ticket's **What to build** | spec.md › Solution |

## 1. Pin the diff

Diff: `git diff {fixed point}` (include uncommitted work); commits:
`git log {fixed point}..HEAD --oneline`. Empty diff → stop, nothing to
review.

## 2. Gather the sources

- **Spec source** — per the table above: tickets, the `D{n}` in
  decisions.md, the ADRs, spec.md › Seams and the Implementation sections
  touched, the legal items.
- **Standards source** — `CLAUDE.md`, `CODING_STANDARDS.md`,
  `CONTRIBUTING.md`, lint config, the best practices in `docs/reference/`
  notes for what the diff touches — plus the smell
  baseline below.

<smell-baseline>

A documented repo standard always wins; each smell is a judgement call,
never a hard violation. Skip anything tooling enforces.

- **Mysterious Name** — the name doesn't reveal what it does or holds → rename.
- **Duplicated Code** — the same logic shape in more than one hunk → extract.
- **Feature Envy** — reaches into another object's data more than its own → move it there.
- **Data Clumps** — the same fields travel together → bundle into one type.
- **Primitive Obsession** — a primitive standing in for a domain concept → give it a type.
- **Repeated Switches** — the same branching on the same type recurs → one map or polymorphism.
- **Shotgun Surgery** — one change forces scattered edits → gather into one module.
- **Divergent Change** — one module edited for unrelated reasons → split it.
- **Speculative Generality** — hooks or parameters the spec doesn't need → delete.
- **Message Chains** — long `a.b().c().d()` navigation → hide behind one method.
- **Middle Man** — a unit that only delegates → call the real target.
- **Refused Bequest** — ignores most of what it inherits → use composition.

</smell-baseline>

## 3. Spawn all three in parallel

**Standards** gets the diff command, the standards sources, the smell
baseline pasted in full, and: "Report each place the diff violates a
documented standard (cite file + rule) and each baseline smell you see (name
it, quote the hunk). Documented breaches can be hard; smells are judgement
calls. Under 400 words. Do not edit files."

**Spec** gets the diff command, the spec-source paths, and: "Report
(a) acceptance criteria or requirements missing or partial; (b) behaviour
not asked for — scope creep or another ticket's work; (c) behaviour that
looks implemented but wrong, including ADR and legal requirements;
(d) tests outside the agreed seams, coupled to internals, or tautological.
Feature review also: (e) the same thing done two ways or named two ways
across tickets. Quote the ticket or spec line for each. Under 400 words. Do
not edit files."

**Newcomer** gets **only** the diff command and the repo — no ticket, no
docs, no feature name — and: "You just joined this team. Read this change
and the code around it. (1) In 3–5 sentences, what does this change do, and
why would someone want it? (2) List every place you had to guess: a name
that misled you, logic you couldn't follow, a test whose purpose wasn't
clear. Don't read anything under docs/. Under 300 words. Do not edit
files."

## 4. Compare the Newcomer's summary

Put the Newcomer's summary next to **What to build** (ticket review) or
spec.md › Solution (feature review):

- **Matches** → the code explains itself.
- **Differs** → a finding. Either the code says something other than what
  it does (rename, restructure, clarify the test) or it does something
  other than intended (a Spec problem the Spec axis may have missed).

Each "had to guess" item is a finding on its own.

## 5. Aggregate

Show the reports under `## Standards`, `## Spec`, and `## Newcomer` (its
summary, the comparison, its guesses). End with one line: findings per axis
and the worst issue within each axis.

## Once per scope

Review compares code against the spec, so it runs when the behaviour is
complete. After fixing, run focused checks on the fixed findings only — a
second broad review turns into an endless loop.
