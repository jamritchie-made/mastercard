---
agent: agent
description: "Migrate existing HTML, CSS, Bootstrap, or Tailwind code to MADE Design System components and design tokens."
tools:
  - made-mcp-server/*
  - execute
  - read
  - edit
  - search
  - todo
---

Migrate the selected or provided code to the MADE Design System. Follow the `made-migration-helper` skill — read `.github/skills/made-migration-helper/SKILL.md` and execute every step.

**The migration must:**

1. **Identify violations** — scan for:
   - Plain HTML elements where a MADE component exists (`<button>`, `<input>`, `<a>`, `<img>` used as avatar, etc.)
   - Hardcoded colors (hex codes, `rgb()`, named colors) → replace with `var(--made-color-*)` tokens
   - Hardcoded spacing (`px`, `rem`, `em` values in CSS) → replace with `var(--made-size-space-*)` tokens or `made-u-padding-*`/`made-u-margin-*` utilities
   - Tailwind CSS classes (`flex`, `p-4`, `text-gray-500`, etc.) → replace with `made-u-*` utilities
   - Bootstrap classes → replace with `made-u-*` utilities or MADE components
   - Wrong import paths (with subfolders) → flatten to `@mc-made/web-components/[component].js`
   - Missing `<made-theme-provider>` wrapper

2. **Gather APIs before replacing** — for every MADE component you will introduce, call `#tool:mcp_made-mcp-serv_component-api` first. Never guess prop names.

3. **Replace systematically** — one element type at a time, not all at once

4. **Replace token values** — use `#tool:mcp_made-mcp-serv_design-tokens` to find the exact token for each color, spacing, and typography value. Use `made-token-resolver` skill when unsure.

5. **Validate icons** — if any icons are introduced or already present, verify every SVG path using the `made-icon-finder` skill

6. **Run compliance check** — after migration, apply the `made-compliance-checker` skill to confirm no violations remain

---

**Paste the code you want to migrate**, or point to the file/component that needs converting.
