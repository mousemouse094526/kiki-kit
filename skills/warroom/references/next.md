# Next — pick the feature to work on

`/warroom next`. Reads `docs/progress/board.md` and hands back one Next
command. Writes nothing.

## Which row

Walk the rows top to bottom; row order is the user's priority. Take the
first row where all of these hold:

1. **Manual** is `false` (or the column is missing). A `true` row is the
   user's.
2. **Stage** is not `done`, and Next is not `—`.
3. **Stage** is not `blocked` — unless Next is a command that clears the
   block (`/warroom {slug}`, `/kiki-debug …`); then it can move.
4. **Nothing upstream is open.** Open the ticket Next points at (or the
   lowest ticket not `done` in `progress.md`) and read **Blocked by**. Each
   `{NN}` must be `done` in this feature's `progress.md`; each
   `{other-slug} {NN}` must be `done` in that feature's `progress.md`.
   Older tickets that say it only in prose ("รอ company-user ticket 28",
   "waits on …") count the same — check that ticket too.

## Then

- Show the pick in one line: feature, Stage, why the rows above it were
  skipped (one short reason each — `Manual`, `waits on company-user 28`).
- Ask with AskUserQuestion: **Run it here** (Recommended) / **Paste in a
  new session** / **Pick another row**.
- Run it here → follow that skill as if the user had typed the command.
- No row can move → say what each row waits on, and end with the command
  that unblocks the top one.
