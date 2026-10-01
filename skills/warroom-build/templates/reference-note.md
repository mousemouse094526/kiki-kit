# Template: docs/reference/{library}.md

A short note per library: what the docs don't tell this project. Follow
[markdown-style.md](../../warroom/references/markdown-style.md).

## Rules

- **Summarise and link** — never paste docs pages.
- **How we use it** holds this project's choices, each citing its `D{n}`
  or ADR when one exists.
- **Traps** are behaviours that surprised a build or a debug session, each
  with the doc link or debug record that proves it.
- Sections with nothing to say are dropped.

## Template

```markdown
# {library}

**Version:** {installed version}

**Docs:** {llms.txt or official docs URL}

## Pages we used

- [{page title}]({url}) — {what this project needed from it}

## How we use it

- {choice} ({D18}, {ADR 0007})

## Traps

- {behaviour that surprised us} — [{source}]({doc link or docs/debug/… record})
```
