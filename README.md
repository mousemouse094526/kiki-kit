# kiki-kit

Personal Claude Code plugin — my own skills and agents, kept in git so a new machine is one command away.

## Install

```bash
claude
```

Then inside Claude Code:

```
/plugin marketplace add <your-github-user>/claude-agent-skill
/plugin install kiki-kit@kiki
```

Restart Claude Code. `/help` should now list the skills below.

## What's inside

### Skills

| Skill | Does |
|---|---|
| `flow-verify` | Check the running system against the project's flow docs; reuses existing test evidence, tests only the gaps. Report-only |
| `mermaid-flow` | Author and review Mermaid diagrams that stay readable, with a logic + label check before delivery |
| `logo-barn` | Full brand logo package — wordmark, app icons, profile marks, PNG exports, concept doc, light/dark variants |

### Agents

| Agent | Does |
|---|---|
| `test-runner` | Runs manual-style tests against the running system (API, back office, simulator) and writes a markdown report per round |

### Evals

`evals/logo-barn/` holds the eval set and grader for `logo-barn`. Run output lands in `iteration-*/`, which is gitignored — it reaches hundreds of MB.

## Not in this repo

Deliberately left out, because they are machine config rather than authored work and are quick to set up again:

- `~/.claude/settings.json` — theme, hooks, statusline, autoMode permission rules
- `~/.claude/settings.local.json` — per-machine permission grants
- `~/.claude/statusline.sh`
- Third-party plugins (`caveman`, `figma`) — reinstall with `/plugin install`

## Editing a skill

Edit the file here, commit, then in Claude Code:

```
/plugin update kiki-kit@kiki
```
