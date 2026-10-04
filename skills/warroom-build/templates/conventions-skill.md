# Template: .claude/skills/{framework}-{surface}/

A project's own conventions skill. Lives in the project repo, is loaded by
Claude Code like any skill, and is read by warroom-build before coding.
English throughout. Follow
[markdown-style.md](../../warroom/references/markdown-style.md).

## Rules

- **SKILL.md stays short** — what the area is, the folder structure, the
  rules that must never be broken, and the pattern index. Target under
  ~200 lines.
- **One `patterns/{layer}.md` per layer** the surface has: what the layer
  owns, what it must not do, one short example in this project's code, and
  the files that follow it best. Always include `testing.md` — the test
  runner, where tests live, and the e2e tool when the surface has a UI.
- **The folder structure fits the surface.** The skeleton below shows an
  API; pick the shape for the app type (see Folder structure by surface).
- **Code exists → describe it as it is.** A rule the existing code doesn't
  follow yet is a prefactor ticket, not a convention.
- **No code yet → write the rules agreed with the user**, and put
  `None yet — the first ticket that touches this layer sets it.` under Good
  examples. The first ticket replaces it with real files.
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
{the tree for this surface — see "Folder structure by surface" below}
```

## Flow

{how a request or a user action moves through the layers, one line per layer}

## Never break

- {rule}

## Patterns

| File | Covers |
|---|---|
| [patterns/{layer}.md](patterns/{layer}.md) | {what it covers} |

A layer with no pattern file → stop and ask before writing it.
````

## Folder structure by surface

Examples to adapt, not to copy — keep the feature-first idea, name the
layers after what the framework calls them.

**API** (`elysia-api`, `fastapi-api`, …)

```
src/
├── core/                    ← env, errors, auth, clients every feature uses
└── features/[feature]/
    ├── [feature].routes.ts
    ├── _common/
    └── [module]/            ← one use case
        ├── [module].handler.ts
        ├── [module].service.ts
        ├── [module].repository.ts
        ├── [module].schema.ts
        └── [module].test.ts
```

Flow: route → handler → service → repository.

**Web** (`tanstack-start-web`, `nextjs-web`, …)

```
src/
├── routes/                  ← file-based routes; thin, compose features
├── features/[feature]/
│   ├── components/          ← UI for this feature
│   ├── hooks/               ← data fetching and state (api client calls)
│   └── [feature].schema.ts  ← form schemas
├── components/ui/           ← shared design-system components
└── lib/                     ← api client setup, session, utilities
```

Flow: route → feature component → hook → api client.

**Mobile** (`expo-mobile`, …)

```
app/                         ← screens (expo-router) and navigation layouts
src/
├── features/[feature]/
│   ├── components/
│   └── hooks/
├── components/ui/
└── lib/                     ← api client setup, secure storage, utilities
```

Flow: screen → feature component → hook → api client.

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

- `{path to a file that follows this pattern well}` — or `None yet — the
  first ticket that touches this layer sets it.`
````
