# Project conventions — live in the project, not in these skills

How this project writes code — folders, layers, naming, errors, where tests
live — belongs to the **project**, in a conventions skill it owns. These
skills only know where to find it, how to set it up, and when to update it.
Never copy one project's conventions into a skill or into another project.

Conventions answer "how do we build here"; `docs/reference/` answers "how
does the library work". When they disagree, the convention wins for
structure and the reference note wins for library behaviour.

## Where they are

Read, in this order, whatever exists for the area a ticket touches:

1. `CLAUDE.md` at the repo root and in the app or package touched.
2. `.claude/rules/*.md`.
3. `.claude/skills/{framework}-{surface}/` — its `SKILL.md`, then only the
   `patterns/*.md` for the layers touched.

The build follows them; the Standards reviewer checks against them.

## Set them up — warroom-tickets, before slicing

An area the spec puts code in with no conventions yet → set them up before
cutting a single ticket, so no build invents a structure and no prefactor
shows up later out of order.

1. Read the existing code there and list the patterns it already follows.
2. Propose in chat: folder tree, layers, the few rules that must never
   break, and the testing stack — the runner, and when there is a UI the
   e2e tool, where e2e tests live, and how they start the apps (one shared
   e2e package such as `apps/e2e` when flows cross apps). Ask with
   AskUserQuestion: accept (Recommended) / adjust.
3. Write `.claude/skills/{framework}-{surface}/` from
   [templates/conventions-skill.md](../templates/conventions-skill.md),
   plus a short `CLAUDE.md` for the app that points at it.
4. Record it as a `D{n}` (`**From:** warroom-tickets`).
5. Existing code that doesn't match → prefactor tickets, numbered first.

**Naming:** after the stack and surface, never the project —
`elysia-api`, `tanstack-start-web`, `expo-mobile`, `fastapi-api`. One skill
per app type, shared by every app of that type in the repo.

## Keep them current — warroom-build

- A ticket that sets or changes a pattern updates its `patterns/{layer}.md`
  **in the same commit** as the code, so the rule and the first example
  never drift apart.
- A layer with no pattern yet (the first background job, the first upload)
  is a structural choice local to the ticket: ask how it should work, add
  `patterns/{layer}.md` and its index row, then write the code.
- `SKILL.md` stays short — structure, never-break rules, pattern index;
  detail lives in `patterns/` so it loads only when needed. English, like
  code.
