# Template: docs/progress/board.md

Each feature's detail is in `docs/progress/{slug}/`. Follow
[markdown-style.md](../references/markdown-style.md). Labels, stage words,
and commands stay in English; the text is in the docs language.

## Rules

- **Read Settings first.** Before writing any row, read the board's
  Settings table. The cells it lists as **User writes** for that feature
  belong to the user: never write, clear, or reformat them — keep what is
  there, and leave them empty in a new row. Everything else in the
  session runs as usual (spec › Design Source, Blocked rows, the Next
  command in chat); only the board cell is skipped. A feature not listed,
  or a board with no Settings, → the agent writes every cell. Only the
  user adds or removes Settings rows.
- **Settings cells** are UI, Build, Left, Next; Feature and Stage are
  always the agent's. Build is the user's → Next is `/pr-open` once Stage
  is `review` with no `open` Blocked row, and pr-open skips the `✅`
  check for that feature.
- **One row per feature**, added by warroom the first time it writes for
  that feature.
- **Updated by whichever warroom skill ran last** for that feature, at the
  end of its session — warroom, warroom-build, warroom-trial. Only that
  feature's row changes.
- **Stage** is one of:
  - `mapping` — map.md has open questions;
  - `planning` — spec is `draft`;
  - `ready` — spec `ready-to-build`, tickets cut, nothing built yet;
  - `building` — some ticket `done` or `in-progress`;
  - `blocked` — the next step is an `open` Blocked row;
  - `review` — every ticket done, feature review or PR pending;
  - `done` — merged.
- **UI** — whether the screens have a design, from spec › Design:
  - `—` — the feature has no screens, or spec › Design isn't written yet;
  - `⏳ {n}/{total}` — some screens still `pending`;
  - `🎨 {total}/{total}` — every screen has a Source.

  It changes when a Source is filled: the user pastes a design link
  (`/warroom {slug}`), or a skill makes the screen in Figma through the
  Figma MCP and puts that frame's link in Source. Whoever fills a Source
  updates this cell in the same session.
- **Build** — whether the feature is built and green:
  - `{done}/{total}` — tickets `done` out of all;
  - `✅ {short sha}` — every ticket done, the feature review passed, and
    every CI check green at that commit;
  - `❌ {short sha}` — a CI check red at that commit.

  Only `✅` makes Next `/pr-open`. warroom-build writes it after each
  ticket and after the feature review; the first commit that changes code
  after `✅` sets it back to `{done}/{total}` until the checks run again.
- **Left** says what is still to do in a few words: `tickets 03–04`,
  `2 open questions`, `Blocked #2`.
- **Next** is the exact command to paste, or `—` when `done`.
- A board without the UI and Build columns (an older one) → add them the
  next time any row is written: UI from each spec › Design, Build from
  each `progress.md` Tickets table (`✅` only once the checks are run).

## Template

```markdown
# Board

Where every feature stands. Detail per feature in `progress/{slug}/`.

## Settings

Cells the agent leaves alone; you fill them yourself. Add a row only for a
feature where you want that.

| Feature | User writes |
|---|---|
| company-user | UI |
| phone-international | UI, Build |

## Features

| Feature | Stage | UI | Build | Left | Next |
|---|---|---|---|---|---|
| [user-contact](user-contact/progress.md) | done | 🎨 2/2 | ✅ 4f1c2ab | — | — |
| [company-user](company-user/progress.md) | review | 🎨 3/3 | ✅ 1c92373 | open the PR | `/pr-open` |
| [phone-international](phone-international/progress.md) | building | ⏳ 1/2 | 1/3 | tickets 02–03 | `/warroom-build phone-international 02` |
| [loyalty-points](loyalty-points/map.md) | mapping | — | — | 4 open questions | `/warroom loyalty-points` |
```
