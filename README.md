# kiki-kit

My own Claude Code skills and agents, kept in git so they survive a wiped machine and install on a new one in two commands.

These normally live in `~/.claude/` on a single machine. This repo is the copy that gets them back.

---

## What's inside

### Skills — extra abilities Claude gains

| Skill | Does |
|---|---|
| `flow-verify` | Checks the running system against the project's flow docs. Reads existing test evidence first, tests only the gaps, then reports. Never edits code |
| `mermaid-flow` | Writes and reviews Mermaid diagrams that stay readable instead of turning into crossed wires, and verifies the flow is correct before delivering |
| `logo-barn` | Full brand logo package — wordmark, app icons, profile marks, PNG exports, concept doc, light and dark variants |

### Agents — separate helpers that go off and work on their own

| Agent | Does |
|---|---|
| `test-runner` | Runs manual-style tests against the running system (API, back office, simulator) and writes a markdown report per round |

### Evals — test sets that score how well a skill performs

`evals/logo-barn/` holds the prompts and the grader for `logo-barn`.

Run output lands in `iteration-1/`, which is **not** committed (see `.gitignore`) — it reaches hundreds of MB.

---

## Moving to a new machine

Not pushed to GitHub yet. One-time setup:

```bash
gh repo create claude-agent-skill --private --source=. --push
```

Then on the new machine, open Claude Code and type these two lines:

```
/plugin marketplace add <your-github-user>/claude-agent-skill
/plugin install kiki-kit@kiki
```

`<your-github-user>` is the GitHub username — if the repo is at `github.com/kiki/claude-agent-skill`, type `kiki/claude-agent-skill`.

Restart Claude Code. Done.

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
agents/              the real content
evals/               scoring sets
```

Those two files in `.claude-plugin/` are what makes Claude Code recognize the repo. Do not delete them.

Check they are still valid:

```bash
claude plugin validate .
```
