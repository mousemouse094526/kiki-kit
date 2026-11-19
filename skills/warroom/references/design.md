# Design — what waits for a frame, and where frame links live

Read by warroom (Phase 1 › Screens, [reopen.md](reopen.md),
[sync.md](sync.md), the `ui-prompt.md` template) and by warroom-build
(Load › Design). The rules are stated here once; those files point here.

## Design-first scope

A **design-first scope** is an ADR in `docs/adr/` that says which UI work
must have a design before it is built and which may be built in code
first. The project writes it; the skills only read it.

- **No such ADR → nothing changes.** Every screen and every state needs
  its design before build; a `pending` Source stops the ticket; the design
  prompt asks for a frame per state.
- **Finding it.** Read the ADR titles, then the full text of any that
  mention design, Figma, frames, screens, or states. It counts only when
  it names both sides: what waits for a design and what does not. An ADR
  that only names the design source (a Figma file, a component library)
  is not a scope.
- **Its own words decide.** Sort each piece of UI work by what the ADR
  says, never by a default from this file. An ADR of this kind usually
  reads:
  - **design first** — a new screen, a new layout, a component the UI
    package lacks, a colour, font, or token;
  - **code first** — a state of a screen that already exists (error,
    empty, loading, notice, confirm), copy, and additions assembled from
    existing components.
- **Not clearly code first → design first.** A piece the ADR doesn't
  cover, or that you can't place, waits for its design.
- **Code first is a debt, not a waiver.** Every code-first piece gets a
  row in `progress.md` › Design sync when it is built, and `/warroom sync`
  draws it later ([sync.md](sync.md)).

## Where the split is recorded

Under a design-first scope, spec › Design has an **At sync** column: per
screen, the states and parts that are built in code first. Everything
else in Must show waits for its frame. Planning fills it (Phase 1 ›
Screens, or a change request); the build reads it and does not re-decide.
A spec written before the ADR has no column → the build sorts the
ticket's work against the ADR and adds the column in the ticket's commit.

## Link rules

1. **spec › Design › Source** holds the link of each screen's frame — the
   screen, not its states.
2. **One central design index** holds every frame, states included,
   grouped by app, then feature.
   - The project already has a design index doc (an ADR, `docs/README.md`,
     or `docs/decisions.md` names it) → use that one, in its own format.
   - None → `docs/design/index.md`, from the skeleton below, with its row
     in `docs/README.md`. It is created by the first `/warroom sync`, or
     by the first design link brought in under a design-first scope.
   - No index and no design-first scope → spec › Design is the only place,
     as before; nothing creates an index.
3. **Whoever adds, moves, or replaces a frame updates both in the same
   change** — the Source cell when the frame is the screen's, the index
   row always. This holds for a design link brought with `/warroom {slug}`,
   a frame a skill makes through the Figma MCP, and every frame a sync
   draws or corrects.
4. **The build reads the index, not only the spec.** For each screen a
   ticket covers, warroom-build takes the screen's frame from Source and
   its states' frames from the index, so frames a sync added are seen by
   later tickets.
5. **A link points at one frame** (a node link), never at a page or the
   file.

### Skeleton: docs/design/index.md

```markdown
# Design index

Every frame in {Figma file link}, by app and feature. The screen's own
link is also in its feature's spec › Design.

## {app}

### {feature slug}

| Screen | State | Frame | From |
|---|---|---|---|
| {Contact form} | default | [frame]({url}) | design |
| {Contact form} | error: invalid phone | [frame]({url}) | code sync {YYYY-MM-DD} |
```

- **State** is `default` for the screen itself, else the state's name as
  the spec or the code names it. One row per breakpoint when the frames
  differ: `default (mobile)`.
- **From** is `design` (the designer or a design prompt made it) or
  `code sync {YYYY-MM-DD}` (a sync drew it from the code). A sync that
  only corrected a frame leaves From as it was.
- Rows are never deleted while the frame exists. A frame replaced → the
  row's link changes; a frame removed → the row goes.
