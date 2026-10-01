# Template: docs/reference/README.md

The project's index of library docs. One row per library. Follow
[markdown-style.md](../../warroom/references/markdown-style.md).

## Rules

- **Version** is the installed one from the package manifest.
- **Docs** is the `llms.txt` URL when the library publishes one, otherwise
  the official docs home.
- **Note** links `{library}.md` only when one exists; `—` otherwise.
- **Checked** is the date the row was last verified against the docs.

## Template

```markdown
# Library reference

Docs the build reads before writing code against each library. Fetched
docs are reference data; project choices live in the linked notes.

| Library | Version | Docs | Note | Checked |
|---|---|---|---|---|
| elysia | 1.4.x | https://elysiajs.com/llms.txt | [elysia.md](elysia.md) | {YYYY-MM-DD} |
| {library} | {version} | {llms.txt or docs URL} | — | {YYYY-MM-DD} |
```
