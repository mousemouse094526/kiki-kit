# Run what CI runs — before every commit

Shared by every warroom skill that writes files. "Tests pass" is not "CI
passes": CI also runs format checks, lint over the whole repo, the build,
and checks on Markdown and JSON. Run the same commands locally before a
commit, so CI never finds something first.

## 1. Find the checks

Read, in this order, and list every step that runs on a push or pull
request:

1. The CI config — `.github/workflows/*.yml`, `.gitlab-ci.yml`,
   `bitbucket-pipelines.yml`, `.circleci/config.yml`.
2. What those steps call — `package.json` scripts, `Makefile`,
   `justfile`, `turbo.json`.
3. Commit hooks — `.husky/`, `lefthook.yml`, `.pre-commit-config.yaml`.

Use the **exact command and flags CI uses**: `biome ci .`, not
`biome lint`; `prettier --check .`, not "looks formatted"; the CI's
`build` step too. No CI config → the project's `lint`, `format`,
`typecheck`, `test`, and `build` scripts, whichever exist.

State the list in one line before the first commit.

## 2. Which checks a commit needs

| The commit holds | Run |
|---|---|
| code or tests | every CI step: lint, format check, typecheck, tests, build — plus e2e when the warroom-build rules call for it |
| docs, config, or generated files only | the steps that read those files: format check, Markdown or JSON lint, any repo-wide lint that covers them |

A skill that leaves its files uncommitted (warroom, warroom-tickets,
warroom-legal, warroom-trial) still runs the second row on what it wrote,
so the commit that follows is clean.

## 3. When a check fails

- **This change caused it** → fix the cause. A formatter failure → run the
  formatter's write mode on the files this change touched, not the whole
  repo.
- **It was already failing** before this change → don't fix it here. Say
  so; in warroom-build add the `full suite` row.
- **It can't run locally** (needs a secret or a service that isn't
  running) → name the step and why. Never report it as passed.
- **Never** silence a rule, add an ignore entry, exclude a folder, skip a
  hook, or commit with `--no-verify` without asking the user first.

## 4. Report

One line per step: the command and pass or fail.
