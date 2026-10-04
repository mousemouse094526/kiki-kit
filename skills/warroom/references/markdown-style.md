# Markdown style — every doc the warroom skills write

Shared by every warroom skill — warroom, warroom-legal, warroom-tickets,
warroom-build, warroom-debug, warroom-trial — and every template they use.
Each template's own rules add to these; where they conflict, the template
wins.

## Rules

- **No checkboxes.** Plain `- ` bullets only — never `- [ ]` or `- [x]`.
  They render as raw `[ ]` in many viewers, and nobody ticks them. Whether
  something is done lives in a `**Status:**` field.
- **One fact per bullet.** A bullet that needs "and" twice is two bullets.
  Nest bullets for sub-cases and steps instead of writing long lines.
- **No chained facts in prose.** Don't join facts with `·`, `/`, or `+` on
  one line. Allowed only in table cells, footer lines
  (`**From:** … · **Status:** … · **ADR:** …`, a trial finding's
  `**Kind:** …` line), an ADR's `Source:` line, and `**Covers:**` lists.
- **Pick the shape that fits:** tables for contracts and comparisons,
  numbered lists for ordered steps, bullets for everything else.
- **Bold labels stand on their own line** with a blank line before the
  next one, so they render as separate paragraphs.
- **Headings go one level at a time** — `##` then `###`, never skipping.
- **Code identifiers in backticks** — fields, routes, error codes, env vars.
- **Link every outside fact to its source.** Anything that came from
  outside the project — library docs, a law, a standard, an issue, an
  article — carries a link where it is used, and the doc lists every link
  under `## Sources` at the end: `- [{title}]({url}) — {what it backs}
  (accessed {YYYY-MM-DD})`. Facts from the project itself (code, `D{n}`,
  ADRs) are cited by name, not linked. A doc with no outside facts has no
  Sources section. **Exception:** `legal.md` keeps its numbered
  `## References` section instead, cited inline as `[n]` — the same rule
  under the name lawyers expect.
- **Language** — see the next section.
- No emoji, no raw HTML.

## Language — English except the docs

One rule for every warroom skill:

| Output | Language |
|---|---|
| **Docs the user reads** — spec, decisions, flow, legal, ADRs, tickets, debug records, trial reports, `CONTEXT.md` descriptions | the language the user writes in |
| Chat replies and AskUserQuestion choices | the language the user writes in |
| Everything else — skill files, prompts between agents (subagent briefs, the build prompt), `docs/reference/` notes, code, code comments, test names, log messages, commit messages, branch names | **English** |

Inside the docs, **fixed tokens stay in English**: file names, template
labels and headings, status and kind words, verdict words, `D{n}`, glossary
term names, code identifiers. Quoted UI text stays in the language the app
shows it in.

## Self-check — before finishing

Re-open every file you wrote or changed in this run, then:

1. **Template match** — same headings, labels, and order as the skeleton
   in its template; no required section missing.
2. **Checkboxes** — search for `[ ]` and `[x]`; replace with plain `- `.
3. **Sources** — every outside fact has a link, and every link appears
   under `## Sources` (`## References` in `legal.md`).
4. **Rule pass** — read each bullet against the rules above and the
   template's own rules (length limits, one fact per bullet, citations,
   the language table).
5. Fix what fails, then re-run 1–4 on the fixed files.

Report "self-check: passed" or what was fixed in one line of the reply.
