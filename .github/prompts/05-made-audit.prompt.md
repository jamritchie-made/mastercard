---
agent: agent
description: "Audit code for MADE Design System violations — hardcoded values, wrong imports, plain HTML substitutes, missing ThemeProvider, and broken icon paths."
tools:
  - made-mcp-server/*
  - execute
  - read
  - edit
  - search
---

Audit the current codebase (or the specified file/folder) for MADE Design System compliance violations. Read `.github/skills/made-compliance-checker/SKILL.md` and follow its full procedure.

**Scan for these violation categories:**

| Category | What to check | Fix |
|---|---|---|
| **Hardcoded colors** | `#hex`, `rgb()`, `hsl()`, named colors in CSS/style props | Replace with `var(--made-color-*)` |
| **Hardcoded spacing** | `px`, `rem`, `em` values for margin/padding/gap | Replace with `var(--made-size-space-*)` or `made-u-*` |
| **Wrong imports** | Subfolder imports like `/button/made-button.js` | Flatten to `@mc-made/web-components/made-button.js` |
| **Bundle imports** | `import '@mc-made/web-components'` (no specific file) | Import individual component files |
| **Plain HTML substitutes** | `<button>`, `<input>`, `<a>` where MADE component exists | Replace with `<made-button>`, `<made-input>`, `<made-link>` |
| **Missing ThemeProvider** | React app not wrapped in `<MadeThemeProvider>` | Add wrapper at app root |
| **Tailwind classes** | `flex`, `p-4`, `text-gray-*`, `bg-*` etc. | Replace with `made-u-*` utilities |
| **Broken icon paths** | Any `<made-icon src="...">` path not matching actual SVG files | Verify via `made-icon-finder` skill |
| **Wrong prop names** | e.g. `variant` on button (should be `kind`) | Check with `#tool:mcp_made-mcp-serv_component-api` |
| **Missing required props** | e.g. `<made-badge>` without `variant`, `<made-icon-button>` without `aria-label` | Check guidelines per component |

**Output format:**
- List all violations grouped by category
- For each violation: file path + line number, the offending code, and the correct MADE replacement
- Provide a summary count: X violations found across Y categories
- Offer to auto-fix violations after the audit report

---

**Which files or folders should be audited?** Specify a path, or leave blank to audit the entire `src/` directory.
