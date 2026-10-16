# Template: docs/progress/board.md

Each feature's detail is in `docs/progress/{slug}/`. Follow
[markdown-style.md](../references/markdown-style.md). Labels, stage words,
and commands stay in English; the text is in the docs language.

## Rules

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
- **Left** says what is still to do in a few words: `tickets 03–04`,
  `2 open questions`, `Blocked #2`.
- **Next** is the exact command to paste, or `—` when `done`.

## Template

```markdown
# Board

Where every feature stands. Detail per feature in `progress/{slug}/`.

| Feature | Stage | Left | Next |
|---|---|---|---|
| [user-contact](user-contact/progress.md) | done | — | — |
| [phone-international](phone-international/progress.md) | building | tickets 02–03 | `/warroom-build phone-international 02` |
| [loyalty-points](loyalty-points/map.md) | mapping | 4 open questions | `/warroom loyalty-points` |
```
