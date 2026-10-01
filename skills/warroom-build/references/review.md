# Review on two axes

From Matt Pocock's `code-review` ([mattpocock/skills](https://github.com/mattpocock/skills),
MIT). The spec source is the warroom ticket and the docs it covers.

- **Standards** — does the code follow this repo's documented standards?
- **Spec** — does the code faithfully implement the ticket?

Both axes run as **parallel subagents** so they don't pollute each other's
context. Report them side by side; never merge or rerank across axes — a
change can pass one and fail the other.

## 1. Pin the diff

Fixed point = the ticket's start commit. Diff: `git diff {start}` (include
uncommitted work); commits: `git log {start}..HEAD --oneline`. Empty diff →
stop here, nothing to review.

## 2. Gather the sources

- **Spec source** — the ticket file, plus what its Covers names: the `D{n}`
  in decisions.md, the ADRs, spec.md › Seams and the Implementation
  sections it touches, the legal items.
- **Standards source** — `CLAUDE.md`, `CODING_STANDARDS.md`,
  `CONTRIBUTING.md`, lint config — plus the smell baseline below.

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

## 3. Spawn both subagents in parallel

**Standards** gets the diff command, the standards files, the smell baseline
pasted in full, and: "Report each place the diff violates a documented
standard (cite file + rule) and each baseline smell you see (name it, quote
the hunk). Documented breaches can be hard; smells are judgement calls.
Under 400 words. Do not edit files."

**Spec** gets the diff command, the spec-source paths, and: "Report
(a) acceptance criteria missing or partial; (b) behaviour not asked for —
scope creep or another ticket's work; (c) behaviour that looks implemented
but wrong, including ADR and legal requirements; (d) tests outside the
ticket's seams, coupled to internals, or tautological. Quote the ticket or
spec line for each. Under 400 words. Do not edit files."

## 4. Aggregate

Show both reports under `## Standards` and `## Spec`. End with one line:
findings per axis and the worst issue within each axis.

## Only once per ticket

Review compares code against the spec, so it runs when the ticket's
behaviour is complete. After fixing, run focused checks on the fixed
findings only — a second broad review turns into an endless loop.
