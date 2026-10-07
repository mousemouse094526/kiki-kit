# How the warroom skills fit together

**English** · [ไทย](flow.th.md)

What to run, in what order; what each skill does; where it waits for you.

**Rule of thumb:** planning chains itself (warroom → legal → tickets) ·
building is one ticket per **new session** · debugging starts itself on a
failure the build can't explain · a trial is always your call.

## 1. The whole path

```mermaid
flowchart LR
    W["/warroom"]
    L["warroom-legal"]
    T["warroom-tickets"]
    B["/warroom-build<br/>one ticket"]
    D["warroom-debug"]
    R["/warroom-build<br/>--review-feature"]
    TR["/warroom-trial"]

    W -->|auto, before the gate| L
    W -->|auto, after Approve| T
    T -->|you paste the build prompt<br/>in a new session| B
    B -->|auto, unexplained failure| D
    B -->|you, every ticket done| R
    R -->|you, app runs locally| TR
```

**"auto" chains inside one session · "you" means the skill stops for you**
- `/warroom-build` once per ticket, each in a new session, until all are done.
- What a trial finds → section 8 · picked findings become new tickets, and
  you go round build → review → trial until it's clean, then merge.
- legal and debug also run alone: `/warroom-legal`, `/warroom-debug`.

**What you type:**

```
/warroom                                          ← plan + tickets
/warroom-build auth-user-company                  ← new session per ticket, until all done
/warroom-build auth-user-company --review-feature
/warroom-trial auth-user-company
```

## 2. One gate upstream — the spec must be ready

```mermaid
flowchart LR
    G{"Gate"}
    RD["ready-to-build"]
    DR["draft<br/>→ /warroom again"]
    TK["warroom-tickets"]

    G -->|no Open Questions| RD --> TK
    G -->|a blocking question| DR
```

A question not asked while planning gets asked mid-build — halfway through
code, with a nearly full context, and no red team or legal check behind the
answer. So it's stopped upstream.

- The spec has `Status: draft | ready-to-build` and `## Open Questions`.
- **Approve** is offered only when Open Questions is empty (or every entry says why it doesn't block).
- An `UNVERIFIED` legal verdict blocks too — until a source is cited or you accept the risk.
- Not ready → **Stop as draft** gives a prompt to resume `/warroom` with the questions listed.
- tickets and build **refuse** a `draft` spec.

## 3. warroom — plan

```mermaid
flowchart LR
    I["Interview<br/>one question at a time"]
    DOC["Write docs"]
    LG["warroom-legal"]
    RT["Red team<br/>5 subagents"]
    S["ADR sweep"]
    G{"Gate"}
    TK["warroom-tickets"]

    I --> DOC --> LG --> RT --> S --> G
    G -->|Approve| TK
```

One session — the gate is the only place you decide.

| Step | Does | You |
|---|---|---|
| Interview | one question at a time, a recommended choice · looks up code / ADRs / docs first · can't answer yet → Open Question | answer |
| Write docs | spec (with Library assumptions + Testing decisions), decisions (D1…), flow | — |
| legal | Thai law item by item → `legal.md` · `UNVERIFIED` blocks the gate | answer if ambiguous |
| Red team | Advocate (user) · **Builder** (opens the real library docs, walks the work as its builder to find what would be asked) · Breaker (attacks) · Tester (testable?) · Skeptic (needed?) | decide what needs deciding |
| ADR sweep | finds project-wide decisions, drafts ADRs | — |
| Gate | summary + Open Questions | **Approve** / **Adjust** / **Stop as draft** |

**After Approve:** tickets are cut in the same session — or, when the
context is already long, you get `/warroom-tickets {slug}` to paste in a
new one.

**Leaves:** `docs/features/{slug}/` spec, decisions, flow, legal · `docs/adr/` · `CONTEXT.md`

**Re-opening a feature** (`/warroom {slug}`): asks only the `→ /warroom`
rows in `open-items.md` + Open Questions → new D → legal + Breaker → gate →
re-cut.

### 3.1 Map mode — too big for one session

```mermaid
flowchart LR
    I["A few questions<br/>size it"]
    M["Session 1<br/>chart map.md, stop"]
    R["Later sessions<br/>one question at a time"]
    DOC["Map empty<br/>→ write docs"]
    G{"Gate"}

    I -->|≥ 5 open decisions| M --> R
    R -->|Open + Fog empty| DOC --> G
```

About five or more open decisions, with answers that will raise new
questions → chart a map instead of interviewing until the context runs out.

| Section of `map.md` | Holds |
|---|---|
| Destination | where it ends, e.g. "a ready-to-build spec for …"; fixes the scope |
| Decided | one line each, linked to its D |
| Open | sharp questions + kind (interview / sketch / research / task) + what blocks them |
| Fog | areas you know are coming but can't phrase yet |
| Out of scope | past the destination; never comes back |

- Session 1 charts and **stops** · later `/warroom {slug}` sessions resolve one question at a time and **record before anything else**.
- Open + Fog empty → docs → legal → red team → ADR → gate as usual.

**In every interview:** ask the 2–3 qualities this feature really stresses
(speed/load, a dependency down, who sees the data) · never invent a why —
write `rationale not recorded` · words run out → a rough sketch (state
table, text mockup), never code · seams: reuse, highest, fewest · a pivot is
a new feature.

## 4. warroom-legal — Thai law

One verdict per item: **ALLOWED** (the citation) · **NOT ALLOWED** (the
reason) · **CONDITIONAL** (what must exist → into the spec and tickets) ·
an ambiguous item is asked, never guessed · not legal advice.

## 5. warroom-tickets — cut the work

```mermaid
flowchart LR
    C["Read docs<br/>spec must be ready"]
    CV["Set conventions<br/>if missing"]
    EX["Explore code<br/>find prefactors"]
    DR["Draft tickets"]
    Q{"You approve?"}
    WR["Write tickets<br/>+ build prompt"]

    C --> CV --> EX --> DR --> Q
    Q -->|yes| WR
```

| Step | Does | You |
|---|---|---|
| Read | spec `draft` → stop, send to `/warroom` · tickets exist → asks whether to re-cut (tickets not done are renumbered) | answer |
| Conventions | an area with no rules → proposes folders + test tools → `.claude/skills/{framework}-{surface}/` | accept / adjust |
| Explore | existing code to tidy → prefactor tickets first | — |
| Draft | each ticket screen to DB · walks each as its builder: structural choice → into conventions now · behaviour → open-items row `→ /warroom`, stops without tickets | — |
| Approve | size, Blocked by, merge / split | answer until happy |
| Write | `tickets/NN-*.md` + build prompt (checks docs committed, branch, docker, secrets, open items) | commit, paste the prompt in a new session |

## 6. warroom-build — one ticket

```mermaid
flowchart LR
    P["Pick ticket"]
    CX["Read conventions<br/>+ library docs"]
    TDD["TDD<br/>red → green"]
    E2E["e2e"]
    RV["Full suite<br/>+ 3-axis review"]
    CM["Commit · done"]

    P --> CX --> TDD --> E2E --> RV --> CM
```

**Why one ticket per session:** a clean context reads only what this
ticket needs · the review diffs only this ticket · one commit per ticket
reverts alone · memory lives in files (ticket, decisions, open-items), not
chat.

| Step | Does | You |
|---|---|---|
| Start | uncommitted changes → asks: commit them first or stash | answer |
| Pick | the named ticket or the lowest one that can start · one left `in-progress` → reads its open-items rows, asks to resume | — |
| Prepare | conventions (none → stop → `/warroom-tickets`) · version table · `docs/library-notes/` notes for the installed version | answer upgrades (recommended: stay) |
| TDD | one criterion at a time, red → green, at the agreed seams | — |
| e2e | `(e2e)` criteria once the code is green | — |
| Check | full suite + typecheck + lint · **Standards / Spec / Newcomer** review in parallel · a fix changed code → suite again | — |
| Commit | `feat({slug}): {title} (#NN)` · no push | new session, next ticket |

**Every ticket done** → `--review-feature`: the three axes over the whole
branch + the `→ feature review` rows → you pick what to fix.

### 6.1 When the build meets something the docs didn't decide

```mermaid
flowchart LR
    X{"Not yet<br/>decided"}
    U["Use that answer"]
    A["Ask you → record<br/>carry on"]
    S["Stop · open-items<br/>→ closing flow"]

    X -->|the docs answer it| U
    X -->|this ticket's own how| A
    X -->|anything else| S
```

**The build implements decisions; it doesn't make them** — a decision made
during build skips the red team and legal.

| Case | Build does |
|---|---|
| found by searching (all decisions, ADRs, spec, conventions, reference) | uses it, no question |
| only this ticket's how (error wording, a default, a new layer's rules) | asks, saying where it looked → a new D or conventions, settled completely → carries on |
| touches the spec / another ticket / legal / an ADR / an old D · can't build as cut · docs contradict · unsure | stops → open-items row (`→ /warroom` or `→ /warroom-tickets`) |
| unexplained error | calls debug → fix → carries on |
| test already broken | doesn't fix → row `→ /warroom-debug` |
| review outside the ticket | row `→ feature review` |
| too big for one session | stops at the end of a criteria group, commits what's green as `wip` · row `→ /warroom-build` |

**Never ends a session with uncommitted code.** When it stops:

1. Asks: keep the code on branch `wip/{slug}-{NN}` (recommended) or discard.
2. Commits the docs — ticket status, open-items row — on the feature
   branch, where the next flow reads them.
3. Moves the code to `wip/`, or discards it.

## 7. warroom-debug — find a bug's cause

```mermaid
flowchart LR
    RP["Make it fail<br/>every time"]
    SC["Narrow scope<br/>docs · git"]
    FP["Find fail path"]
    H["Hypotheses<br/>kill first"]
    FX["Fix + test"]
    PM["Postmortem"]

    RP --> SC --> FP --> H --> FX --> PM
```

No guessing before it fails reliably · every step goes into
`bugs/{date}-{slug}.md` in the feature folder (or `docs/bugs/`) as it happens.

- Can't make it fail → stops, asks for logs · row `→ /warroom-debug`.
- Code does exactly what the docs say → a spec gap, not a bug · row `→ /warroom`.
- Every experiment goes in the ledger · an **Outsider** subagent reads only the record for a fresh view.
- Blameless postmortem · prevention work is asked first; only a yes makes a ticket.
- Run on its own → asks before committing · on the default branch offers a `fix/{slug}` branch.
- Not for a bug whose cause is plain at a glance — that just gets fixed.

## 8. warroom-trial — role-played users try the app

```mermaid
flowchart LR
    S["Done tickets<br/>+ app running locally"]
    C["Pick personas"]
    G["Goals<br/>in plain words"]
    RUN["Personas try it<br/>one at a time"]
    TRI["Sort findings"]
    P{"You pick"}

    S --> C --> G --> RUN --> TRI --> P
```

Personas are subagents that **see no code and no spec**, use a real
browser, and answer in the app's language · trial fixes nothing itself.

| Kind | Meaning | Picked → |
|---|---|---|
| **bug** | the app contradicts the spec | debug now, fix + test (e2e when seen on screen) |
| **spec gap** | the spec is silent or wrong | row `→ /warroom` |
| **friction** | matches the spec, hard to use | new ticket with an `(e2e)` criterion |
| **works as intended** | expected something a D ruled out | noted, citing the D |

- Unpicked → `open` in `user-trials/{date}.md`.
- Trial doesn't commit: it lists the files it wrote, and the next build asks how to commit them.
- Subagents can't reach the browser → stops; it never plays the personas itself.

## 9. `open-items.md` — everything unfinished, one place

```
| # | Ticket | From         | Found                        | Next               | Status      |
| 1 | 04     | build stop   | needs a session store first  | → /warroom-tickets | → ticket 05 |
| 2 | 04     | review: Spec | ...                          | → feature review   | open        |
| 3 | 06     | decision     | sign out on suspend at once? | → /warroom         | → D32       |
| 4 | —      | trial        | ...                          | → /warroom         | open        |
```

| Column | Meaning |
|---|---|
| **From** | where it came from: `tickets`, `build stop`, `decision`, `review: {axis}`, `feature review`, `full suite`, `debug`, `trial` |
| **Next** | the flow that closes it: `→ /warroom`, `→ /warroom-tickets`, `→ /warroom-debug`, `→ /warroom-build`, `→ feature review` |
| **Status** | `open` until that flow closes it → `→ ticket NN` / `→ D{n}` / `done (sha)` / `done (ticket NN)` / `done (bugs/{record})` / `dropped (why)` |

The closing skill updates Status · no build prompt while a `→ /warroom` or
`→ /warroom-tickets` row is open · `--review-feature` won't recommend merge
while any row is `open`.

### 9.1 Going back — when a skill stops and sends you elsewhere

```mermaid
flowchart LR
    B["/warroom-build<br/>ticket 04 stops"]
    OI["open-items row<br/>Next → /warroom"]
    W["/warroom slug<br/>re-opens the feature"]
    G{"Gate"}
    T["warroom-tickets<br/>re-cut if needed"]
    B2["/warroom-build<br/>resumes 04"]

    B -->|writes the row, commits docs| OI
    OI -->|you, new session| W
    W -->|asks only that row| G
    G -->|Approve: row → D| T
    T -->|you paste the build prompt| B2
```

**A stop is not a dead end: the row says which command you run next.**
- Run it right after the stop, in a new session. No need to finish other tickets first.
- `/warroom` re-opens the feature: spec back to `draft`, asks only the rows sent to it, new D, legal and Breaker, gate. On Approve it closes the row.
- Until then, tickets that don't depend on the stopped one can still be built.

| The row's Next | You run | It closes the row as |
|---|---|---|
| `→ /warroom` | `/warroom {slug}` | `→ D{n}` or `done (docs fixed)` |
| `→ /warroom-tickets` | `/warroom-tickets {slug}` | `→ ticket NN` |
| `→ /warroom-build` | `/warroom-build {slug}` (resumes the `in-progress` ticket) | `done (ticket NN)` |
| `→ /warroom-debug` | `/warroom-debug` with the row's bug | `done (bugs/{record})` |
| `→ feature review` | nothing now — `--review-feature` picks it up | `done ({sha})` or a new row |

## The folders it leaves

```
docs/
├── README.md                    ← map: what each folder is, who writes it, when to read it
├── features/{slug}/             ← everything for one feature, in one place
│   ├── spec.md  decisions.md  flow.md  legal.md  open-items.md  (map.md)
│   ├── tickets/                 ← the work, one ticket per file
│   ├── user-trials/             ← role-played user trial reports
│   └── bugs/                    ← bug investigations for this feature
├── adr/                         ← rules every feature must follow
├── library-notes/               ← what each library's docs recommend/warn, for the installed version
└── bugs/                        ← bugs outside any feature (appears on the first one)
.claude/skills/{framework}-{surface}/
├── SKILL.md                     ← folder layout + never-break rules for that code
└── rules/{layer}.md             ← the rules for each layer
```

## Words

| Word | Meaning |
|---|---|
| **D{n}** | one decision in `decisions.md` |
| **ADR** | a project-wide rule later features must follow (`docs/adr/`) |
| **seam** | where a test observes behaviour (a route, a service), agreed in the spec |
| **(e2e)** | behaviour only visible on screen, checked with the project's e2e tool (e.g. Playwright) |
| **Blocked by** | tickets that must be done first; always lower numbers |
| **frontier** | tickets that can start now |
| **prefactor** | a ticket that tidies existing code first; numbered first |
| **conventions** | the project's coding rules, `.claude/skills/{framework}-{surface}/` |
| **persona** | a role-played user in a trial |

## What each one leaves behind

| Skill | Files |
|---|---|
| `warroom` | `docs/features/{slug}/` spec, decisions, flow (+ `map.md` for big plans) · `docs/adr/` · `CONTEXT.md` |
| `warroom-legal` | `legal.md` |
| `warroom-tickets` | `tickets/NN-*.md` · `.claude/skills/{framework}-{surface}/` |
| `warroom-build` | code + tests, one commit per ticket · `docs/library-notes/` · `open-items.md` rows |
| `warroom-debug` | `bugs/{date}-{slug}.md` · `open-items.md` rows |
| `warroom-trial` | `user-trials/{date}.md` · new tickets · `open-items.md` rows |

Every skill that creates a folder under `docs/` adds its row to `docs/README.md`.
