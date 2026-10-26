# How the warroom skills fit together

**English** · [ไทย](flow.th.md)

Three skills: **warroom** plans and cuts tickets, **warroom-build** builds
them, **warroom-trial** lets role-played users try the result.
**kiki-debug** finds a bug's cause — on its own with `/kiki-debug
{symptom}`, or called by the build inside a ticket. Two files
answer the two questions you keep asking:

- **Where does everything stand?** `docs/progress/board.md` — one row per
  feature, with the command that moves it next.
- **Did we already decide this?** `docs/decisions.md` — every decision of
  every feature, one line each, by subject. The warroom checks it before
  every question, so nothing is asked twice. Each row lists the features
  that reuse it (**Used by**), so changing a decision updates all of them.

## 1. The whole path

```mermaid
flowchart LR
    W["/warroom<br/>plan + legal + tickets"]
    B["/warroom-build slug 01<br/>ticket after ticket"]
    R["/warroom-build slug<br/>--review-feature"]
    TR["/warroom-trial slug"]
    M["merge"]

    W -->|you paste the command| B
    B -->|every ticket done| R
    R -->|optional| TR
    R -->|nothing open| M
```

**Every skill ends with the next command, ready to paste.**
- You never work out what to run: copy the code block at the end of the reply.
- Builds continue from ticket to ticket in one session; the build asks before each next one.
- A trial's picked findings become one fix ticket → back to `/warroom-build`.

**What you type:**

```
/warroom                                   ← plan, legal, tickets
/warroom-build company-user 01             ← then whatever command it ends with
/warroom-build company-user --review-feature
/warroom-trial company-user                ← optional
```

Other modes: `/warroom legal {items}` (legal check only) ·
`/warroom tickets {slug}` (re-cut) · `/kiki-debug {symptom}`
(any bug).

## 2. warroom — plan, then cut

```mermaid
flowchart LR
    I["Interview<br/>one question at a time"]
    DOC["Write docs"]
    LG["Legal check"]
    RT["Red team<br/>5 subagents"]
    S["ADR sweep"]
    G{"Gate"}
    TK["Cut 2–4 tickets<br/>+ progress.md"]

    I --> DOC --> LG --> RT --> S --> G
    G -->|Approve| TK
```

| Step | Does | You |
|---|---|---|
| Interview | checks `docs/decisions.md` first — already decided → reuses it, doesn't ask; then one question at a time, a recommended choice; can't answer yet → Open Question | answer |
| Write docs | spec, decisions (D1…, each indexed in `docs/decisions.md` as it lands), flow; screens get a design brief (Must show) | — |
| Legal | Thai law item by item → `legal.md`; `UNVERIFIED` blocks the gate | answer if ambiguous |
| Red team | Advocate, Builder, Breaker, Tester, Skeptic | decide what needs deciding |
| ADR sweep | finds project-wide decisions, drafts ADRs | — |
| Gate | summary + Open Questions | **Approve** / **Adjust** / **Stop as draft** |
| Tickets | conventions where missing; 2–4 big vertical tickets; `progress.md`; the board row | approve, merge, or split |

**Approve** is offered only when no Open Question blocks building. The
spec stays `draft` until then, and the build refuses a `draft`.

**Screens?** The interview asks once where the design comes from: a Figma
link, images, existing components, or **design after the plan**. After the
plan, each screen's Source is `pending` and its Must show column is the
brief to design from:

```mermaid
flowchart LR
    P["/warroom<br/>plan + brief"]
    API["/warroom-build<br/>non-UI tickets"]
    D["You design<br/>in Figma"]
    L["/warroom slug<br/>paste the link"]
    UI["/warroom-build<br/>UI tickets"]

    P --> API
    P --> D --> L --> UI
```

Pasting the link only fills Source and unblocks the UI tickets. Something
the design adds that the plan lacks (a field, a step) becomes a change
request for that part only.

**One feature or two?** By default a change grows the feature you have
(a change request: `/warroom {slug}`, new tickets after the done ones).
A new feature only when it has its own users or data and could ship on its
own, or when the old one turned into something else.

**Big plan?** About five or more open decisions → session 1 charts a
`docs/progress/{slug}/map.md` and stops; later `/warroom {slug}` sessions settle it one question
at a time, then the steps above run as usual.

## 3. warroom-build — ticket after ticket

```mermaid
flowchart LR
    P["Read progress.md<br/>+ run CI checks"]
    L["Load ticket<br/>conventions, lib docs"]
    TDD["TDD<br/>red → green"]
    CK["CI checks<br/>+ 3-axis review, fix"]
    CM["Commit<br/>+ log in progress.md"]
    Q{"Next ticket?"}

    P --> L --> TDD --> CK --> CM --> Q
    Q -->|continue here| L
```

- **Starts** by reading `progress.md` — what earlier tickets built and left for this one — and running every CI check, so anything already red is known.
- **Checks** use CI's exact commands; no commit while a check this ticket broke is red.
- **Review** findings are fixed in the ticket, not parked.
- **Ends each ticket** with a summary in `progress.md` (shown in chat), then asks: continue here, or stop with the next command.
- After two big tickets, it recommends a new session.

### 3.1 When the docs don't settle something

| Case | Build does |
|---|---|
| the docs answer it | uses the answer |
| small, inside the feature (a default, a message, a limit) | decides, records a D, lists it in the log |
| something the user would notice, a legal item, or an ADR | asks you; stays inside the spec → a D, carries on |
| it changes what the spec promises, or you want to wait | Blocked row → stops with `/warroom {slug}` |
| a failure it can't explain | calls the **kiki-debug** skill inside the ticket, then carries on |

## 4. The board and `progress.md` — where everything stands

`docs/progress/board.md`, one row per feature:

```
| Feature        | Stage    | Left          | Next                              |
| user-contact   | done     | —             | —                                 |
| company-user   | building | tickets 03–04 | /warroom-build company-user 03    |
| loyalty-points | mapping  | 4 questions   | /warroom loyalty-points           |
```

Each skill updates its feature's row at the end of the session. The
detail per feature is `docs/progress/{slug}/progress.md`:

```
**Now:** 02 done; 03 next
**Next:**  /warroom-build company-user 03

## Tickets      01 done · 02 done · 03 ready
## Log          per finished ticket: Built · Decided · For the next ticket · Checks
## Blocked      only what the build may not settle itself
```

Every build session reads it first and writes it last. **For the next
ticket** is how one ticket tells the next what it must know.

## 5. Going back — a Blocked row

```mermaid
flowchart LR
    B["/warroom-build<br/>stops"]
    BL["Blocked row<br/>in progress.md"]
    W["/warroom slug<br/>asks only that"]
    B2["/warroom-build<br/>resumes"]

    B -->|writes it, commits| BL
    BL -->|you paste the command| W
    W -->|Approve: row → D| B2
```

| The row needs | You run | It closes as |
|---|---|---|
| `/warroom {slug}` | the command the build ended with | `→ D{n}` |
| `/warroom tickets {slug}` | the same | `→ ticket NN` |
| `/kiki-debug {symptom}` | the same, once the logs or data are in | `done ({sha})` |
| `/warroom {slug}` for `design: {screen}` | with the design link | `done` |

You don't edit `progress.md` yourself. To drop a row, tell the skill.

## 6. warroom-trial — role-played users

```mermaid
flowchart LR
    S["Done tickets<br/>+ app on localhost"]
    C["Pick personas"]
    RUN["Personas try it<br/>one at a time"]
    TRI["Sort findings"]
    P{"You pick"}

    S --> C --> RUN --> TRI --> P
```

Personas are subagents that see **no code and no spec**.

| Kind | Picked → |
|---|---|
| **bug** / **friction** | all into one new fix ticket → `/warroom-build {slug} {NN}` |
| **spec gap** | Blocked row → `/warroom {slug}` |
| **works as intended** | noted, citing the D |

## The folders it leaves

```
docs/
├── README.md                    ← what each folder is for
├── decisions.md                 ← every decision, by subject — check before deciding
├── features/{slug}/             ← what the feature is
│   └── spec.md  decisions.md  flow.md  legal.md
├── progress/                    ← the work in flight
│   ├── board.md                 ← every feature: stage, what's left, next command
│   └── {slug}/
│       ├── progress.md  (map.md)
│       ├── tickets/             ← 2–4 tickets, one file each
│       ├── user-trials/         ← trial reports
│       └── bugs/                ← bug investigations for this feature
├── adr/                         ← rules every feature must follow
├── library-notes/               ← what each library's docs recommend, for the installed version
├── bugs/                        ← bugs outside any feature
└── legal/                       ← standalone legal checks
.claude/skills/{framework}-{surface}/   ← the project's coding conventions
```

An older project (progress and tickets inside `features/{slug}/`) is moved
to this layout once, the first time any warroom skill runs there.
`docs/adr/` stays as it is.

## Words

| Word | Meaning |
|---|---|
| **D{n}** | one decision in a feature's `decisions.md`; outside it, cited with the slug: `user-contact D4` |
| **ADR** | a project-wide rule later features must follow (`docs/adr/`) |
| **Used by** | the features that reuse a decision; changing it updates them all |
| **seam** | where a test observes behaviour, agreed in the spec |
| **(e2e)** | behaviour only visible on screen, checked with the project's e2e tool |
| **Blocked** | a row in `progress.md` the build may not settle itself |
| **conventions** | the project's coding rules, `.claude/skills/{framework}-{surface}/` |
| **persona** | a role-played user in a trial |
