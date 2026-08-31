---
name: figma-sync-theme
description: >
  Sync Figma variable collections (Primitives, Token, Typography) to apps/mobile/src/global.css.
  Generates CSS Custom Properties in Tailwind v4 format with @theme, @theme inline static,
  and @layer theme { :root { @variant light/dark {} } } sections.
  Trigger when user says "sync figma theme", "sync theme", "sync variables from figma",
  "/figma-sync-theme", or asks to update global.css from Figma.
---

# Figma Theme Sync

Sync Figma variable collections **Primitives**, **Token**, **Typography** → `apps/mobile/src/global.css`.

## Parse Args

From invocation args or user message:
- Figma file URL (required). If missing, ask user.
- `--watch` flag = re-sync every 30 seconds after first run.

Extract `fileKey` from URL: `https://figma.com/design/<fileKey>/...`

## Step 1: Load Figma MCP Tools

Load in one ToolSearch call:

```
ToolSearch query="select:mcp__plugin_figma_figma__use_figma"
```

Also load the `figma-use` skill before calling `use_figma`.

## Step 2: Fetch Variables via use_figma

Execute this JS (provide `fileKey`):

```javascript
const TARGET_COLLECTIONS = ['Primitives', 'Token', 'Typography'];

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const targetCols = collections.filter(c => TARGET_COLLECTIONS.includes(c.name));

if (targetCols.length === 0) {
  return { error: 'No matching collections found', available: collections.map(c => c.name) };
}

const allIds = targetCols.flatMap(c => c.variableIds);
const allVars = await Promise.all(allIds.map(id => figma.variables.getVariableByIdAsync(id)));

const idToName = {};
for (const v of allVars) {
  if (v) idToName[v.id] = v.name;
}

const result = {};
for (const col of targetCols) {
  const vars = col.variableIds
    .map(id => allVars.find(v => v && v.id === id))
    .filter(Boolean);

  result[col.name] = {
    modes: col.modes.map(m => ({ name: m.name, id: m.modeId })),
    variables: vars
      .filter(v => v.resolvedType === 'COLOR')
      .map(v => ({
        name: v.name,
        type: v.resolvedType,
        valuesByMode: Object.fromEntries(
          Object.entries(v.valuesByMode).map(([modeId, val]) => [
            modeId,
            val && val.type === 'VARIABLE_ALIAS'
              ? { alias: true, refName: idToName[val.id] || val.id }
              : val
          ])
        )
      }))
  };
}

return result;
```

## Step 3: Name → CSS Variable Conversion

Rule: replace all `/` with `-`, lowercase, prepend `--`.

Examples:
- `Color/Sand/50` → `--color-sand-50`
- `Button/Primary` → `--button-primary`
- `fg/Text/Info` → `--fg-text-info`

Build map `figmaName → cssVarName` for ALL variables across all collections.

## Step 4: Color Values → HEX

RGBA (Figma 0–1 range):

```
toHex(n) = Math.round(n * 255).toString(16).padStart(2, '0')
hex = '#' + toHex(r) + toHex(g) + toHex(b)
if (a < 0.999) hex += toHex(a)   // 8-char for transparency
```

VARIABLE_ALIAS → `var(--{cssVarName of referenced variable})`

## Step 5: Generate CSS Sections

### A. Primitives → inside `@theme {}`

Group COLOR variables by top-level path group, sorted.

```css
  /* figma-sync:primitives */
  --color-sand-50: #ffefd3;
  --color-sand-100: #f2e1c1;
  /* ... */
  /* figma-sync:primitives-end */
```

### B. Token → `@theme inline static {}`

For each Token variable, generate Tailwind color alias:
1. Token CSS var (e.g. `--fg-text-info`, `--button-primary`)
2. If starts with `--fg-`: strip `fg-` → `--color-text-info`
3. Otherwise: prepend `color-` → `--color-button-primary`

Always include at end (preserved):
- `--color-white: var(--color-neutral-0)`
- `--color-black: var(--color-neutral-1000)`

```css
@theme inline static {
  /* figma-sync:inline-static */
  --color-button-primary: var(--button-primary);
  --color-text-info: var(--fg-text-info);
  /* ... */
  --color-white: var(--color-neutral-0);
  --color-black: var(--color-neutral-1000);
  /* figma-sync:inline-static-end */
}
```

### C. Token → `@layer theme {}`

Find modes named `"Light"` and `"Dark"` in Token collection.

```css
@layer theme {
  :root {
    @variant light {
      /* figma-sync:tokens-light */
      --button-primary: var(--color-chestnut-700);
      --fg-text-info: var(--color-blue-600);
      /* ... */
      /* figma-sync:tokens-light-end */
    }

    @variant dark {
      /* figma-sync:tokens-dark */
      --button-primary: var(--color-chestnut-350);
      --fg-text-info: var(--color-blue-50);
      /* ... */
      /* figma-sync:tokens-dark-end */
    }
  }
}
```

## Two-File Theme System (CRITICAL)

This project has **two** theme files. Changes to one may require changes to the other:

| File | Purpose | Used via |
|---|---|---|
| `apps/mobile/src/global.css` | CSS custom properties → Tailwind classes | `className="bg-surface-default text-text-strong"` |
| `apps/mobile/src/hooks/use-theme-colors.ts` | TypeScript color constants for inline styles | `style={{ borderColor: colors.divider }}` |

**Rule:** After syncing `global.css`, check if any new/changed colors are also needed as inline-style values in RN components. If so, add them to `use-theme-colors.ts` (with both `LIGHT_COLORS` and `DARK_COLORS` entries).

**Especially for colors that cannot be expressed as a plain Tailwind class** (e.g. semi-transparent `rgba()` values like `rgba(206, 197, 185, 0.3)`): these MUST go in `use-theme-colors.ts` and be used via `colors.xxx` — they cannot be a Tailwind class.

```ts
// use-theme-colors.ts — add to ThemeColors type + both LIGHT_COLORS and DARK_COLORS
type ThemeColors = {
  // ...
  divider: string;  // ← new entry
};
const LIGHT_COLORS: ThemeColors = {
  // ...
  divider: "rgba(206, 197, 185, 0.3)",
};
const DARK_COLORS: ThemeColors = {
  // ...
  divider: "rgba(206, 197, 185, 0.3)",
};
```

---

## Step 6: Update global.css

Target: `apps/mobile/src/global.css`

**First run (no markers):** Insert generated content at correct positions:
- Primitives colors: append inside `@theme {}` after existing non-color vars, before closing `}`
- `@theme inline static {}`: replace entire block content
- `@layer theme {}`: replace entire block

**Subsequent runs (markers present):** Replace content between each `/* figma-sync:X */` and `/* figma-sync:X-end */` marker pair.

**Never touch:**
- `@import` / `@source` lines
- Font/text/radius/spacing/stroke variables in `@theme {}`

Report after write:
- Variables synced per collection
- Modes found in Token
- File path updated

## Step 7: Watch Mode

If `--watch`:
1. Report sync complete + "re-sync in 30s"
2. Call ScheduleWakeup: `delaySeconds=30`, `prompt="/figma-sync-theme <original-args>"`
