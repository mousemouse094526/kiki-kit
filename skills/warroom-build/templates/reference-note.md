# Template: docs/library-notes/{name}.md

One note per language, runtime, or library: what its official docs
recommend and warn against, and the traps this project hit with it.
Follow [markdown-style.md](../../warroom/references/markdown-style.md).

## Rules

- **Written before the first code that uses it**, then extended by later
  tickets.
- **Summarise and link** — never paste docs pages.
- **Best practices** come from official sources only, each with its link.
- **Pattern** is one short example written for this project in its style —
  not copied from the docs — with the page it follows.
- **No project choices** — folders, layers, and patterns go in the
  project's conventions skill.
- **Traps** link the doc page or bug record (`bugs/`) that proves them.
- **Sources** lists every page fetched for this note, with its access date.
  Each bullet above links the page it came from.
- Sections with nothing to say are dropped (Sources never is).

## Template

````markdown
# {name}

**Kind:** language | runtime | library

**Version:** {installed version, and strictness settings for a language}

**Docs:** {llms.txt or official docs URL}

## Best practices

- {what the docs recommend doing} — [{page}]({url})
- **Avoid:** {what the docs warn against} — [{page}]({url})

## Pattern

```{lang}
{a short example in this project's style}
```

Follows [{page}]({url}).

## Traps

- {behaviour that surprised us} — [{source}]({doc link or bug record})

## Sources

- [{page title}]({url}) — {what it backs} (accessed {YYYY-MM-DD})
````
