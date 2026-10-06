# Template: docs/README.md

A one-screen map of `docs/`: what each folder holds, who writes it, and
when to read it — so nobody opens a folder wondering why it exists. Written
in the docs language. Follow
[markdown-style.md](../references/markdown-style.md).

## Rules

- **One row per folder**, added by the skill that creates the folder, the
  first time it does. Folders the project made itself get a row too when
  you find them without one.
- **Holds** says what is inside in plain words, not the folder's name
  again.
- Never list individual files — the folders' own indexes do that.

## Template

```markdown
# Docs

What each folder is for. Start with `features/` to see what is being built.

| Folder | Holds | Written by | Read it when |
|---|---|---|---|
| `features/{slug}/` | everything for one feature: spec, decisions, legal check, tickets, user trials, bugs, open items | warroom skills | working on that feature |
| `adr/` | rules every feature must follow (architecture decision records), one short file each | warroom, at its gate | starting any feature |
| `library-notes/` | what each library's docs recommend and warn about, for the installed version | warroom-build | writing code that uses the library |
| `bugs/` | investigations of bugs that don't belong to one feature | warroom-debug | the same bug seems to be back |
| `{folder}/` | {what is inside} | {who or what writes it} | {when someone needs it} |
```
