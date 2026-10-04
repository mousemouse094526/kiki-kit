# Template: the warroom-build hand-off prompt

The last thing warroom-tickets shows: a prompt the user pastes into a
**new session** to start building. Fill it from what you checked in the
project, not from guesses. Follow
[markdown-style.md](../../warroom/references/markdown-style.md).

## What to check first

Run these checks and note each result; every finding becomes a line in the
prompt or a step before it.

- **Uncommitted docs** — `git status` on everything warroom and
  warroom-tickets may have written: the feature folder, `docs/adr/`,
  `CONTEXT.md`, `.claude/skills/` (a conventions skill set up before
  slicing), and any `CLAUDE.md`. Any → a commit step before the prompt,
  because the build reviews everything since its start commit.
- **Branch** — the default branch (`git symbolic-ref
  refs/remotes/origin/HEAD`) and the current one. On the default branch →
  the prompt names the branch to create: `feat/{slug}`.
- **Services** — databases, caches, queues the frontier ticket needs
  (`docker-compose.yml`, setup docs). Any → a start step before the prompt.
- **Test setup** — is there a test command in the manifests? None → the
  prompt says the first ticket sets it up, and with what the docs or
  ticket name.
- **Conventions** — a project conventions skill under `.claude/skills/`
  (or a `CLAUDE.md`) for the area the frontier ticket touches. None → the
  prompt says the build must propose and write one before coding.
- **References and versions** — `docs/reference/README.md`, and for each
  language, runtime, and library the frontier ticket touches: installed
  version (manifest or lockfile), latest version (package registry), and
  note version. The prompt lists the ones with no note, a note older than
  installed, or a minor or major gap to latest — so the build checks the
  changelog and asks before coding.
- **Secrets** — env vars the frontier ticket needs that `.env` or
  `.env.example` doesn't hold → the prompt says to ask, never guess.
- **Ticket size** — more than ~30 acceptance bullets → the prompt tells the
  build where it may stop safely.

## Template

Show the steps that apply, then the prompt in one fenced block.

````markdown
**Before the build** (only the steps that apply):

1. Commit the docs:

   ```bash
   git add {paths} && git commit -m "docs({slug}): plan, ADRs, conventions, tickets"
   ```

2. Start the services:

   ```bash
   {command}
   ```

3. Open a **new session** in this project and paste:

```
/warroom-build {slug} {NN}

Context:
- {first ticket of the feature → create branch feat/{slug} from {default branch}}
- {no conventions for {area} → propose the folder structure and layers, get my OK, and write .claude/skills/{framework}-{surface}/ before coding}
- {no notes yet in docs/reference/ for: {list} → write them before coding, llms.txt first}
- {notes older than installed: {name} {note} → {installed} → refresh them for the installed version}
- {behind latest: {name} {installed} → {latest} ({minor|major}) → read the changelog and ask before upgrading; never upgrade inside this ticket}
- {no test command yet → set up {runner} as ticket {NN} specifies}
- {services {list} are running via {how}; values come from .env — ask for anything missing, never guess a secret}
- Don't touch {default branch}; don't push.
- {large ticket → stop at the end of an acceptance group if it won't finish in one session; don't commit half a group}
```
````

**The prompt is always in English**, whatever language the docs and chat
use — it is an instruction to the build agent. The steps around it follow
the chat language.
