---
name: mermaid-flow
description: >-
  Author and edit Mermaid diagrams (flowcharts, sequence, ER, state, C4, gantt) that
  stay READABLE instead of turning into crossed-wire spaghetti, and VERIFY the flow is
  logically correct and the labels match intent before delivering. Use this skill
  whenever you create, edit, refactor, or review any Mermaid diagram or ```mermaid code
  block — architecture diagrams, data-flow, ERDs, sequence/state machines, CI pipelines,
  decision trees, dependency graphs — even when the user just says "draw a diagram",
  "make a flow", "add a mermaid chart", "map this out", or pastes a messy diagram and
  asks to clean it up. Also use it before committing any .md/.mmd that contains Mermaid.
---

# Mermaid Flow

Mermaid diagrams fail in two ways. **Messy** — auto-layout crosses wires until nobody can
read them (usually because one graph tries to show everything). **Wrong** — it renders
fine but the flow direction, node names, or arrows don't match what actually happens.
This skill exists to prevent both. A diagram a developer can't trust is worse than no
diagram, because they'll act on a lie.

## Workflow

Follow this order every time. The validation at the end is not optional — it is the
whole point of the skill.

1. **Pin the intent.** Before drawing, state in one sentence what the diagram must let
   the reader understand, and where the flow starts and ends. If the user gave a vague
   ask ("diagram the system"), infer the specific question the diagram answers and say
   which one you picked. A diagram without a single clear question becomes a kitchen sink.

2. **Pick the right diagram type.** The wrong type is the #1 hidden cause of mess — e.g.
   drawing a time-ordered interaction as a flowchart forces back-edges that cross. See
   `references/diagram-types.md` for the selection guide. Quick version:
   - steps / architecture / dependencies → `flowchart`
   - who-calls-whom over **time** → `sequenceDiagram`
   - database tables + relations → `erDiagram`
   - lifecycle / status transitions → `stateDiagram-v2`
   - system context at 3 zoom levels → `C4Context` / `C4Container`

3. **Draft with the layout rules below.** Build for the layout engine, not against it.

4. **Validate** — semantic self-review **and** the linter script. Fix or consciously
   accept every finding. Only then present the diagram.

## Layout rules (prevent the mess)

The layout engine can't read your mind; it just avoids overlaps as best it can given the
edges you wrote. Give it a graph that's easy to lay out:

- **One diagram = one question. Cap it at ~10 nodes.** If you're past ~12, that's the
  signal to split into multiple focused diagrams (context → detail), not to cram. The
  reader assembles the whole from clean parts far better than from one dense picture.
  This single rule fixes most spaghetti.

- **Pick one flow direction and keep everything going that way.** `flowchart LR` for
  pipelines and left-to-right stories, `TB` for hierarchies. Every arrow should push
  broadly the same direction. An arrow pointing back "upstream" is what crosses the
  others.

- **Avoid bidirectional edges** (`A <--> B`, or both `A --> B` and `B --> A`). They are
  the top cause of crossings. If two things talk both ways, either pick the primary
  direction, or model request/response as two clearly labeled one-way arrows, or move
  the back-channel to a separate diagram.

- **Group with `subgraph` and give each a `direction`.** Subgraphs without a direction
  wander. Keep cross-subgraph edges few — many wires between clusters is the sign a split
  is overdue.

- **Watch skip edges that jump over a chain.** An edge from an early node straight to a
  late or terminal one — e.g. `paid --> cancelled` when the main line is
  `paid → processing → shipped → delivered` — draws a long wire running alongside the
  whole chain and crosses everything between. This bites hardest in `stateDiagram` and
  `sequenceDiagram`, where you can't hand-tune layout. Tame it by placing the skip's
  target right next to where it branches off, gathering all terminal/exit states together
  at the end, or pulling the exceptional path into its own small diagram. If a couple of
  such crossings are unavoidable, say so in the caption so the reader isn't confused.

- **Collapse detail into one node and link out.** Four fetch workers that all do the same
  thing become one "fetch workers" node here, detailed in their own diagram. Use `A --> B & C`
  fan syntax to keep parallel edges compact.

- **Keep labels short.** Long node text widens boxes and forces awkward wraps. Use `<br/>`
  for a deliberate two-line label; push detail into prose under the diagram, not into the box.

## Pair every diagram with a description

A diagram dropped in alone forces the reader to reverse-engineer what they're looking at.
The description *is part of the deliverable*, not a nice-to-have — readers value the
"what am I looking at" text as much as the picture. Ship every diagram with:

- **A one-line caption** stating what it shows (e.g. "Request path: how a client call
  reaches the data stores").
- **1–3 lines on how to read it** — the key rule, the start/end points, or the takeaway
  a new dev should leave with.

When you split into several diagrams, give **each** its own caption, and add one sentence
tying them together (how the parts connect, which shared nodes bridge them). Short, plain
prose under each ```mermaid block — not a wall of text, just enough that someone skimming
gets the point without decoding the graph.

## Validate before delivering

Two passes. Neither is skippable — "it renders" is not "it's correct".

### Pass 1 — Semantic review (you, by hand)

Read the diagram back against the intent and check:

- **Direction of every arrow** matches reality. Does data/control actually flow that way?
  A reversed arrow is a silent lie.
- **Every node the reader needs exists**, and nothing orphaned/irrelevant is left in.
- **Names match the domain and the code.** If it maps to real services/tables/functions,
  use their real names — a diagram with invented names sends devs looking for things that
  don't exist. Verify against the codebase when it's meant to mirror code.
- **Start and end points are the real ones**, and there are no dead ends that shouldn't be.
- **The labels say what the arrow does** (`enqueue`, `publishes`, `reads`), not just `-->`.
- **A skip edge isn't crossing the whole chain.** Trace any transition that jumps over
  several sequential nodes; if it runs the length of the diagram, restructure per the
  skip-edge rule above.
- **Each diagram carries its caption + reading note**, and multi-diagram sets have the
  tying-together sentence. If the description is missing, the deliverable is incomplete.

If the diagram is AI-generated (you invented the structure), be extra skeptical here —
confirm the flow with the user or the code rather than trusting your own draft.

### Pass 2 — Linter (deterministic)

Run the bundled linter to catch structural smells and, optionally, real syntax errors:

```bash
python3 <skill-dir>/scripts/lint_mermaid.py path/to/file.md
```

It reads `.md` (```mermaid fences) or `.mmd` and flags: too many nodes, dense
edge/node ratio, bidirectional edges, self-loops, orphan nodes, subgraphs missing a
`direction`, and overlong labels. Add `--render` to actually render with mermaid-cli
(via `npx`, no install needed) and catch syntax errors:

```bash
python3 <skill-dir>/scripts/lint_mermaid.py path/to/file.md --render
```

Tune the node cap with `--max-nodes N` (default 12). Warnings are nudges — either fix
them or note why the diagram is fine as-is. Errors (over the node cap, render failure)
should be fixed before delivery.

## Anti-patterns → fixes

**Example 1 — the kitchen sink**
Input: one `flowchart` with clients, API internals, workers, DB, cache, external APIs,
and notifications (20+ nodes, wires everywhere).
Fix: split into three — (1) coarse context, (2) API internals, (3) worker internals — each
6–10 nodes, one direction, linked from an index. The reader gets the whole from clean parts.

**Example 2 — time drawn as a flowchart**
Input: `flowchart` of login: browser → API → DB → API → browser → API… (back-edges cross).
Fix: use `sequenceDiagram`. Time-ordered request/response is what sequence diagrams are for;
the crossings vanish because the layout is inherently linear in time.

**Example 3 — bidirectional soup**
Input: every service `<-->` every other service.
Fix: keep only the primary call direction, or separate the read path and write path into
two diagrams. Two-way arrows everywhere means the diagram has no story.

## When NOT to use Mermaid

Mermaid is text-first and great for version-controlled docs (diffs, PR review, renders in
GitHub). But if the user needs pixel-precise manual layout, freeform boxes, or a polished
"hero" visual, a drawing tool (Figma/FigJam, Excalidraw, draw.io) fits better — say so
rather than fighting the auto-layout. For diagrams devs read and maintain in-repo, Mermaid
wins; for a one-off presentation centerpiece, it may not.
