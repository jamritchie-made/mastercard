---
agent: agent
description: "Convert a Figma design to MADE Design System code — extracts design context via Figma MCP, maps elements to MADE components, and generates compliant React or HTML."
tools:
  - made-mcp-server/*
  - figma-mcp-server/*
  - execute
  - read
  - edit
  - search
  - todo
  - browser
argument-hint: "Paste a Figma frame URL"
---

Convert a Figma design to MADE Design System code using the `made-figma-to-code` agent workflow.

**Step 1 — Extract Figma context**
Use the Figma MCP Server to extract design metadata from the provided frame URL:
- Component names, layout structure, and visual hierarchy
- Colors, spacing values, and typography styles
- Export any image assets to `public/assets/images/`

**Step 2 — Map Figma → MADE components**  
For every Figma element, find its MADE equivalent. Always call `#tool:mcp_made-mcp-serv_components-list` first, then `#tool:mcp_made-mcp-serv_component-api` for each component you plan to use.

Common mappings:
| Figma element | MADE component |
|---|---|
| Button / CTA | `<made-button kind="primary\|secondary\|text">` |
| Input field | `<made-input>` |
| Chip / Tag | `<made-badge variant="text">` |
| Status dot / indicator | `<made-badge variant="status" type="online\|offline\|...">` |
| User profile image | `<made-avatar>` |
| Card / content surface | `<made-card>` + sub-components |
| Checkbox | `<made-checkbox>` |
| Toggle / switch | `<made-toggle>` |
| Radio buttons | `<made-radio-group>` + `<made-radio>` |
| Icon | `<made-icon src={...}>` (path via `made-icon-finder` skill) |
| Icon button | `<made-icon-button>` |
| Divider / separator | `<made-divider>` |
| Spinner / loading | `<made-loader>` |
| Hyperlink | `<made-link>` |

> **MADE wins on conflicts** — if the Figma design uses a custom pattern that conflicts with MADE's API, follow MADE.

**Step 3 — Resolve tokens**  
Map Figma color and spacing values to `var(--made-*)` tokens. Use the `made-token-resolver` skill. Never hardcode hex values.

**Step 4 — Build layout**  
Use the `made-layout-builder` skill for all flex/grid structures. Use `made-u-*` utility classes — no Tailwind.

**Step 5 — Validate icons**  
Every `<made-icon>` path must be verified using the `made-icon-finder` skill before output.

**Step 6 — Compliance check**  
Run the `made-compliance-checker` skill on all generated code before delivering it.

---

**Paste your Figma frame URL to begin.**
