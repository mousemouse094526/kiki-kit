---
name: figma-to-screen
description: >
  Create or update a React Native (Expo) screen from a Figma design link.
  Fetches design via Figma MCP, generates code using global.css theme tokens,
  HeroUI Native components, and follows frontend skill conventions (memo, useCallback,
  component layers, expo-router patterns). Verifies with lint + visual compare loop (3x).
  Trigger when user says "create screen", "สร้างหน้า", "update screen", "อัปเดตหน้า",
  "/create-screen", or provides a Figma URL with a screen name.
---

# Create Screen from Figma

Generate or update a React Native (Expo) screen that matches a Figma design.

---

## Step 0: Parse Input

From args or user message, extract:
- **Figma URL** — `https://figma.com/design/<fileKey>/...?node-id=<nodeId>`
- **Screen name / path hint** — e.g. "HomeScreen", "menu/detail"

If either is missing, ask the user before proceeding.

---

## Step 1: Load Tools (one ToolSearch call)

```
ToolSearch query="select:mcp__plugin_figma_figma__get_design_context,mcp__plugin_figma_figma__get_screenshot,mcp__plugin_figma_figma__use_figma"
```

Also load the `figma-use` skill before calling `use_figma`.

---

## Step 2: Read Context (parallel)

Run these **in parallel** — do NOT read sequentially:

1. **Figma design context** — call `get_design_context` with the URL. Get layout, components, spacing, colors, typography. Never assume — read from source.
2. **Figma screenshot** — call `get_screenshot` with the URL. Immediately download it to `/tmp/figma_screen.png` so it survives the session:
   ```bash
   curl -o /tmp/figma_screen.png "URL_FROM_GET_SCREENSHOT"
   ```
3. **`apps/mobile/src/global.css`** — read available theme tokens:
   - Colors: `--color-*`, `--fg-*`, `--button-*`, `--surface-*`, `--border-*`, `--text-*`
   - Spacing: `--spacing-2xs` through `--spacing-3xl`
   - Radius: `--radius-xs` through `--radius-full`
   - Typography: `--text-title-*`, `--text-body-*`, `--font-size-*`
   - Tailwind aliases in `@theme inline static`: these become your Tailwind class names
4. **`apps/mobile/src/hooks/use-theme-colors.ts`** — read available inline-style color tokens (the `ThemeColors` type lists all keys)

From the Figma design context, **extract exact pixel dimensions** for every key element:

| Element | Figma h | Figma w | Notes |
|---|---|---|---|
| Container / screen | ... | ... | full-width = w-full |
| Logo / avatar | ... | ... | square = size-[Xpx] |
| Inputs | ... | ... | h → h-[45px] etc |
| Buttons | ... | ... | h → h-[45px] etc |
| Nav bar | ... | ... | ... |
| Cards / tiles | ... | ... | ... |

Fill this table from the Figma data. These values are non-negotiable — code must match them exactly.

Only read `apps/mobile/CLAUDE.md` and `frontend` skill patterns if unclear about structure — lazy load to save tokens.

---

## Step 3: Detect Mode (Create vs Update)

1. Suggest file path from screen name hint:
   - Tab screen → `src/app/(app)/(tabs)/<name>.tsx`
   - Pushed screen → `src/app/(app)/<name>/index.tsx` or `src/app/(app)/<name>.tsx`
   - Auth screen → `src/app/(auth)/<name>.tsx`
   - Use existing route structure as reference — scan `src/app/` first

2. Check if file exists:
   - **Exists** → mode = UPDATE. Show user what will change. Confirm before writing.
   - **Not exists** → mode = CREATE. Confirm suggested path with user.

---

## Step 4: Scan for Existing Services

Before writing any data-fetching code:

```bash
find apps/mobile/src/services -name "*.ts" | head -30
```

Read relevant service files to understand available hooks. If the screen needs data:
- **Hook found** → wire it directly
- **Hook not found** → ask user to point to the correct service or endpoint. Do NOT assume or create a new service without asking.

---

## Step 5: Plan the Screen

Before writing code, produce a brief plan:

```
Screen: <name>
Mode: create | update
Path: <file path>
Components needed:
  - <ComponentName> → atoms | common | features/<feature>
  - <ComponentName> → already exists at <path>
Data hooks: <hook name> | none | ask user
Files to create/edit:
  1. <path> — reason
  2. <path> — reason

Dimension checklist (from Figma):
  - <element>: h=Xpx, w=Xpx → class: h-[Xpx] w-[Xpx] (or token if it maps exactly)
  - <element>: ...
```

Show plan to user. Proceed only after implicit or explicit approval.

---

## Step 6: Generate Code

### Styling Rules

#### Two-File Theme System (CRITICAL — read before writing any color)

This project has **two** theme files. Never hardcode hex or raw color values anywhere.

| File | Used via | When to use |
|---|---|---|
| `apps/mobile/src/global.css` | `className="bg-surface-default"` | Solid colors, borders, text colors — anything expressible as a Tailwind class |
| `apps/mobile/src/hooks/use-theme-colors.ts` | `style={{ color: colors.divider }}` | Semi-transparent `rgba()`, colors needed in RN `style={}` props (e.g. icon color, border color on native View), anything that can't be a Tailwind class |

**Decision rule:**
- Can it be a Tailwind class from `global.css`? → use `className`
- Is it `rgba()` / needed in `style={}` / a React Native prop that doesn't accept class names? → use `useThemeColors()` → `colors.xxx`
- **Never add a new raw `rgba()` or hex directly in component code.** Always go through one of the two theme files.

When adding a new color to `use-theme-colors.ts`, add it to ALL THREE places: `ThemeColors` type, `LIGHT_COLORS`, and `DARK_COLORS`.

**Colors — always use semantic Tailwind classes. Never hardcode hex or primitive token names.**

From `@theme inline static {}` in global.css, the available color classes are:
- Text: `text-text-strong`, `text-text-mid`, `text-text-subtle`, `text-text-brand`, `text-text-link`, `text-text-info`, `text-text-warning`, `text-text-error`, `text-text-success`, `text-text-inverse`, `text-text-light`
- Background: `bg-background-default`, `bg-background-primary`, `bg-background-mid`, `bg-background-white`, `bg-background-black`
- Surface: `bg-surface-default`, `bg-surface-primary`, `bg-surface-strong`, `bg-surface-mid`, `bg-surface-secondary`, `bg-surface-sunk`, `bg-surface-accent`, `bg-surface-info`, `bg-surface-warning`, `bg-surface-error`, `bg-surface-success`, `bg-surface-inverse`
- Border: `border-border-default`, `border-border-mid`, `border-border-strong`, `border-border-primary`, `border-border-brand`, `border-border-info`, `border-border-warning`, `border-border-error`, `border-border-success`
- Button: `bg-button-primary`, `bg-button-secondary`
- Special: `bg-terracotta`, `text-terracotta`, `bg-bubble-user`, `bg-bubble-ai`

From `use-theme-colors.ts`, available `colors.*` keys (via `useThemeColors()`):
`foreground`, `muted`, `subtle`, `accent`, `accentForeground`, `terracotta`, `background`, `surface`, `border`, `divider`, `success`, `warning`, `danger`, `sand700`, `textStrong`, `textSuccess`, `textInverse`, `textLight`, `primary`, `backgroundWhite`, `backgroundBlack`

These automatically adapt to light/dark mode.

**Spacing — always use Tailwind token classes:**
| Token | Class |
|---|---|
| `--spacing-2xs` (2px) | `p-2xs`, `gap-2xs`, `m-2xs` |
| `--spacing-xs` (4px) | `p-xs`, `gap-xs` |
| `--spacing-sm` (8px) | `p-sm`, `gap-sm` |
| `--spacing-md` (12px) | `p-md`, `gap-md` |
| `--spacing-lg` (16px) | `p-lg`, `gap-lg` |
| `--spacing-xl` (24px) | `p-xl`, `gap-xl` |
| `--spacing-2xl` (32px) | `p-2xl`, `gap-2xl` |
| `--spacing-3xl` (48px) | `p-3xl`, `gap-3xl` |

**Radius:**
| Token | Class |
|---|---|
| `--radius-xs` (4px) | `rounded-xs` |
| `--radius-sm` (8px) | `rounded-sm` |
| `--radius-default` (12px) | `rounded-default` |
| `--radius-lg` (16px) | `rounded-lg` |
| `--radius-xl` (24px) | `rounded-xl` |
| `--radius-full` (9999px) | `rounded-full` |

**Typography — always use token classes:**
- Titles: `text-title-3xlarge`, `text-title-2xlarge`, `text-title-xlarge`, `text-title-large`, `text-title-medium`, `text-title-base`, `text-title-caption`
- Body: `text-body-large`, `text-body-medium`, `text-body-base`, `text-body-caption`

**Dimensions — always match Figma exactly.**

For every element where Figma specifies a height or width:
- First check if a token maps exactly (e.g. `--spacing-3xl` = 48px → `h-3xl`). Token classes require no `[]`.
- If no token matches, use arbitrary value: `h-[45px]`, `w-[130px]`, `size-[130px]`.
- **Never omit h/w when Figma specifies them.** A missing `h-[45px]` on a button will not match Figma.
- Square elements: prefer `size-[Xpx]` over separate `h-[Xpx] w-[Xpx]`.

### Component Rules (from frontend skill)

- `memo` on ALL exported components — no exceptions
- `useCallback` on every function passed as prop or JSX event handler
- `useMemo` ONLY for: object/array/function used as hook dep or passed to memo'd child, OR expensive computation. Never for primitives.
- `export default` only for screens and mobile components
- One component per file — extract sub-components to their own files
- Named imports only — never `import React from "react"`

### Screen Template

```tsx
import { memo, useCallback, useMemo } from "react";
import { View, Text, Pressable, FlatList, ScrollView } from "react-native";
import { Stack } from "expo-router";
// HeroUI Native components
// import { Button } from "heroui-native";
// Internal imports
import { useSession } from "@frontend/mobile/libs/supabase/SessionProvider";

function ScreenNameContent() {
  // hooks, state, callbacks here
  return (
    <View className="flex-1 bg-background-default">
      {/* screen content */}
    </View>
  );
}

export default memo(function ScreenName() {
  return (
    <View className="flex-1 bg-background-default">
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenNameContent />
    </View>
  );
});
```

### Lists
- Use `FlatList` for data lists — always
- Use `ScrollView` only for short fixed-length content

### Component Placement
| Component type | Location |
|---|---|
| Pure UI, no logic/theme | `src/components/atoms/` |
| Shared + theme-aware | `src/components/common/` |
| Feature-scoped | `src/features/<feature>/components/` |
| Screen shell | `src/app/<route>.tsx` |

### HeroUI Native
Use HeroUI Native components when they match the design. Check `heroui-native` package for available components. Never assume a component exists — verify import works.

---

## Step 7: Write Files

Write each file. Follow this order:
1. Sub-components (atoms/common/features) — bottom-up
2. Screen file last

For UPDATE mode: make surgical edits only. Match existing code style. Remove only what your changes make unused.

**Never remove code that exists in mobile but not in Figma.** Figma is a static design — it doesn't show error states, loading spinners, validation messages, resend timers, or other dynamic UI. If mobile code has these, they are intentional functional additions. Only style properties (colors, sizes, spacing, radius) should be brought in line with Figma.

---

## Step 8: Verify

### 8a. Lint + Type Check
```bash
cd apps/mobile && bun run lint
```
Must pass 0 errors, 0 warnings. Fix all issues before continuing to 8b.

### 8b. Visual Compare Loop (max 3 iterations)

**This loop is mandatory. Do not skip it. Perform it up to 3 times.**

**Before iteration 1** — ensure simulator is running. If not, tell user to run `bun run dev`, open the app, and navigate to the screen. Then proceed once they confirm.

**Each iteration:**

1. Capture iOS simulator screenshot:
   ```bash
   xcrun simctl io booted screenshot /tmp/sim_screen.png
   ```
   If this fails (no booted simulator), stop and tell the user to start the simulator first.

2. Read both images:
   - `Read /tmp/sim_screen.png` — current simulator state
   - `Read /tmp/figma_screen.png` — Figma reference (downloaded in Step 2)

3. Compare side-by-side. Check **all** of these against Figma:
   - **Heights**: inputs, buttons, containers, navbars, images — match px values from Figma dimension table
   - **Widths**: same — full-width elements, fixed-width elements, image sizes
   - **Colors**: backgrounds, text, borders, buttons — must use correct semantic token
   - **Spacing/gaps**: padding, margin, gap between elements
   - **Typography**: font size, font weight, line height
   - **Border radius**: corners must match Figma radius values
   - **Layout/alignment**: flex direction, justify, align, ordering of elements
   - **Missing elements**: anything in Figma not in code → add it
   - **Extra elements in mobile only**: anything in code but NOT in Figma → **leave it as-is, do NOT remove it**. Mobile may have extra states (error alerts, loading spinners, countdown timers, validation messages) that are functional UI beyond the static Figma design.

4. List every diff found as a numbered checklist. If none, stop — done.

5. Fix all diffs in code → run `bun run lint` → go to step 1 of this iteration.

6. After 3 iterations: stop. Report remaining diffs to user.

**Do NOT report visual compare complete without actually running the simulator screenshot command and reading both images.**

---

## Step 9: Report

After completing:
- Files created/modified (with paths)
- Components extracted (with locations)
- Services wired (or asked about)
- Lint: pass/fail
- Visual iterations completed: 1–3
- Visual match: list any remaining diffs after 3 iterations, or "pixel-perfect" if none
