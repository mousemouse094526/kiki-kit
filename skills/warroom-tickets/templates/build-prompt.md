# Template: the warroom-build hand-off prompt

The last thing warroom-tickets shows: a prompt the user pastes into a
**new session** to start building. That session knows nothing of this one,
so the prompt carries what it can't find itself. Fill it from what you
checked, not from guesses. Follow
[markdown-style.md](../../warroom/references/markdown-style.md).

Leave out conventions (set up before slicing), test setup, and library
versions (the build's own first steps).

## What to check first

- **Uncommitted docs** — `git status` on what warroom and warroom-tickets
  wrote: the feature folder, `docs/adr/`, `CONTEXT.md`, `.claude/skills/`,
  any `CLAUDE.md`. Any → a commit step, since the build reviews everything
  after its start commit.
- **Branch** — on the default branch (`git symbolic-ref
  refs/remotes/origin/HEAD`) → the prompt names `feat/{slug}` to create.
- **Services** — databases, caches, queues the frontier ticket needs
  (`docker-compose.yml`, setup docs). Any → a start step.
- **Secrets** — env vars the frontier ticket needs that `.env` /
  `.env.example` lacks → the prompt says to ask, never guess.
- **Open items** — `open` rows in `open-items.md` whose Next is
  `→ /warroom` or `→ /warroom-tickets` → no build prompt: say which flow
  closes them first.

## Template

Show the steps that apply, then the prompt in one fenced block.

````markdown
**Before the build** (only the steps that apply):

1. Commit the docs (the self-check already ran the CI checks on them):

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
- {only for the feature's first ticket: Create branch feat/{slug} from {default branch}.}
- {only when services are needed: Services {list} are running via {how}; values come from .env — ask for anything missing, never guess a secret.}
- Don't touch {default branch}; don't push.
```
````

**The prompt is always in English** — it instructs the build agent. The
steps around it follow the chat language.
