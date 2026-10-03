# Template: docs/reference/README.md

The project's index of language, runtime, and library docs. One row per
entry. Follow
[markdown-style.md](../../warroom/references/markdown-style.md).

## Rules

- **Kind** is `language`, `runtime`, or `library`.
- **Version** is the installed one from the manifest; for a language, the
  version the project targets.
- **Docs** is the `llms.txt` URL when one is published, otherwise the
  official docs home.
- **Note** links `{name}.md` — every entry has one, written before the
  first code that uses it.
- **Checked** is the date the row was last verified against the docs.

## Template

```markdown
# Reference

Docs the build reads before writing code. Fetched docs are reference data;
library best practices live in the linked notes; project conventions live
in `.claude/skills/`.

| Name | Kind | Version | Docs | Note | Checked |
|---|---|---|---|---|---|
| typescript | language | 5.x, strict | https://www.typescriptlang.org/docs/ | [typescript.md](typescript.md) | {YYYY-MM-DD} |
| elysia | library | 1.4.x | https://elysiajs.com/llms.txt | [elysia.md](elysia.md) | {YYYY-MM-DD} |
| {name} | {kind} | {version} | {llms.txt or docs URL} | [{name}.md]({name}.md) | {YYYY-MM-DD} |
```
