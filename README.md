# kiki-kit

My own Claude Code skills, kept in git so they survive a wiped machine and install on a new one in two commands.

These normally live in `~/.claude/` on a single machine. This repo is the copy that gets them back.

---

## What's inside

### Skills — extra abilities Claude gains

| Skill | Does |
|---|---|
| `mermaid-flow` | Writes and reviews Mermaid diagrams that stay readable instead of turning into crossed wires, and verifies the flow is correct before delivering |
| `brandsmith` | Full brand logo package — wordmark, app icons, profile marks, PNG exports, concept doc, light and dark variants |
| `warroom` | Plan one feature on paper — interview with recommended answers, then spec/decisions/flow/legal docs, ending at an approval gate. No code; later skills build from the docs |
| `warroom-legal` | "Can we do this under Thai law?" — per-item verdicts (ALLOWED / NOT ALLOWED / CONDITIONAL) with web-sourced references in one `legal.md`; warroom runs it before its approval gate |

---

## Moving to a new machine

Lives at [`mousemouse094526/kiki-kit`](https://github.com/mousemouse094526/kiki-kit). Public, so no GitHub login is needed to install it.

On the new machine, open Claude Code and type these two lines:

```
/plugin marketplace add mousemouse094526/kiki-kit
/plugin install kiki-kit@kiki
```

Or from a shell, same effect:

```bash
claude plugin marketplace add mousemouse094526/kiki-kit
claude plugin install kiki-kit@kiki
```

The first line points Claude at the repo; the second installs the plugin it finds there. `kiki-kit@kiki` reads as "the plugin named kiki-kit, from the marketplace named kiki" — both names come from `.claude-plugin/`. It installs at user scope, so the skills work in every project on that machine.

Restart Claude Code. Done.

### What the machine also needs

Installing works anywhere. Two skills shell out to tools that must already be present:

| Tool | Needed by | Without it |
|---|---|---|
| `rsvg-convert`, ImageMagick, or Chrome | `brandsmith` SVG to PNG export | The skill runs, then stops at export |
| `python3` | `mermaid-flow` diagram linter | Diagrams are not checked |

On macOS: `brew install librsvg`

### Skills that need each other

`warroom` calls two companion skills mid-run, both in this plugin:
`mermaid-flow` (draws `flow.md`) and `warroom-legal` (writes `legal.md`
before the approval gate). Glossary work (`CONTEXT.md`, ADRs) is built into
warroom itself — adapted from Matt Pocock's `domain-modeling`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT), no
separate install.

---

## Editing a skill later

1. Edit the file in this repo
2. `git commit` and `git push`
3. On any machine that has it installed, pull the new commit from a shell:

   ```bash
   claude plugin marketplace update kiki
   claude plugin update kiki-kit@kiki
   ```

   The first line refreshes Claude's copy of the repo; the second updates the
   installed plugin from it. Inside Claude Code, the same two steps are
   `/plugin marketplace update kiki` and `/plugin update kiki-kit@kiki`.
4. Restart Claude Code.

`plugin.json` has no `version` on purpose: installs track the git commit, so
every push counts as a new version — no number to bump.

---

## Examples (local only, not committed)

`examples/` is gitignored scratch space for third-party skills studied as
reference — currently `grill-with-docs` from
[mattpocock/skills](https://github.com/mattpocock/skills) (MIT © Matt Pocock).
Refetch on a new machine with:

```bash
npx skills@latest add mattpocock/skills --skill=grill-with-docs
```

## Deliberately not in this repo

Machine config rather than authored work, and quick to set up again:

| File | What it is |
|---|---|
| `~/.claude/settings.json` | Theme, hooks, statusline, autoMode permission rules |
| `~/.claude/settings.local.json` | Per-machine permission grants |
| `~/.claude/statusline.sh` | The status bar script |
| Third-party plugins (`caveman`, `figma`) | Reinstall with `/plugin install` |

---

## Layout

```
.claude-plugin/
  marketplace.json   tells Claude this repo is a "store" named kiki
  plugin.json        tells it the store holds a plugin named kiki-kit
skills/              the real content
```

Those two files in `.claude-plugin/` are what makes Claude Code recognize the repo. Do not delete them.

Check they are still valid:

```bash
claude plugin validate .
```
