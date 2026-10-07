# Review on three axes

Standards and Spec are from Matt Pocock's `code-review`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT); Newcomer
is warroom's. The spec source is the warroom ticket and the docs it covers.

- **Standards** — does the code follow this repo's documented standards?
- **Spec** — does the code do what the ticket asks?
- **Newcomer** — can a developer who knows nothing about the ticket tell
  what the code does?

All three run as **parallel subagents** so each keeps a clean context.
Report them side by side; never merge or rerank across axes — a change can
pass one and fail another.

## Two scopes

| | Ticket review | Feature review |
|---|---|---|
| When | end of every ticket, before its commit | every ticket `done`, before merge or PR |
| Fixed point | the ticket's start commit | merge-base with the default branch |
| Spec source | the ticket + what its Covers names | the whole feature folder + ADRs |
| Newcomer compares against | the ticket's **What to build** | spec.md › Solution |

## 1. Pin the diff and the sources

Diff: `git diff {fixed point}` (include uncommitted work); commits:
`git log {fixed point}..HEAD --oneline`. Empty diff → nothing to review.

`git diff` skips untracked files, so a file this ticket created and never
added is invisible to all three reviewers. First check `git status`: mark
each new file that belongs to this change with `git add -N {path}` (it only
makes the file show in the diff; nothing is staged), and delete or ignore
the ones that don't.

- **Spec source** — per the table above: tickets, the `D{n}`, the ADRs,
  spec.md › Seams and the Implementation sections touched, the legal items.
- **Standards source** — the project's conventions skill (SKILL.md and the
  `rules/` files for the layers touched), `.claude/rules/`, `CLAUDE.md`, lint
  config, the `docs/library-notes/` notes for what the diff touches — plus the
  smell baseline below.

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

## 2. Spawn all three in parallel

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

## 3. Compare and report

Put the Newcomer's summary next to **What to build** (ticket) or spec.md ›
Solution (feature). Matches → the code explains itself. Differs → a
finding: either the code says something other than what it does (rename,
restructure, clarify the test) or it does something other than intended.
Each "had to guess" item is a finding too.

Show the reports under `## Standards`, `## Spec`, and `## Newcomer`, then
one line: findings per axis and the worst in each. Review runs once per
scope — after fixing, recheck only the fixed findings, because a second
broad review never ends.
