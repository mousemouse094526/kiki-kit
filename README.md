# kiki-kit

Claude Code skills, packaged as a plugin.

| Skill | Does |
|---|---|
| `warroom` | Plan one feature on paper until nothing is left to decide (a map over several sessions when it is too big for one): interview, spec/decisions/flow/legal docs, five-reviewer red team, ADR sweep; only a `ready-to-build` spec (no blocking Open Questions) passes the gate. No code |
| `warroom-tickets` | Set up the project's conventions skill where missing, then split a ready spec into tracer-bullet tickets with blocking edges, under `tickets/`. Runs automatically after the warroom gate. No code |
| `warroom-build` | Build one ticket per session: reference notes for the installed library versions (`llms.txt` first), TDD at the agreed seams, full suite, three-axis review (Standards, Spec, Newcomer), commit. Implements decisions, never makes them — anything undecided goes to `open-items.md`. `--review-feature` reviews the whole branch before merge |
| `warroom-debug` | Debug any failure: reproduce, narrow scope, falsify ranked hypotheses with an Outsider subagent, ledger, regression test, postmortem record in the feature's `bugs/` folder |
| `warroom-trial` | Role-played users (from the spec's actors and real-world roles) try the running app on localhost without seeing the code; findings triaged into bug / spec gap / friction in one trial report |
| `warroom-legal` | "Can we do this under Thai law?" Per-item verdicts (ALLOWED / NOT ALLOWED / CONDITIONAL) with sources, in one `legal.md` |
| `mermaid-flow` | Readable Mermaid diagrams, checked for correctness before delivery |
| `brandsmith` | Brand logo package: wordmark, app icons, profile marks, PNGs, concept doc, light/dark variants |

Flow: `warroom` → (gate) → `warroom-tickets` automatically → `warroom-build` (once per ticket, `warroom-debug` when something fails unexplained) → `warroom-trial` once tickets can be demoed.
Which skill calls which, and where each one hands back to you: [docs/flow.md](docs/flow.md) ([ไทย](docs/flow.th.md)).
`warroom` uses `mermaid-flow` and `warroom-legal` from this plugin.

Credits:
- Matt Pocock ([mattpocock/skills](https://github.com/mattpocock/skills), MIT):
  `domain-modeling` (glossary, ADRs), `to-tickets`, `implement`, `tdd`,
  `code-review`, `diagnosing-bugs`.
- 9arm's `debug-mantra` ([thananon/9arm-skills](https://github.com/thananon/9arm-skills)):
  the four debug mantras.
- lyndonkl's `postmortem` ([lyndonkl/claude](https://github.com/lyndonkl/claude)):
  the blameless postmortem.

## Install

```bash
claude plugin marketplace add mousemouse094526/kiki-kit
claude plugin install kiki-kit@kiki
```

Inside Claude Code: `/plugin marketplace add mousemouse094526/kiki-kit`, then
`/plugin install kiki-kit@kiki`. Installs at user scope (every project).
Restart Claude Code.

Optional tools:

| Tool | Needed by |
|---|---|
| `rsvg-convert` (`brew install librsvg`), ImageMagick, or Chrome | `brandsmith` PNG export |
| `python3` | `mermaid-flow` linter |

## Update

After a push, on each machine:

```bash
claude plugin marketplace update kiki
claude plugin update kiki-kit@kiki
```

Restart Claude Code. `plugin.json` has no `version`, so every commit counts as a
new version.

## Layout

```
.claude-plugin/   marketplace.json (marketplace "kiki") + plugin.json (plugin "kiki-kit") — required
skills/           one folder per skill
docs/             how the skills fit together (flow.md, flow.th.md)
```

Validate with `claude plugin validate .`
