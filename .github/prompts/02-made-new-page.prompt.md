---
agent: agent
description: "Build a complete page with MADE Design System — app shell, top navigation, main content area, and footer. Adapts to any page type you describe."
tools:
  - made-mcp-server/*
  - execute
  - read
  - edit
  - search
  - todo
---

Build a complete page using MADE Design System components. Follow the three-layer workflow:

**Layer 0 — Setup check**  
Verify the project is already set up for MADE (packages installed, `index.css` configured, ThemeProvider in place). If not, delegate to the `made-project-setup` skill before proceeding.

**Layer 1 — Gather APIs**  
Before writing any code, call these MCP tools:
- `#tool:mcp_made-mcp-serv_components-list` — confirm canonical component names
- `#tool:mcp_made-mcp-serv_component-api` — get API for every component you plan to use (call once per component)
- `#tool:mcp_made-mcp-serv_css-utilities-overview` — available layout utility classes
- `#tool:mcp_made-mcp-serv_design-tokens-overview` — available token categories

**Layer 1.5 — Template inspiration (always, before any UI code)**  
Never improvise the page skeleton from memory — consult the template recipes first:
1. Fetch the index — call `#tool:mcp_made-mcp-serv_templates` with `templateName: "index"` to see every available template and its parts.
2. Decide how to use them (your call): follow one template as the backbone, **mix and match** parts from several templates, or take loose structural inspiration when no recipe is an exact fit.
3. Templates are **parts-based** — for a parts-based template, fetch the `layout-*` skeleton FIRST (it defines the page shell, page-level state, and composition order), then fetch each part you intend to use from its *Parts to Retrieve* table. For a whole-file template, fetch it directly.
4. Adapt freely — recipes are starting points; reshape, add/remove parts, and swap components to fit the request while staying MADE-compliant.

**Layer 2 — Generate code**  
Apply the template(s) you chose in Layer 1.5, then follow the made-basic-templates skill for base structural patterns, the made-layout-builder skill for any flex/grid layout, the made-icon-finder skill for every `<made-icon>` used, and the made-token-resolver skill for any `var(--made-*)` CSS variables.

**Coding rules:**
- Wrap everything in `<MadeThemeProvider theme="mastercard" color-mode="light">`
- Use MADE web components for every interactive and structural element — no plain HTML substitutes where a MADE component exists
- Use `made-u-*` utility classes for layout — no Tailwind, no custom CSS unless unavoidable
- All imports must be flat: `@mc-made/web-components/made-button.js` (never with subfolders)
- Validate all icon paths against the filesystem after generating code

After generating code, run the `made-compliance-checker` skill to verify there are no violations.

---

**What page do you want to build?** Describe the page type (e.g. "a login page", "a settings dashboard", "a product listing page") and any specific requirements.
