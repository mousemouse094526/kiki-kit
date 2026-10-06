# Template: the warroom-build hand-off prompt

The last thing warroom-tickets shows: a prompt the user pastes into a
**new session** to start building. A cold session knows nothing of this
one, so the prompt carries what it can't find by itself. Fill it from what
you checked, not from guesses. Follow
[markdown-style.md](../../warroom/references/markdown-style.md).

Conventions were set up before slicing; test setup and library versions
are the build's own first steps — don't repeat them here.

## What to check first

- **Uncommitted docs** — `git status` on what warroom and warroom-tickets
  wrote: the feature folder, `docs/adr/`, `CONTEXT.md`, `.claude/skills/`,
  any `CLAUDE.md`. Any → a commit step, because the build reviews
  everything since its start commit.
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
- {services {list} are running via {how}; values come from .env — ask for anything missing, never guess a secret}
- Don't touch {default branch}; don't push.
```
````

**The prompt is always in English** — it is an instruction to the build
agent. The steps around it follow the chat language.
