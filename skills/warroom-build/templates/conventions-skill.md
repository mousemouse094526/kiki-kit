# Template: .claude/skills/{framework}-{surface}/

A project's own conventions skill. Lives in the project repo, is loaded by
Claude Code like any skill, and is read by warroom-build before coding.
English throughout. Follow
[markdown-style.md](../../warroom/references/markdown-style.md).

## Rules

- **SKILL.md stays short** — what the area is, the folder structure, the
  rules that must never be broken, and the pattern index. Target under
  ~200 lines.
- **One `patterns/{layer}.md` per layer** with code in it (router,
  handler, service, repository, schema, errors, testing, …): what the
  layer owns, what it must not do, one short example from this project's
  code, and the files that follow it best.
- **Describe the code as it is.** A rule nobody follows yet is a prefactor
  ticket, not a convention.
- **Never-break rules are few** — the ones a reviewer should block a merge
  for.
- Named `{framework}-{surface}` (see conventions.md › Naming), not after
  the project.
- No other project's name, paths, or code.

## SKILL.md

````markdown
---
name: {framework}-{surface}
description: >-
  How {project}'s {surface} code ({path}) is structured and written:
  {stack}. Use whenever writing, moving, or reviewing code under {path}.
---

# {Framework} {surface}

{One or two sentences: what lives here and the stack.}

## Folder structure

```
{path}/
├── features/
│   └── [feature]/
│       ├── [feature].routes.ts   ← {role}
│       ├── _common/              ← {what is shared inside a feature}
│       └── [module]/             ← one use case
│           ├── [module].handler.ts
│           ├── [module].service.ts
│           ├── [module].repository.ts
│           └── [module].schema.ts
├── shared/                       ← {cross-feature code}
└── {entry files}
```

## Request flow

{route → handler → service → repository, one line each on what each does}

## Never break

- {rule}

## Patterns

| File | Covers |
|---|---|
| [patterns/{layer}.md](patterns/{layer}.md) | {what it covers} |

A layer with no pattern file → stop and ask before writing it.
````

## patterns/{layer}.md

````markdown
# {Layer}

**Owns:** {what this layer is responsible for}

**Must not:** {what belongs to another layer}

## Shape

```ts
{a short example in this project's code}
```

## Rules

- {rule}

## Good examples

- `{path to a file that follows this pattern well}`
````
