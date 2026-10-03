# Project conventions — live in the project, not in this skill

How this project writes code — folder structure, layers, naming, error
handling, test placement — belongs to the **project**. This skill only
knows where to find it, how to create it when it is missing, and when to
update it. Never copy a project's conventions into this skill, and never
carry one project's conventions into another.

Conventions answer "how do we build here". `docs/reference/` answers "how
does the library work". Keep them apart.

## 1. Find them

Read, in this order, whatever exists for the area the ticket touches:

1. `CLAUDE.md` at the repo root and in the app or package the ticket
   touches (`apps/api/CLAUDE.md`, …).
2. `.claude/rules/*.md`.
3. Project skills under `.claude/skills/` — the one for this area, e.g.
   `.claude/skills/{project}-api/`: its `SKILL.md`, then only the
   `patterns/*.md` files for the layers the ticket touches.

What they say is the project standard: the build follows it and the
Standards reviewer checks against it. When they conflict with a
`docs/reference/` note, the project convention wins for structure; the
reference note wins for what the library actually does.

## 2. Missing — create them before coding

Normally warroom-tickets sets conventions up before slicing. Still none for
the area the ticket touches → stop before the first line of code:

1. Read the existing code in that area and list the patterns it already
   follows (folders, layers, validation, errors, tests).
2. Propose a structure in chat — folder tree, layers, the few rules that
   must never be broken — and ask with AskUserQuestion: accept
   (Recommended) / adjust. Never borrow another project's conventions
   unless the user names it.
3. Write the project skill from
   [templates/conventions-skill.md](../templates/conventions-skill.md):
   `.claude/skills/{project}-{area}/SKILL.md` plus one
   `patterns/{layer}.md` per layer that has code, and a short `CLAUDE.md`
   for the app that points at it.
4. Record the structure as a `D{n}` (and an ADR when it qualifies).
5. Existing code that doesn't match → stop and recommend
   `/warroom-tickets {slug}` to re-cut: it numbers the prefactor before the
   tickets it unblocks. Never append a higher-numbered blocker by hand,
   and never rewrite it silently inside this ticket.

## 3. Missing pattern — stop and ask

The skill exists but has no pattern for a layer the ticket needs (the
first background job, the first file upload) → ask how that layer should
work, then add `patterns/{layer}.md` and a row in the skill's pattern
index before writing the code.

## 4. Keep them current

- A ticket that establishes or changes a pattern updates the pattern file
  **in the same commit** as the code.
- The `SKILL.md` stays short: structure, never-break rules, and the
  pattern index. Detail goes in `patterns/` so it loads only when needed.
- Everything in the project skill is English, like code.
