# Diagram type selection

Match the type to the shape of the information.

## Selection table

| You want to show… | Use |
|---|---|
| Steps, pipeline, architecture, dependencies, decision tree | `flowchart` |
| Who calls whom **over time** (request/response, handshake) | `sequenceDiagram` |
| Database tables + relationships (cardinality) | `erDiagram` |
| Object lifecycle, status transitions, state machine | `stateDiagram-v2` |
| System context at zoom levels (system → container → component) | `C4Context`, `C4Container`, `C4Component` |
| Project schedule / timeline with durations | `gantt` |
| Class model, inheritance, methods | `classDiagram` |
| User journey with sentiment | `journey` |
| Branching ideas / hierarchy, no strict flow | `mindmap` |
| Ordered events without durations | `timeline` |

## Decision hints

- **Back-and-forth over time → `sequenceDiagram`.** Drawing an arrow back "up" a
  flowchart to show a response → stop and switch.

- **Data at rest → `erDiagram`.** Tables, columns, foreign keys, cardinality. Never a
  flowchart of boxes.

- **One thing changing status → `stateDiagram-v2`.** Order lifecycle, connection states,
  job states. Not a flowchart.

- **Whole system won't fit → C4 leveling.** Split by zoom: Context (systems + actors),
  Container (apps/services/DBs), Component (inside one app). One question per level.
  Plain `flowchart`s leveled by hand work too.

- **Still a flowchart → one direction.** `LR` for pipelines and narratives, `TB` for
  hierarchies and org/dependency trees. Never mix directions inside one graph.

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

Same discipline as flowcharts: one question per diagram, short labels, split before it
gets crowded.
