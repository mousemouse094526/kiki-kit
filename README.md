# kiki-kit

Claude Code skills, packaged as a plugin.

| Skill | Does |
|---|---|
| `warroom` | Plan one feature on paper until nothing is left to decide: interview, spec/decisions/flow docs, Thai-law legal check, five-reviewer red team, ADR sweep, approval gate — then cut it into 2–4 big tickets and `progress.md`. No code. `/warroom legal {items}` runs the legal check alone; `/warroom tickets {slug}` re-cuts |
| `warroom-build` | Build tickets one after another while the session holds: reads `progress.md` first, TDD at the agreed seams, the same checks CI runs, three-axis review (fixes what it finds), commit, and a summary in `progress.md` for the next ticket. Decides small choices itself; asks about anything the user would notice. Debugs failures reproduce-first (`/warroom-build debug {symptom}` for any bug); `--review-feature` before merge |
| `warroom-trial` | Role-played users try the running app on localhost without seeing the code; picked bugs and friction become one fix ticket, spec gaps go back to `warroom` |
| `mermaid-flow` | Readable Mermaid diagrams, checked for correctness before delivery |
| `brandsmith` | Brand logo package: wordmark, app icons, profile marks, PNGs, concept doc, light/dark variants |

Flow: `/warroom` → gate → tickets → `/warroom-build {slug} 01` (continues ticket to ticket; each session ends with the next command) → `--review-feature` → `/warroom-trial` when you want users to try it.
Where everything stands: `docs/features/{slug}/progress.md`. How the skills fit together: [docs/flow.md](docs/flow.md) ([ไทย](docs/flow.th.md)).
`warroom` uses `mermaid-flow` from this plugin.

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
