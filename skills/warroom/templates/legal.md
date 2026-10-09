# Template: legal.md

One file per run. Copy the skeleton under **Template**; follow **Rules**.
Verdict words, `[n]` citations, and law names stay as-is; headings and
prose are in the language the user writes in.

## Rules

All of [markdown-style.md](../references/markdown-style.md), plus:

- **One `##` section per item**, numbered, titled with what the user wants
  to do. When checking a feature, cite the decisions it comes from
  (`(D3, D9)`).
- **ALLOWED** → the verdict line and its citation. Nothing else.
- **NOT ALLOWED** → one or two sentences naming the prohibition, cited.
- **CONDITIONAL** → `**Required to be allowed:**` then one plain bullet per
  requirement: a concrete thing that must exist or be done, cited. The
  work itself is tracked in the spec and tickets.
- **Assumptions** the verdicts rest on (who is controller, who is a service
  provider) go in a short list under the header, before item 1.
- **Summary table is the payload** — verdict and requirements per item,
  complete on its own, requirements joined with `·`.
- URLs only in **References**, each with its access date; verdicts cite
  by `[n]`. This replaces the `## Sources` section other docs use.
- Unverifiable verdict → append
  `UNVERIFIED — from model knowledge, verify before relying`.
- End with the disclaimer in the file's language.

## Template

```markdown
# Legal check: {topic}

**Jurisdiction:** Thailand — checked {YYYY-MM-DD}

{Assumptions, only when the verdicts depend on them:}
- {an assumption, e.g. "the shop is the data controller"}

## 1. {What the user wants to do, e.g. "Store customer phone numbers"} ({D3, D9})

**Verdict: CONDITIONAL**

**Required to be allowed:**
- {one thing that must exist or be done} [1]
- {another requirement} [1][2]

## 2. {What the user wants to do}

**Verdict: ALLOWED** [2]

## 3. {What the user wants to do}

**Verdict: NOT ALLOWED**

{What the law forbids, one or two sentences} [1].

## Summary
| # | Item | Verdict | Required to be allowed |
|---|------|---------|------------------------|
| 1 | {item} | CONDITIONAL | {requirement} · {requirement} |
| 2 | {item} | ALLOWED | — |
| 3 | {item} | NOT ALLOWED | — |

## References
1. {Law or regulation} — {URL} (accessed {YYYY-MM-DD})
2. {Source} — {URL} (accessed {YYYY-MM-DD})

*Engineering compliance notes, not legal advice.*
```
