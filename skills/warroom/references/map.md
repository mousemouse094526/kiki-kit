# Map mode — a plan too big for one session

A warroom that runs out of context mid-interview loses every decision still
in its head. When the plan is too big to finish in one session, chart a
**map** first — one markdown file a cold session can pick up — and resolve
it over several sessions before the gate.

## When to chart one

After the first few questions, not before — you can't size what you
haven't probed. Chart a map when you count roughly **five or more open
decisions** and can see that answering early ones will raise questions you
can't phrase yet. Below that, just interview: a map for three questions is
bureaucracy. Say why in one line and ask before writing the file.

## The file — `docs/features/{slug}/map.md`

The map is an **index, not a store**. A decision lives in decisions.md, a
word in `CONTEXT.md`; the map gives each one line and a link. Two copies
drift. Follow [markdown-style.md](markdown-style.md).

```markdown
# Map: {feature slug}

## Destination

{What the end of this map looks like — usually "a ready-to-build spec for
…". One or two lines; it fixes the scope.}

## Notes

{What a cold session must know before it asks anything.}

## Decided

- **{question title}** — {one-line answer} → D{n}

## Open

1. **{question title}** — {the decision it settles} · kind: interview
2. **{question title}** — {…} · kind: research · blocked by: {title}

## Fog

- {an area you can tell is coming but can't phrase as a question yet}

## Out of scope

- {gist} — {why it's past the destination}
```

- **Open or fog?** Open when you can *state* it sharply now, even if
  something blocks it; fog when you can't. Don't slice fog into questions
  early — one patch may become three questions or none.
- **Out of scope** is past the destination. It never comes back; if it
  must, the destination was wrong — redraw it.
- Refer to questions by **title**, never by number alone — titles read at a
  glance.

**Kinds:** `interview` (the default — the user decides), `sketch` (the user
needs something to react to: a state table, a text mockup), `research`
(you alone: docs, a library, an API — summarise into the feature folder),
`task` (manual work that unblocks a decision, e.g. signing up to judge an
API). Never answer an `interview` question on the user's behalf.

## Session 1 — chart and stop

1. Agree the destination.
2. Fan out across the whole space — breadth, not depth — to find the sharp
   questions and the fog.
3. No fog → no map: say so and just interview.
4. Write `map.md`, show it, and stop. Charting and resolving in one session
   means the tail gets resolved by a tired context.

## Later sessions — `/warroom {slug}` with a map

1. Read `map.md` only; open a linked file only when a question turns on it.
2. Take the question the user names, or the first open one nothing blocks.
   Check it still serves the destination.
3. Resolve it by its kind, then **record before anything else**: the
   `D{n}` or `CONTEXT.md` entry, the line under Decided, the question struck
   from Open.
4. Redraw: fog that became sharp → new open questions (delete the fog
   line); a question now past the destination → Out of scope; one the
   answer invalidated → strike or rewrite it.
5. Keep going while the context holds; stop cleanly between questions,
   never in the middle of one.

Open and fog both empty → the map is done: write the docs (Phase 2) and run
legal, the red team, the ADR sweep, and the gate as usual. The map stays as
the record of how the plan was reached.
