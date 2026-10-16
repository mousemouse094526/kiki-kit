---
name: warroom-trial
disable-model-invocation: true
description: >-
  Role-played users try a built warroom feature in the local app through
  the browser, without seeing the code or spec; findings are triaged into
  one report, and picked ones become a fix ticket or go back to warroom.
  /warroom-trial {slug}.
---

# Warroom Trial — let the users try it before they do

Personas → goals → each persona uses the app alone → dev-lead triage → one
report → the user picks what to act on.

## 1. Before starting

- **Feature docs** in `docs/features/{slug}/` (spec.md) and its tickets in
  `docs/progress/{slug}/tickets/`. Tickets still inside the feature folder
  → the older layout: run [migrate.md](../warroom/references/migrate.md)
  first. Trial only tickets that are `done`; leave out the stories of tickets not
  built yet. Tell the user in one line which tickets were tried, which
  were skipped, and why. No tickets → stop and end with
  `/warroom tickets {slug}`.
- **The app runs locally.** Start it the project's way (a launch config,
  the `run` skill, the setup docs). Trials run **only on a local development
  host** (`localhost`, `127.0.0.1`, `*.localhost`, `*.test`) — never staging
  or production, never real user data.
- **Mobile apps run as the project's dev build in a simulator or
  emulator**, pointed at the local api — never a store build, never an
  installed production app. Check the api URL the build uses before the
  first persona starts.
- **The browser reaches the personas.** Persona subagents need the browser
  tools. Before casting, check that a subagent can open the app URL. It
  can't → stop and tell the user. Never play the personas yourself.
- **Test accounts** come from the project's seed or fixture data, or are
  created in the local app for this trial. Write any you create into the
  project's seed or example config, not into chat.

## 2. Cast the personas

Read [references/personas.md](references/personas.md). Propose a cast:

- every actor in spec.md › User Stories (Admin, Employee, …);
- the real-world roles the user named or the domain implies (a manager
  checking on staff, a sales rep showing it to a client, a first-day
  employee, someone on a phone in a hurry).

Ask with AskUserQuestion (multiSelect, recommended ones first) which
personas to run. Three to five is usually enough.

## 3. Write the goals

For each persona, 3–6 **goals in the persona's own words**: what they want
done, not how: "I need to get the new hire into the system before she
starts Monday". Take them from User Stories, Expected Outcome, and
flow.md, plus one or two the spec never mentions but the persona would
likely try. Show the cast and goals in chat before running.

## 4. Run each persona

One subagent per persona, **one at a time**. Each gets only the brief from
[references/personas.md](references/personas.md): who they are, their
goals, the app URL, their test account, the device. **Never the code, the
spec, or another persona's report.**

Each persona uses the app as that person would (skims, guesses, misreads,
gives up when they would give up) and returns the report format in the
brief. A phone persona uses the mobile viewport for a website, or the
project's dev build in the simulator for a mobile app.

## 5. Dev-lead triage

You are now the dev lead. Read every persona report against spec.md,
decisions.md, and `docs/decisions.md` (another feature's decision counts
too), and sort each finding:

| Kind | Meaning | Default next step |
|---|---|---|
| **bug** | the app contradicts the spec | the fix ticket |
| **spec gap** | the spec is silent or wrong for a real goal | `/warroom {slug}` |
| **friction** | works as specified, but the persona struggled | a new ticket |
| **works as intended** | the persona expected something the docs ruled out | note it, cite the `D{n}` (with its slug when another feature's) |

Merge duplicates across personas into one finding and count how many
personas hit it. Rank by **blocked goal** first, then by that count.

## 6. Write the report

`docs/progress/{slug}/user-trials/{YYYY-MM-DD}.md` from
[templates/trial-report.md](templates/trial-report.md). Run the self-check
in [markdown-style.md](../warroom/references/markdown-style.md).

## 7. The user picks

Show the ranked findings in chat, one line each with its kind and proposed
next step. Ask with AskUserQuestion (multiSelect) which to act on now:

- **bug** and **friction** → all of them go into **one** new ticket,
  `Trial fixes {YYYY-MM-DD}`, numbered after the highest, in
  [the ticket template](../warroom/templates/ticket.md),
  `**Status:** ready-for-agent`, in `docs/progress/{slug}/tickets/`, with a
  row in `progress.md`. One
  acceptance criterion per finding, each the persona's goal as an `(e2e)`
  criterion. A bug's criterion carries the persona's steps as its repro.
- **spec gap** → a row in `progress.md` › Blocked (Needs:
  `/warroom {slug}`, citing the finding); don't edit the spec here.

Everything not picked stays in the report as `open`. Update the feature's
board row in `docs/progress/board.md` (Stage `building` with a fix ticket,
`blocked` with a spec gap; Left; Next). No product code, no branch, no
commit from this skill: it writes only the report, `progress.md`, the
board, the fix ticket, and any test account added to seed or example
config. List those files, then end with the next command in its
own code block — `/warroom-build {slug} {fix ticket NN}`, or
`/warroom {slug}` when a spec gap must be settled first.

## Operating rules

- **Local only.** No staging, no production, no real user data.
- **Personas never see the code or the spec.**
- **Goals, not steps.**
- **Personas run one at a time**, each in a fresh subagent.
- **Nothing is fixed without the user's pick.**
- **Report in the user's language**; kinds, status words, and `D{n}` stay
  in English. Persona briefs are in English, but each persona **answers in
  the language its real users speak** (the app's UI language, e.g. Thai);
  its words go into the report untranslated. Personas quote the app's UI
  text exactly as shown.
