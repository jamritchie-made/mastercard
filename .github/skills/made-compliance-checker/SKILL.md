---
name: made-compliance-checker
description: "Scan code for MADE Design System violations: hardcoded colors, px values, plain HTML elements (<button>, <input>), wrong imports, missing ThemeProvider, incorrect prop names. Use when: reviewing code, auditing MADE compliance, fixing styling violations, checking design token usage, validating component APIs."
---

# MADE Compliance Checker

## When to Use

- Review existing code for MADE Design System violations
- Audit a file or project for hardcoded values that should use design tokens
- Validate that MADE components are used instead of plain HTML substitutes
- Check import patterns (flat structure, no bundle imports)
- Verify ThemeProvider is present in React apps
- Post-generation validation of AI-generated code

## Procedure

### Step 1: Identify Files to Scan

If the user specifies files, scan those. Otherwise, scan all `.jsx`, `.tsx`, `.html`, `.css` files in `src/`.

### Step 2: Retrieve MADE Reference Data

Call these MCP tools to get the authoritative reference:

| Tool | Purpose |
|------|---------|
| `#tool:mcp_made-mcp-serv_components-list` | Get the full list of available MADE components |
| `#tool:mcp_made-mcp-serv_design-tokens-overview` | Get token categories for mapping violations |
| `#tool:mcp_made-mcp-serv_css-utilities-overview` | Get utility classes for layout violation fixes |

### Step 3: Scan for Violations

Check each file against these violation categories:

#### Category 1: Plain HTML Elements (should be MADE components)

| Violation Pattern | Correct Replacement |
|-------------------|-------------------|
| `<button>` or `<button ...>` | `<made-button>` |
| `<input>` or `<input ...>` | `<made-input>` |
| `<select>` or `<select ...>` | Check if MADE equivalent exists |
| `<textarea>` | Check if MADE equivalent exists |
| `<a>` for navigation links | `<made-link>` |

#### Category 2: Hardcoded Colors (should use design tokens)

| Violation Pattern | Fix |
|-------------------|-----|
| `color: #...` or `color: rgb(...)` | → `var(--made-color-*)` |
| `background-color: #...` | → `var(--made-color-*)` |
| `border-color: #...` | → `var(--made-color-*)` |
| `style="color: ..."` inline | → Use token via CSS variable |

#### Category 3: Hardcoded Spacing/Sizing (should use tokens or utilities)

| Violation Pattern | Fix |
|-------------------|-----|
| `margin: Npx` | → `var(--made-spacing-*)` or utility class |
| `padding: Npx` | → `var(--made-spacing-*)` or utility class |
| `gap: Npx` | → `var(--made-spacing-*)` or utility class |
| `width: Npx` / `height: Npx` | → `var(--made-dimension-*)` if applicable |

#### Category 4: Hardcoded Typography (should use tokens)

| Violation Pattern | Fix |
|-------------------|-----|
| `font-size: Npx` | → `var(--made-font-size-*)` |
| `font-family: "Arial"` etc. | → `var(--made-font-family-*)` |
| `font-weight: N` | → `var(--made-font-weight-*)` |
| `line-height: N` | → `var(--made-line-height-*)` |

#### Category 5: Import Violations

| Violation Pattern | Fix |
|-------------------|-----|
| `import '@mc-made/web-components'` (bundle) | → Individual flat imports |
| `import '.../button/made-button.js'` (subfolder) | → `@mc-made/web-components/made-button.js` |

#### Category 6: Icon Path Violations

**CRITICAL — icons that silently fail to display.**

Validate every icon `name` and `icon-name` attribute against the filesystem:

```bash
# Extract all icon paths from source files and check each
grep -rohE '(icon-)?name="[a-z]+/[a-z]+/[a-z0-9-]+"' src/ | grep '/' | tr -d '"' | sed 's/^icon-name=//' | sed 's/^name=//' | sort -u | while read name; do
  [ ! -f "public/assets/icons/system-icons/${name}.svg" ] && echo "MISSING: $name"
done
```

Also check icon paths in JS object literals (single-quoted):

```bash
grep -rohE "'[a-z]+/[a-z]+/[a-z0-9-]+'" src/ | tr -d "'" | sort -u | while read name; do
  [ ! -f "public/assets/icons/system-icons/${name}.svg" ] && echo "MISSING: $name"
done
```

For each missing icon, use the `made-icon-finder` skill to find the correct path. Common misplacements:

| Assumed Category | Actual Category | Icons |
|-----------------|-----------------|-------|
| operations | **formatting** | pencil, pencil-square, bars-* |
| navigation | **formatting** | bars-3-*, hamburger menu |
| miscellaneous | **toggle** | heart, star, bookmark, bell |
| miscellaneous | **technology** | envelope, mail |
| miscellaneous | **controls** | cog, settings |

#### Category 7: Structural Violations

| Violation Pattern | Fix |
|-------------------|-----|
| No `<made-theme-provider>` in React entry | → Wrap app with ThemeProvider |
| Plain `<div>` for layout without utility classes | → Add `made-u-*` classes |
| `style="..."` with hardcoded values | → Tokens or utility classes |

### Step 4: Resolve Correct Replacements

For each violation found, call the appropriate MCP tool to get the exact fix:

- **Component violations**: Call `#tool:mcp_made-mcp-serv_component-api` for each component to get correct props
- **Color violations**: Call `#tool:mcp_made-mcp-serv_design-tokens` with `design-tokens/color.md`
- **Spacing violations**: Call `#tool:mcp_made-mcp-serv_design-tokens` with `design-tokens/dimension.md`
- **Typography violations**: Call `#tool:mcp_made-mcp-serv_design-tokens` with `design-tokens/typography.md`

### Step 5: Generate Report

Output a structured report:

```
## MADE Compliance Report — [filename]

### Summary
- Total violations: N
- Auto-fixable: N
- Manual review needed: N

### Violations Found

| # | Line | Category | Violation | Fix |
|---|------|----------|-----------|-----|
| 1 | 12   | Component | `<button>Click</button>` | `<made-button>Click</made-button>` |
| 2 | 25   | Color | `color: #333` | `var(--made-color-text-primary)` |
...
```

### Step 6: Apply Fixes (if user confirms)

Apply the recommended fixes to the file. For each fix:
1. Verify the replacement is correct by cross-referencing the MCP tool output
2. Apply the change
3. Re-scan to confirm no new violations were introduced

## Related Skills

Chain these skills when violations require specialized procedures:

| Violation Type | Delegate To | Skill Location |
|---------------|-------------|----------------|
| Missing/broken icon paths | `made-icon-finder` | `.github/skills/made-icon-finder/SKILL.md` |
| Hardcoded colors/spacing/typography | `made-token-resolver` | `.github/skills/made-token-resolver/SKILL.md` |
| Layout using custom CSS instead of utilities | `made-layout-builder` | `.github/skills/made-layout-builder/SKILL.md` |
| Project not set up for MADE | `made-project-setup` | `.github/skills/made-project-setup/SKILL.md` |
| Large-scale migration needed | `made-migration-helper` | `.github/skills/made-migration-helper/SKILL.md` |
