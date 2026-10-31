# Template: docs/README.md

A one-screen map of `docs/`: what each folder holds, who writes it, and
when to read it. Written in the docs language. Follow
[markdown-style.md](../references/markdown-style.md).

## Rules

- **One row per folder**, added by the skill that creates the folder, the
  first time it does — plus one for `decisions.md`, the only file listed.
  Folders the project made itself get a row too when you find them without
  one.
- **Holds** says what is inside in plain words, not the folder's name
  again.
- Never list individual files.

## Template

```markdown
# Docs

What each folder is for. Start with `progress/board.md` to see where every
feature stands, and `decisions.md` before deciding anything.

| Folder | Holds | Written by | Read it when |
|---|---|---|---|
| `decisions.md` | every decision in the project, one line each, by subject, linking its full entry | warroom skills, as each decision lands | before asking or deciding anything |
| `features/{slug}/` | what one feature is: spec, decisions, flow, legal check, design prompts for screens not designed yet | warroom | working on that feature |
| `progress/` | the work in flight: `board.md` for every feature, then per feature its map, tickets, progress log, user trials, bugs | warroom skills | picking up or checking on work |
| `adr/` | rules every feature must follow (architecture decision records), one short file each | warroom, at its gate | starting any feature |
| `library-notes/` | what each library's docs recommend and warn about, for the installed version | warroom-build | writing code that uses the library |
| `bugs/` | investigations of bugs that don't belong to one feature | kiki-debug | the same bug seems to be back |
| `legal/` | Thai-law checks that don't belong to one feature | `/warroom legal` | before building anything those checks cover |
| `{folder}/` | {what is inside} | {who or what writes it} | {when someone needs it} |
```
