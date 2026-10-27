# Next — pick the feature to work on

`/warroom next`. Reads `docs/progress/board.md` and hands back one Next
command. Writes only the rows of merged PRs (below), and a worktree when
the pick needs its own branch.

## First: merged PRs

Every row whose Left is `PR #{N}` and isn't Manual `true` → `gh pr view
{N} --json state,mergeCommit`. `MERGED` → Stage `done`, Build `✅ {short
sha of the merge commit}`, Left `—`, Next `—`; set that feature's
`progress.md` › Now to "merged". Commit those on the default branch
(`docs: mark merged features done`) — pull it first, never on a feature
branch. `gh` missing or not signed in → say so in one line and go on.

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
- Run it here → the current branch is another feature's `feat/…` →
  don't run it in this folder; make a worktree instead:
  `git worktree add ../{repo}-{slug} -b feat/{slug} {default branch}` (or
  the existing `feat/{slug}`), and end with
  `cd ../{repo}-{slug} && claude "{Next}"` in its own code block, to paste
  in a new terminal. Otherwise (on the default branch or `feat/{slug}`) →
  follow that skill as if the user had typed the command.
- Planning commands (`/warroom {slug}`, `/warroom tickets {slug}`) write
  only docs and need no branch of their own.
- No row can move → say what each row waits on, and end with the command
  that unblocks the top one.
