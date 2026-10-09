# Template: .claude/skills/{framework}-{surface}/

A project's own conventions skill. It lives in the project repo, loads
like any skill, and warroom-build reads it before coding. English
throughout. Follow
[markdown-style.md](../references/markdown-style.md).

## Rules

- **SKILL.md stays short** — what the area is, the folder structure, the
  never-break rules, and the rules index. Under ~200 lines.
- **One `rules/{layer}.md` per layer** the surface has: what the layer
  owns, what it must not do, one short example in this project's code, and
  the files that follow it best. Always include `testing.md` — the test
  runner, where tests live, and the e2e tool when the surface has a UI.
- **The folder structure fits the surface.** The skeleton below shows an
  API; pick the shape for the app type (see Folder structure by surface).
- **Code exists → describe it as it is.** A rule the existing code doesn't
  follow yet is a prefactor ticket, not a convention.
- **No code yet → write the rules agreed with the user**, and put
  `None yet — the first ticket that touches this layer sets it.` under Good
  examples. That first ticket replaces it with real files.
- **Never-break rules are few** — only those a reviewer should block a
  merge for.
- Named `{framework}-{surface}` (see [conventions.md](../references/conventions.md) › Naming), not after
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

{1–2 sentences: what code lives here and which stack it uses.}

## Folder structure

```
{the tree for this surface — see "Folder structure by surface" below}
```

## Flow

{how a request or user action passes through the layers, one line per layer}

## Never break

- {a rule a reviewer would block a merge for}

## Rules by layer

| File | Covers |
|---|---|
| [rules/{layer}.md](rules/{layer}.md) | {what this layer's file covers} |

A layer with no rules file → stop and ask before writing it.
````

## Folder structure by surface

Adapt these, don't copy them: keep the feature-first idea and name the
layers what the framework calls them.

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

## rules/{layer}.md

````markdown
# {Layer}

**Owns:** {what this layer is responsible for}

**Must not:** {what this layer must leave to another layer, and which}

## Shape

```ts
{a short example in this project's code}
```

## Rules

- {one rule for code in this layer}

## Good examples

- `{path to a file that follows these rules well}` — or `None yet — the
  first ticket that touches this layer sets it.`
````
