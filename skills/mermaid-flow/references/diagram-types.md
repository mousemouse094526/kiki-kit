# Diagram type selection

Picking the wrong type is the #1 hidden cause of unreadable Mermaid: you fight the layout
engine instead of using the type built for your data. Match the type to the *shape of the
information*, not to whatever you drew first.

## Selection table

| You want to show… | Use | Why |
|---|---|---|
| Steps, pipeline, architecture, dependencies, decision tree | `flowchart` | General directed graph; you control direction (LR/TB) |
| Who calls whom **over time** (request/response, handshake) | `sequenceDiagram` | Time flows top→down; back-and-forth is linear, never crosses |
| Database tables + relationships (cardinality) | `erDiagram` | Purpose-built for entities, keys, 1:N / N:M |
| Object lifecycle, status transitions, state machine | `stateDiagram-v2` | Models states + transitions cleanly, supports nesting |
| System context at zoom levels (system → container → component) | `C4Context`, `C4Container`, `C4Component` | Enforces the C4 leveling so each diagram stays scoped |
| Project schedule / timeline with durations | `gantt` | Tasks on a real time axis |
| Class model, inheritance, methods | `classDiagram` | UML class relationships |
| User journey with sentiment | `journey` | Steps scored by satisfaction |
| Branching ideas / hierarchy, no strict flow | `mindmap` | Radial tree, no edge routing to cross |
| Ordered events without durations | `timeline` | Simple chronological list |

## Decision hints

- **"It has back-and-forth over time" → `sequenceDiagram`, almost always.** The moment you
  find yourself drawing an arrow back "up" a flowchart to show a response, stop and switch.
  Sequence diagrams make request/response inherently readable because the axis *is* time.

- **"It's about data at rest" → `erDiagram`.** Tables, columns, foreign keys, cardinality.
  Don't model a schema as a flowchart of boxes — you lose cardinality and gain crossings.

- **"It's about one thing changing status" → `stateDiagram-v2`.** Order lifecycle,
  connection states, job states. Not a flowchart — states aren't process steps.

- **"It's the whole system and it won't fit" → C4 leveling.** Instead of one giant
  flowchart, split by zoom: Context (systems + actors), Container (apps/services/DBs),
  Component (inside one app). Each level answers one question. You can do the same leveling
  by hand with plain `flowchart`s if you don't want C4 syntax — the principle is what matters.

- **Still a flowchart? Then commit to a direction.** `LR` for pipelines and narratives,
  `TB` for hierarchies and org/dependency trees. Mixing directions inside one graph is what
  produces diagonal crossing edges.

## Minimal syntax reminders

```
sequenceDiagram
    participant B as Browser
    participant A as API
    B->>A: POST /login
    A-->>B: 200 + session
```

```
erDiagram
    USER ||--o{ FINDING : owns
    USER {
      uuid id PK
      text email
    }
```

```
stateDiagram-v2
    [*] --> queued
    queued --> running
    running --> done
    running --> failed
    failed --> queued: retry
```

Keep the same discipline as flowcharts: one question per diagram, short labels, and split
before it gets crowded.
