# Template: flow.md

How it runs, as diagrams drawn with the **mermaid-flow** skill. Copy the
skeleton under **Template**.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **Reading order up front** — a numbered list of the diagrams.
- **Same names as spec.md** — error codes, fields, roles, terms from
  `CONTEXT.md`.
- **One diagram per `##` section**, then a bold one-line caption and at
  most five bullets on what the diagram can't show, each citing its `D{n}`.
- Split a diagram taller than one screen into `###` parts.

## Template

````markdown
# Flow: {feature slug}

{n} diagrams, read in this order:
1. {what diagram 1 shows, one line}
2. {what diagram 2 shows, one line}

All diagrams use the same names as [spec.md](spec.md).

## 1. {title}

```mermaid
{diagram}
```

**{The question this diagram answers, one line}**
- {something the picture can't show, e.g. a timeout or a retry rule} (D1)
````
