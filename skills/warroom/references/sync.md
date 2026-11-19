# Sync — bring Figma and the design links back in line with the code

`/warroom sync [slug]`. Compares what the code renders with the frames in
the Figma file, draws the states that have no frame, corrects frames whose
copy or simple structure drifted, and updates the links. No slug → every
feature. Writes Figma and docs, never code.

Run it at feature close or before a release. It needs no design-first
scope ADR ([design.md](design.md)).

The code is the truth for what exists; Figma is the truth for how it
looks.

## Before anything

1. **The Figma file.** From the design source in `docs/decisions.md` or
   its ADR. The design source is not a Figma file (images, existing
   components only) → say so and stop.
2. **The Figma MCP.** It must read the file. It cannot write → run steps
   1–3 below and report; draw and fix nothing.
3. **Scope.** With a slug: that feature's screens. Without: every feature
   on the board, one feature after another, one report at the end. Read
   each feature's spec › Design and `progress.md` › Design sync rows.
4. **The design index** ([design.md](design.md) › Link rules). Read it;
   missing → it is created in step 6.

## Steps

1. **Inventory the code.** Per app, list every screen and every state it
   renders, from the routes and the components: each route, then each
   branch its components render (error, empty, loading, notice, confirm,
   no permission, a dialog, a step). Read the code; do not guess from file
   or component names. Take the copy of each state from the project's
   message catalog (the i18n files); a project without one → the strings
   in the code.
2. **List the frames.** Read the Figma file through the Figma MCP, page
   by page: every frame, its name, its node id. Never from the docs.
3. **Match them**, into four lists:
   - **missing** — a state the code renders with no frame;
   - **drifted** — a frame whose copy or structure no longer matches the
     code;
   - **ahead** — a frame for something the code does not have yet;
   - **matched** — nothing to do.

   Show the counts per feature and ask once with AskUserQuestion before
   the first write: **Draw and correct** (Recommended), **Draw only**
   (leave existing frames alone), or **Report only**. Say in the question
   that correcting changes the designer's frames.
4. **Draw each missing state.**
   - Copy the nearest existing frame — the same screen's default, else
     the closest state of it — and edit the copy. Never build one from
     nothing.
   - Use the file's own components and tokens: instances, bound colours,
     type, and spacing. No detached shapes, no raw hex.
   - Copy text exactly from the message catalog.
   - Put it in a section named `code sync — {YYYY-MM-DD}` at the end of
     the page that holds the screen. One section per page per run.
   - Name it the way the file names its frames
     (`{screen} / {state} / {breakpoint}` when the file has no rule).
5. **Correct the drifted frames.**
   - **Copy** → fix it in place, from the message catalog.
   - **Simple structure** — a field, a row, a button, a message added or
     removed, built from an existing component → fix it in place.
   - **Needs a new layout** (the screen was rearranged, a new component,
     a new pattern) → do not redraw it. List it for the designer: frame
     link, what the code shows, what the frame shows.
   - **Ahead** frames → leave them alone, every one. List them in the
     report only.
6. **Update the links** ([design.md](design.md) › Link rules), in the same
   change as the frames:
   - the design index — one row per frame added, From
     `code sync {YYYY-MM-DD}`; a frame found in step 2 that the index
     lacks gets its row too, From `design`; create the index if missing;
   - spec › Design › Source — only where a screen's own frame was missing
     from it or pointed at a frame that is gone;
   - `progress.md` › Design sync — each row now drawn → Status
     `synced {YYYY-MM-DD}`; a row listed for the designer →
     `for designer`;
   - the board is not touched.
7. **Check by screenshot.** Take a screenshot of a sample of each kind of
   edit — a drawn state, a copy fix, a structure fix — on every page
   touched, and look at it: text not clipped, nothing overlapping, the
   frame tall enough, no stray white box. Fix what is wrong and look
   again. A script that ran without error is not a visual check.
8. **Report** in chat, in the user's language:
   - frames added, per page, with the section's link;
   - frames corrected — copy, structure;
   - what is left: the list for the designer, and anything that failed;
   - ahead frames left alone;
   - **how many frames were checked by screenshot**, out of how many
     changed;
   - one line saying existing frames were edited, which changes the
     designer's work, and that the Figma file's version history is the way
     back — with the version name saved before the first write, when the
     MCP could save one;
   - the commit command for the docs changed:
     `git add {paths} && git commit -m "docs: design sync {YYYY-MM-DD}"`.
     Leave them uncommitted.

## Writing to Figma

- **One page per script.** Work page by page and never switch page twice
  in one script.
- **One frame, one guard.** Wrap each frame's edits so a failure removes
  only that frame (or leaves that one existing frame untouched), and the
  rest of the script goes on. Every script returns the ids of everything
  it created or changed; build the report and the index from those ids.
- **Clear the default fill.** A new auto-layout frame gets a white fill;
  remove it unless the design calls for one.
- **Replace whole strings.** When replacing text by pattern, match and
  replace the entire string, never only its start.
- **Check before adding.** Before adding a field, a row, or a frame, look
  for it; already there → skip. A second run on the same day reuses that
  day's section.
- **Make room, then re-lay out.** After adding content, make the frame
  tall enough to show it, then re-lay out the rows of the section so
  frames don't overlap.
- **Save a version first** when the MCP can: name it
  `before code sync {YYYY-MM-DD}`.

## Rules

- **No code changes.** Code that looks wrong against the spec is a line
  in the report, with `/warroom {slug}` or `/kiki-debug {symptom}` as its
  command.
- **Nothing is decided here.** A missing state that the spec doesn't
  mention is drawn as the code has it and named in the report; whether
  the spec should say so is a change request.
- **No slug → one report.** Each feature's spec and `progress.md` are
  written only as step 6 allows.
