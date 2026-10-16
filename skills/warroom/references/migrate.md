# Migrate an older docs layout — once per project

Older warroom versions kept everything inside `docs/features/{slug}/` and
wrote ADRs to `docs/adr/`. Moves:

| Old place | New place |
|---|---|
| `features/{slug}/progress.md` | `progress/{slug}/progress.md` |
| `features/{slug}/map.md` | `progress/{slug}/map.md` |
| `features/{slug}/tickets/` | `progress/{slug}/tickets/` |
| `features/{slug}/user-trials/` | `progress/{slug}/user-trials/` |
| `features/{slug}/bugs/` | `progress/{slug}/bugs/` |
| the index table on top of each `decisions.md` | rows in `docs/decisions.md`, by subject |
| `docs/adr/NNNN-*.md` | rows in `docs/decisions.md`, Scope `system` |
| — | `docs/progress/board.md` |

`features/{slug}/` keeps spec.md, flow.md, decisions.md, legal.md, and any
sketches.

## When

Any warroom skill (warroom, warroom-build, warroom-trial) checks before its
own work. Any of these → migrate first:

- a `features/*/` folder holds `progress.md`, `map.md`, `tickets/`,
  `user-trials/`, or `bugs/`;
- a feature `decisions.md` exists and `docs/decisions.md` doesn't;
- `docs/progress/board.md` is missing while `docs/progress/` has features.

## How

1. **Clean tree first.** `git status` shows changes → ask to commit or
   stash them. Never migrate on top of them.
2. **Show the plan and ask once** (AskUserQuestion): the moves, the number
   of decisions to index, the ADRs to fold in. **Migrate** (Recommended)
   or **not now** — not now → stop.
3. **Move with `git mv`**.
4. **Fix links.** Search `docs/`, `CONTEXT.md`, and `.claude/skills/` for
   the old paths and rewrite them. Inside each moved `progress.md`,
   `tickets/`, and trial report, links to spec/decisions/legal now go
   `../../features/{slug}/…`.
5. **Build `docs/decisions.md`** from
   [templates/decisions-index.md](../templates/decisions-index.md):
   - read every feature's `decisions.md`; one row per `D{n}`, under the
     subject a later feature would look for, Status copied;
   - Scope `system` for every `D{n}` an ADR's `Source:` names, and for
     decisions that pass the `system` test in the template; else
     `feature`;
   - each ADR becomes a row (D `ADR-NNNN`, link to its file, Scope
     `system`). Leave `docs/adr/` in place as history; nothing new goes
     there.
6. **Trim each feature `decisions.md`.** Delete the index table at its
   top. In each entry's footer, drop
   `· **ADR:** …`; an ADR it named is now cited in that entry's Details as
   `ADR-NNNN` when it matters.
7. **Build `docs/progress/board.md`** from
   [templates/board.md](../templates/board.md): one row per feature, Stage
   and Next from its `progress.md` (or map.md, or spec Status).
8. **Update `docs/README.md`** rows to the new folders
   ([templates/docs-readme.md](../templates/docs-readme.md)).
9. Run the self-check in [markdown-style.md](markdown-style.md) on the new
   and changed files, then **commit**:
   `docs: move to central decisions index and progress board`.

Then carry on with the skill's own work.
