---
name: made-migration-helper
description: "Convert existing HTML/CSS/React code to MADE Design System compliant code. Use when: migrating legacy code to MADE, converting plain HTML to MADE web components, replacing CSS with design tokens, converting Bootstrap/Tailwind to MADE utilities, adopting MADE in an existing codebase, finding and replacing deprecated MADE tokens."
---

# MADE Migration Helper

## When to Use

- Converting existing HTML/CSS code to use MADE web components
- Replacing hardcoded CSS with MADE design tokens
- Migrating from Bootstrap, Tailwind, or custom CSS to MADE utility classes
- Adopting MADE Design System in a project with existing UI code
- Refactoring a component from plain HTML to MADE
- Finding and replacing deprecated MADE design tokens with their current replacements

## Procedure

### Step 1: Analyze Existing Code

Read the code the user provides (or the file they point to). Identify:

1. **HTML elements** that have MADE component equivalents
2. **CSS properties** that should use design tokens
3. **Layout patterns** that should use utility classes
4. **Import patterns** that need updating
5. **Deprecated tokens** — any `--made-*` variables that are deprecated (see Step 2b)
6. **Framework context** — vanilla HTML, React, or other

Categorize each element:

| Element/Pattern | Category | Action |
|----------------|----------|--------|
| `<button>` | Component swap | → `<made-button>` |
| `color: #333` | Token replacement | → `var(--made-color-text-primary)` |
| `display: flex; gap: 16px` | Utility class | → `class="made-u-flex made-u-gap-md"` |
| Tailwind `bg-blue-500` | Token replacement | → `var(--made-color-*)` |
| Bootstrap `btn btn-primary` | Component swap | → `<made-button kind="primary">` |

### Step 2: Retrieve MADE References

Call MCP tools based on what's needed in the code:

| What's Found | MCP Tool to Call |
|--------------|-----------------|
| Any UI elements (buttons, inputs, etc.) | `#tool:mcp_made-mcp-serv_components-list` to check availability |
| Specific components to use | `#tool:mcp_made-mcp-serv_component-api` for EACH component |
| Colors, backgrounds, borders | `#tool:mcp_made-mcp-serv_design-tokens` with `design-tokens/color.md` |
| Spacing, sizing, margins, padding | `#tool:mcp_made-mcp-serv_design-tokens` with `design-tokens/dimension.md` |
| Font properties | `#tool:mcp_made-mcp-serv_design-tokens` with `design-tokens/typography.md` |
| Layout classes (flex, grid) | `#tool:mcp_made-mcp-serv_css-utilities` for flex, grid, spacing |
| Shadows | `#tool:mcp_made-mcp-serv_design-tokens` with `design-tokens/shadow.md` |

**CRITICAL:** Call `component-api` for EACH component you plan to use — never assume the API matches standard HTML.

### Step 2b: Check for Deprecated Tokens

**MANDATORY** — Read the deprecated tokens reference from the installed `@mc-made/design-tokens` package:

```
node_modules/@mc-made/design-tokens/docs/deprecated-tokens.md
```

This file is an HTML table with two columns: **Deprecated** (the old token name) and **Migration Notes** (what to use instead or why it was removed).

**Procedure:**

1. Read `node_modules/@mc-made/design-tokens/docs/deprecated-tokens.md` from the project
2. Scan the codebase for any `--made-*` variable that appears in the deprecated list
3. For each match, note the migration guidance from the table
4. Include deprecated tokens in the migration plan (Step 3)

**Common deprecated token patterns:**

| Pattern | Reason | Typical Migration |
|---------|--------|-------------------|
| `--made-color-accent-*` | Removed entirely | Use semantic color tokens via MCP |
| `--made-color-*-on-dark-*` | "on-dark" tokens removed | Use dark mode via ThemeProvider `color-mode="dark"` instead |
| `--made-color-feedback-*` (old names) | Renamed | Use `--made-color-feedback-*-default` via MCP |
| `--made-font-family-bold/light/medium` | Theme-specific | Split into `--made-font-family-primary` + `--made-font-weight-*` |
| `--made-connect-color-*` | Tier 2 MC Connect tokens removed | No replacement — remove usage |
| `--made-link-color-on-dark` | "on-dark" removed | Use ThemeProvider dark mode |

**If the file is not found:** The project may not have `@mc-made/design-tokens` installed. Flag this in the report and recommend running the `made-project-setup` skill first.

### Step 3: Create Migration Plan

Before making changes, output a migration plan:

```
## Migration Plan — [filename]

### Components to Replace
| Original | MADE Replacement | API Verified |
|----------|-----------------|--------------|
| `<button class="btn-primary">` | `<made-button kind="primary">` | ✓ via component-api |
| `<input type="text">` | `<made-input>` | ✓ via component-api |

### Tokens to Apply
| Original CSS | MADE Token |
|-------------|-----------|
| `color: #333` | `var(--made-color-text-primary)` |
| `margin: 16px` | `var(--made-spacing-md)` |

### Utilities to Apply
| Original CSS | MADE Utility Class |
|-------------|-------------------|
| `display: flex` | `made-u-flex` |
| `gap: 24px` | `made-u-gap-lg` |

### Deprecated Tokens Found
| Deprecated Token | Found In | Migration |
|-----------------|----------|-----------|
| `--made-font-family-bold` | `src/App.css:14` | → `--made-font-family-primary` + `--made-font-weight-bold` |
| `--made-color-feedback-success` | `src/Status.tsx:8` | → Use current token via MCP |

### Structural Changes
- [ ] Add ThemeProvider wrapper (React only)
- [ ] Add component imports (flat structure)
- [ ] Remove custom CSS that tokens/utilities replace
- [ ] Replace deprecated tokens with current equivalents
```

### Step 4: Apply Migration

Convert the code section by section:

1. **Component swaps** — Replace HTML elements with MADE components using the correct API from `component-api`
2. **Token replacements** — Replace all hardcoded CSS values with `--made-*` tokens
3. **Deprecated token replacements** — Replace deprecated `--made-*` tokens with their current equivalents per the migration notes
4. **Utility class replacements** — Replace layout CSS with MADE utility classes
5. **Import additions** — Add individual component imports (flat structure)
6. **Cleanup** — Remove CSS rules that are now handled by tokens/utilities

### Step 5: Verify Migrated Code

After conversion:

1. **Scan for remaining violations** — Any hardcoded values, plain HTML elements, or wrong imports left?
2. **Check for deprecated tokens** — Re-scan against `deprecated-tokens.md` to confirm none remain
3. **Check component APIs** — All props correct? No HTML assumptions carried over?
4. **Check imports** — Using flat structure? No bundle imports?
5. **Check ThemeProvider** — Present if React?

### Step 6: Output Migrated Code with Diff Summary

Provide:
1. The complete migrated code
2. A diff summary showing what changed and why:

```
## Migration Summary

### Changes Made
- Replaced 3 plain HTML elements with MADE components
- Replaced 8 hardcoded CSS values with design tokens
- Replaced 2 deprecated tokens with current equivalents
- Replaced 4 custom CSS rules with utility classes
- Added 3 component imports (flat structure)
- Removed 12 lines of custom CSS

### Before → After Examples
| Before | After | Why |
|--------|-------|-----|
| `<button class="btn">` | `<made-button kind="primary">` | MADE component available |
| `color: #1a1a1a` | `var(--made-color-text-primary)` | Theme-adaptive token |
| `style="display:flex; gap:16px"` | `class="made-u-flex made-u-gap-md"` | Utility class available |
| `var(--made-font-family-bold)` | `var(--made-font-family-primary)` + `font-weight: var(--made-font-weight-bold)` | Token deprecated |
```

## Framework-Specific Notes

### Bootstrap → MADE

| Bootstrap | MADE |
|-----------|------|
| `btn btn-primary` | `<made-button kind="primary">` |
| `form-control` | `<made-input>` |
| `card` | `<made-card>` |
| `d-flex` | `made-u-flex` |
| `gap-3` | `made-u-gap-md` |
| `text-primary` | `var(--made-color-text-primary)` |

### Tailwind → MADE

| Tailwind | MADE |
|----------|------|
| `bg-blue-500` | `var(--made-color-action-primary-default)` |
| `text-gray-900` | `var(--made-color-text-primary)` |
| `p-4` | `made-u-padding-md` |
| `flex gap-4` | `made-u-flex made-u-gap-md` |
| `rounded-lg` | `var(--made-border-radius-lg)` |

**Note:** These are common mappings. Always verify exact token/utility names from MCP tool output.

## Related Skills

Chain these skills during migration:

| Task | Delegate To | Skill Location |
|------|-------------|----------------|
| Resolve correct token values | `made-token-resolver` | `.github/skills/made-token-resolver/SKILL.md` |
| Find/validate icon paths | `made-icon-finder` | `.github/skills/made-icon-finder/SKILL.md` |
| Build layouts with utility classes | `made-layout-builder` | `.github/skills/made-layout-builder/SKILL.md` |
| Verify no setup steps are missing | `made-project-setup` | `.github/skills/made-project-setup/SKILL.md` |
| Final compliance audit | `made-compliance-checker` | `.github/skills/made-compliance-checker/SKILL.md` |
