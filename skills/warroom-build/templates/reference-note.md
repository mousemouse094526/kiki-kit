# Template: docs/reference/{name}.md

One note per language, runtime, or library: the best practices this
project follows and what the docs don't say about how it is used here.
Follow [markdown-style.md](../../warroom/references/markdown-style.md).

## Rules

- **Written before the first code that uses it**, then extended by later
  tickets.
- **Summarise and link** — never paste docs pages.
- **Best practices** come from official sources only, each with its link.
- **Pattern** is one short example written for this project in its style —
  not copied from the docs — with the page it follows.
- **How we use it** cites the `D{n}` or ADR behind each choice.
- **Traps** link the doc page or `docs/debug/` record that proves them.
- **Sources** lists every page fetched for this note, with its access date;
  each bullet above links the page it came from.
- Sections with nothing to say are dropped (Sources never is).

## Template

````markdown
# {name}

**Kind:** language | runtime | library

**Version:** {installed version, and strictness settings for a language}

**Docs:** {llms.txt or official docs URL}

## Best practices

- {recommended idiom} — [{page}]({url})
- **Avoid:** {what the docs warn against} — [{page}]({url})

## Pattern

```{lang}
{a short example in this project's style}
```

Follows [{page}]({url}).

## How we use it

- {choice} ({D18}, {ADR 0007})

## Traps

- {behaviour that surprised us} — [{source}]({doc link or docs/debug/… record})

## Sources

- [{page title}]({url}) — {what it backs} (accessed {YYYY-MM-DD})
````
