# Cutting tickets — warroom's last phase

Adapted from Matt Pocock's `to-tickets`
([mattpocock/skills](https://github.com/mattpocock/skills), MIT). Runs right
after Approve, and alone as `/warroom tickets {slug}` (a re-cut).

**Few, big tickets.** A feature is cut into **2–4 tickets**, each a large
vertical slice someone could demo. Small tickets multiply hand-offs: every
one is another context to rebuild, another review that can't see the
others, another place for things to fall between. One ticket is fine when
the feature is small.

## 1. Read

`spec.md`, `decisions.md`, `flow.md`, `legal.md`, and `CONTEXT.md`, in
full. Spec still `draft` → stop: open questions left in tickets get
answered mid-build, where they cost the most.

`tickets/` already exists → this is a re-cut. Keep every `done` ticket as
it is; re-cut only the rest, numbered after the `done` ones. Fold in every
`open` row of `progress.md` › Blocked whose Needs is `→ /warroom tickets`,
and set its Status to `→ ticket NN`.

## 2. Conventions first

Read the project's conventions for every area the spec touches. An area
with planned code and no conventions → set them up now, as
[conventions.md](conventions.md) describes. Cut the tickets against that
structure.

Existing code that doesn't match the conventions, or that makes the change
hard → prefactor work at the start of the first ticket. Only a large
prefactor gets its own first ticket. "Make the change easy, then make the
easy change."

## 3. Draft

<vertical-slice-rules>

- Each ticket cuts a COMPLETE path through every layer (schema, API, UI,
  tests): vertical, never one layer.
- A finished ticket is demoable or verifiable on its own.
- A ticket is sized to be built in one session, with room left for the
  review.
- Prefactoring comes first.

</vertical-slice-rules>

Give each ticket its **blocking edges**: the tickets that must finish
first. Usually a straight line.

**Wide refactors are the exception.** One mechanical change whose blast
radius fans across the codebase (rename a column, retype a shared symbol)
can't land as one green slice. Sequence it as **expand–contract**: add the
new form beside the old, migrate callers, then delete the old form — in as
few tickets as stay green.

**Cover the docs.** Every User Story, every Seam, and every CONDITIONAL
requirement in `legal.md` lands in at least one ticket's acceptance
criteria; nothing from Out of Scope does. Every `(e2e)` seam lands in the
ticket that completes its flow, tagged `(e2e)`. The first such ticket also
sets up the e2e package if the project has none.

**Walk each ticket as its builder.** A choice the docs, ADRs, and
conventions leave open:

- **structural** (where a shared piece lives) → settle it now in the
  conventions;
- **small and inside this feature** (a default, a message, a limit) →
  leave it: the build decides and records it;
- **behaviour the user sees, a legal item, or an ADR** → ask the user now
  (AskUserQuestion) and record a `D{n}` (`**From:** tickets`). The user
  wants it to wait → stop: add a row to `progress.md` › Blocked
  (`→ /warroom {slug}`) and write no tickets.

## 4. Approve the cut

Show the tickets as a numbered list — title, blocked by, what it delivers —
and ask once with AskUserQuestion: **approve** (Recommended), **merge**
some, or **split** one. Adjust until approved.

## 5. Write

- One file per ticket: `docs/features/{slug}/tickets/NN-{slug}.md` from
  [templates/ticket.md](../templates/ticket.md), numbered from `01` in
  dependency order. Docs language; fixed tokens in English.
- `docs/features/{slug}/progress.md` from
  [progress.md](../../warroom-build/templates/progress.md): every ticket
  `ready`, an empty Log, **Next** = the first ticket's command. A re-cut
  rewrites the Tickets table and keeps the Log and Blocked rows.
- Check every **Blocked by** points to a lower number, then run the
  self-check in [markdown-style.md](markdown-style.md).

Don't edit spec.md. decisions.md gets only the `D{n}` this phase made.

## 6. Hand off

Check, and show only the steps that apply:

- **Uncommitted docs** — the feature folder, `docs/adr/`, `CONTEXT.md`,
  `.claude/skills/`, any `CLAUDE.md` → a commit step:
  `git add {paths} && git commit -m "docs({slug}): plan and tickets"`.
- **Branch** — on the default branch → the build creates `feat/{slug}`.
- **Services** the first ticket needs (`docker-compose.yml`, setup docs) →
  a start step.
- **Secrets** the first ticket needs that `.env` lacks → say the build will
  ask for them.

Then end with the command to paste in a new session, in its own code
block, always with the ticket number:

```
/warroom-build {slug} 01
```
