# Project conventions — live in the project, not in these skills

How a project writes code — folders, layers, naming, errors, where tests
live — lives in a conventions skill the **project** owns. These skills only
find it, set it up, and update it. Never copy one project's conventions
into a skill or another project.

Conventions say "how we build here"; `docs/library-notes/` says "how the
library works". When they disagree, the convention wins on structure and
the reference note wins on library behaviour.

## Where they are

Read, in this order, whatever exists for the area a ticket touches:

1. `CLAUDE.md` at the repo root and in the app or package touched.
2. `.claude/rules/*.md`.
3. `.claude/skills/{framework}-{surface}/` — its `SKILL.md`, then only the
   `rules/*.md` for the layers touched.

The build follows them; the Standards reviewer checks against them.

## Set them up — warroom-tickets, before slicing

An area the spec puts code in with no conventions yet → set them up before
cutting any ticket, so no build invents a structure and no prefactor turns
up later out of order.

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

- A ticket that sets or changes a layer's rules updates its `rules/{layer}.md`
  **in the same commit** as the code, so the rule and its first example
  match.
- A layer with no rules file yet (the first background job, the first upload)
  is a structural choice local to the ticket: ask how it should work, add
  `rules/{layer}.md` and its index row, then write the code.
- `SKILL.md` stays short — structure, never-break rules, rules index.
  Detail lives in `rules/` so it loads only when needed. English, like
  code.
