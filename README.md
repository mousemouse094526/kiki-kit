# kiki-kit

My own Claude Code skills, kept in git so they survive a wiped machine and install on a new one in two commands.

These normally live in `~/.claude/` on a single machine. This repo is the copy that gets them back.

---

## What's inside

### Skills — extra abilities Claude gains

| Skill | Does |
|---|---|
| `flow-audit` | Audits the running system against a flow doc — every edge tested with fresh evidence, one clean-context agent per doc. Never edits code |
| `mermaid-flow` | Writes and reviews Mermaid diagrams that stay readable instead of turning into crossed wires, and verifies the flow is correct before delivering |
| `brandsmith` | Full brand logo package — wordmark, app icons, profile marks, PNG exports, concept doc, light and dark variants |

### Evals — test sets that score how well a skill performs

`evals/brandsmith/` holds the prompts and the grader for `brandsmith`.

Run output lands in `iteration-1/`, which is **not** committed (see `.gitignore`) — it reaches hundreds of MB.

---

## Moving to a new machine

Lives at [`mousemouse094526/kiki-kit`](https://github.com/mousemouse094526/kiki-kit). Public, so no GitHub login is needed to install it.

On the new machine, open Claude Code and type these two lines:

```
/plugin marketplace add mousemouse094526/kiki-kit
/plugin install kiki-kit@kiki
```

The first line points Claude at the repo; the second installs the plugin it finds there. `kiki-kit@kiki` reads as "the plugin named kiki-kit, from the marketplace named kiki" — both names come from `.claude-plugin/`.

Restart Claude Code. Done.

### What the machine also needs

Installing works anywhere. Two skills shell out to tools that must already be present:

| Tool | Needed by | Without it |
|---|---|---|
| `rsvg-convert`, ImageMagick, or Chrome | `brandsmith` SVG to PNG export | The skill runs, then stops at export |
| `python3` | `mermaid-flow` diagram linter | Diagrams are not checked |

On macOS: `brew install librsvg`

---

## Editing a skill later

1. Edit the file in this repo
2. `git commit` and `git push`
3. On any machine that has it installed, type `/plugin update kiki-kit@kiki`

---

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
evals/               scoring sets
```

Those two files in `.claude-plugin/` are what makes Claude Code recognize the repo. Do not delete them.

Check they are still valid:

```bash
claude plugin validate .
```
