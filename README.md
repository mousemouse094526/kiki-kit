# kiki-kit

Claude Code skills, packaged as a plugin.

| Skill | Does |
|---|---|
| `warroom` | Plan one feature on paper: interview, spec/decisions/flow/legal docs, five-reviewer red team, approval gate, then tickets. No code |
| `warroom-tickets` | Split approved warroom docs into tracer-bullet tickets with blocking edges, under `tickets/`. Runs automatically after the warroom gate. No code |
| `warroom-legal` | "Can we do this under Thai law?" Per-item verdicts (ALLOWED / NOT ALLOWED / CONDITIONAL) with sources, in one `legal.md` |
| `mermaid-flow` | Readable Mermaid diagrams, checked for correctness before delivery |
| `brandsmith` | Brand logo package: wordmark, app icons, profile marks, PNGs, concept doc, light/dark variants |

Flow: `warroom` → (gate) → `warroom-tickets` automatically.
`warroom` uses `mermaid-flow` and `warroom-legal` from this plugin. Its glossary
rules are adapted from Matt Pocock's `domain-modeling`, and `warroom-tickets`
from his `to-tickets`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT).

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
```

Validate with `claude plugin validate .`
