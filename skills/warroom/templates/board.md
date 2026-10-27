# Template: docs/progress/board.md

Each feature's detail is in `docs/progress/{slug}/`. Follow
[markdown-style.md](../references/markdown-style.md). Labels, stage words,
and commands stay in English; the text is in the docs language.

## Rules

- **Manual** — `true` or `false`, set only by the user. `true` → the row
  belongs to the user: no agent writes, clears, or reformats any of its
  cells. The feature's own work still runs as usual (spec, tickets,
  `progress.md`, Blocked rows, the Next command in chat); only the board
  row is skipped. A new row gets `false`; a board without the column (an
  older one) gets it the next time any row is written, every row `false`.
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
- **Row order is priority.** The user moves rows to reorder; agents never
  reorder. `/warroom next` takes the first row that can move — see
  [references/next.md](../references/next.md).
- A board without the UI and Build columns (an older one) → add them the
  next time any row is written: UI from each spec › Design, Build from
  each `progress.md` Tickets table (`✅` only once the checks are run).

## Template

```markdown
# Board

Where every feature stands. Detail per feature in `progress/{slug}/`.

| Feature | Manual | Stage | UI | Build | Left | Next |
|---|---|---|---|---|---|---|
| [user-contact](user-contact/progress.md) | false | done | 🎨 2/2 | ✅ 4f1c2ab | — | — |
| [company-user](company-user/progress.md) | true | review | 🎨 3/3 | ✅ 1c92373 | open the PR | `/pr-open` |
| [phone-international](phone-international/progress.md) | false | building | ⏳ 1/2 | 1/3 | tickets 02–03 | `/warroom-build phone-international 02` |
| [loyalty-points](loyalty-points/map.md) | false | mapping | — | — | 4 open questions | `/warroom loyalty-points` |
```
