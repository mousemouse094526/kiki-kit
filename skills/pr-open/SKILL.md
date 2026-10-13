---
name: pr-open
description: >-
  Open a GitHub pull request whose description tells a reviewer in ten
  seconds what changed, why, and what to watch when it deploys. Runs the
  project's CI checks first, picks the base branch (develop when it
  exists), reads the diff for deploy-relevant changes — env vars added or
  renamed, migrations, Dockerfile and deploy config, new dependencies —
  pulls the why from a warroom ticket and progress.md when there is one,
  writes the body in the user's language (Thai by default) from a fixed
  template (what changes, why, changes, deploy notes, verified, after
  merge) with no checkboxes and no generated-by line, pushes, and opens the PR with gh. Never merges. Use
  when the user asks to open, create, or raise a PR, or says "/pr-open".
---

# PR open

A PR description is read by someone who wasn't there, often while
deciding whether it is safe to merge and deploy. It answers four things,
in this order: what changes, why, what could break on deploy, and how it
was checked.

## 1. Before writing

1. **Clean tree.** Uncommitted changes → ask: commit them into this PR, or
   stash them.
2. **Branch.** On the default branch or on `develop` → stop: a PR needs its
   own branch. Ask for a name, or propose `{type}/{short-slug}`.
3. **Base.** `develop` exists on the remote → base is `develop`; otherwise
   the default branch. The user named one → that.
4. **Checks.** Run what CI runs — read the CI config and use its exact
   commands
   ([ci-checks.md](../warroom/references/ci-checks.md)). Red because of
   this branch → fix it first, or stop and say what is red. Never open a
   PR you know is red without saying so in **Verified**.
5. **The repo's own template.** `.github/pull_request_template.md` (or
   `.github/PULL_REQUEST_TEMPLATE/`) exists → follow its headings. Still
   drop checkboxes and fill **Deploy notes** under the closest heading.

## 2. Gather the facts

From `git log {base}..HEAD` and `git diff {base}...HEAD`:

- **What changed, by area** — group files by app or package
  (`apps/landing`, `packages/i18n`), not one line per file.
- **Deploy-relevant changes** — look for each, and note "none" when absent:
  - env vars added, renamed, or removed: `env.ts` and other env schemas,
    `.env.example`, `process.env` / `import.meta.env` reads, Dockerfile
    `ARG` / `ENV`, `turbo.json` env lists, CI env;
  - migrations: new files under `migrations/`, schema changes (Prisma,
    Drizzle, SQL);
  - deploy config: `Dockerfile`, `docker-compose*.yml`, `railway.json` /
    `railway.toml`, `fly.toml`, `vercel.json`, CI workflows, start
    scripts;
  - dependencies added or removed: the `package.json` diffs (or the
    language's manifest);
  - anything breaking: a removed or renamed route, field, export, or env
    var.
- **Why** — the warroom ticket the commits name (`(#NN)`), its
  `progress.md` Log entry, and the `D{n}` it cites; else the issue linked
  in the commits or branch name; else ask the user in one line. Never
  invent a reason.
- **UI changes** — screenshots, when the change shows on screen and the
  user can provide them or the app runs locally.

## 3. Write the body

From [templates/pr-body.md](templates/pr-body.md). Rules:

- **Language** — the language the user writes in; Thai unless they write
  in English or ask for it. Code identifiers, commands, env var names,
  file paths, and quoted log lines stay as they are.
- **Title** — `{type}({scope}): {what changes for the user}`: the
  `type(scope):` prefix in English, the rest in the body's language,
  under 70 characters.
- **Lead with the effect, not the code.** "Visitors see the landing page
  while the api is asleep" before "removed the loader".
- **No checkboxes.** Done things go under "ตรวจแล้ว" (Verified) with their
  result; things still to do go under "หลัง merge" (After merge) with who
  does them.
- **No generated-by or attribution line** in the body.
- **The deploy notes section is never dropped.** Each line says `ไม่มี`
  (`none`) when there is nothing — the reader then knows it was checked.
- **Every env var change says where to set it** (which service, which
  environment) and whether it must be set **before** merge.
- **Code identifiers in backticks**; no file-by-file list — the Files tab
  already has that.
- Short: a reviewer should not need to scroll on a small PR.

## 4. Open it

1. Push the branch (`git push -u origin HEAD`). Never force-push without
   asking.
2. `gh pr create --base {base} --title "…" --body-file {tmp file}`. Draft
   only when the user asks or a check is red.
3. Show the PR URL and the deploy notes in chat. Don't merge, don't
   approve, don't request reviewers unless asked.
