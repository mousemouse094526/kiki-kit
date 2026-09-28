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

Prevent two failures: **messy** (crossed wires, unreadable) and **wrong** (renders fine
but direction, names, or arrows don't match reality).

## Workflow

Follow this order every time. Validation is mandatory.

1. **Pin the intent.** Before drawing, state in one sentence what the diagram must let
   the reader understand, and where the flow starts and ends. Vague ask ("diagram the
   system") → infer the specific question and say which one you picked.

2. **Pick the right diagram type.** See `references/diagram-types.md`. Quick version:
   - steps / architecture / dependencies → `flowchart`
   - who-calls-whom over **time** → `sequenceDiagram`
   - database tables + relations → `erDiagram`
   - lifecycle / status transitions → `stateDiagram-v2`
   - system context at 3 zoom levels → `C4Context` / `C4Container`

3. **Draft with the layout rules below.**

4. **Validate** — semantic self-review **and** the linter script. Fix or consciously
   accept every finding. Only then present the diagram.

## Layout rules

- **One diagram = one question. Cap it at ~10 nodes.** Past ~12 → split into multiple
  focused diagrams (context → detail).

- **One flow direction for everything.** `flowchart LR` for pipelines and left-to-right
  stories, `TB` for hierarchies. No arrows pointing back upstream.

- **Avoid bidirectional edges** (`A <--> B`, or both `A --> B` and `B --> A`). Pick the
  primary direction, or model request/response as two labeled one-way arrows, or move
  the back-channel to a separate diagram.

- **Group with `subgraph` and give each a `direction`.** Keep cross-subgraph edges few;
  many wires between clusters → split.

- **Watch skip edges that jump over a chain** — e.g. `paid --> cancelled` when the main
  line is `paid → processing → shipped → delivered`. Worst in `stateDiagram` and
  `sequenceDiagram` (no manual layout). Place the skip's target next to where it branches
  off, gather terminal/exit states together at the end, or move the exceptional path
  into its own small diagram. Unavoidable crossings → mention them in the caption.

- **Collapse detail into one node and link out.** Four identical fetch workers become one
  "fetch workers" node, detailed in their own diagram. Use `A --> B & C` fan syntax for
  parallel edges.

- **Keep labels short.** Use `<br/>` for a deliberate two-line label; put detail in prose
  under the diagram, not in the box.

## Pair every diagram with a description

Required part of the deliverable. Ship every diagram with:

- **A one-line caption** stating what it shows (e.g. "Request path: how a client call
  reaches the data stores").
- **1–3 lines on how to read it** — the key rule, the start/end points, or the takeaway.

Several diagrams → each gets its own caption, plus one sentence tying them together
(how the parts connect, which shared nodes bridge them). Short plain prose under each
```mermaid block.

## Validate before delivering

Two passes. Neither is skippable — "it renders" is not "it's correct".

### Pass 1 — Semantic review (you, by hand)

Read the diagram back against the intent and check:

- **Direction of every arrow** matches how data/control actually flows.
- **Every node the reader needs exists**, and nothing orphaned/irrelevant is left in.
- **Names match the domain and the code.** Use real service/table/function names; verify
  against the codebase when the diagram mirrors code.
- **Start and end points are the real ones**, and no unintended dead ends.
- **Labels say what the arrow does** (`enqueue`, `publishes`, `reads`), not bare `-->`.
- **No skip edge crosses the whole chain.** Restructure per the skip-edge rule above.
- **Each diagram has caption + reading note**, and multi-diagram sets have the
  tying-together sentence. Missing description = incomplete deliverable.

AI-generated structure (you invented it) → confirm the flow with the user or the code.

### Pass 2 — Linter (deterministic)

```bash
python3 <skill-dir>/scripts/lint_mermaid.py path/to/file.md
```

Reads `.md` (```mermaid fences) or `.mmd`. Flags: too many nodes, dense edge/node ratio,
bidirectional edges, self-loops, orphan nodes, subgraphs missing a `direction`, overlong
labels. Add `--render` to render with mermaid-cli (via `npx`, no install needed) and
catch syntax errors:

```bash
python3 <skill-dir>/scripts/lint_mermaid.py path/to/file.md --render
```

Tune the node cap with `--max-nodes N` (default 12). Warnings → fix or note why the
diagram is fine as-is. Errors (over the node cap, render failure) → fix before delivery.

## Anti-patterns → fixes

**Example 1 — the kitchen sink**
Input: one `flowchart` with clients, API internals, workers, DB, cache, external APIs,
and notifications (20+ nodes, wires everywhere).
Fix: split into three — (1) coarse context, (2) API internals, (3) worker internals — each
6–10 nodes, one direction, linked from an index.

**Example 2 — time drawn as a flowchart**
Input: `flowchart` of login: browser → API → DB → API → browser → API… (back-edges cross).
Fix: use `sequenceDiagram`.

**Example 3 — bidirectional soup**
Input: every service `<-->` every other service.
Fix: keep only the primary call direction, or split read path and write path into two
diagrams.

## When NOT to use Mermaid

User needs pixel-precise manual layout, freeform boxes, or a polished "hero" visual →
recommend a drawing tool (Figma/FigJam, Excalidraw, draw.io) instead. In-repo docs devs
maintain → Mermaid.
