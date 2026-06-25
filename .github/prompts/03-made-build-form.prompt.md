---
agent: agent
description: "Build a MADE-compliant form with inputs, checkboxes, radios, toggles, and submit button — fully validated and accessible."
tools:
  - made-mcp-server/*
  - execute
  - read
  - edit
  - search
---

Build a form using MADE Design System form components. Before writing any code, retrieve the API for every form component you'll use:

Call `#tool:mcp_made-mcp-serv_component-api` separately for each of:
- `input` — single-line text fields, with validation, helper text, and error states
- `checkbox` — multi-select binary controls
- `radio` and `radio-group` — single-select from a small set of options
- `toggle` — binary on/off with immediate effect (no form submission needed)
- `button` — submit and cancel actions (note: the prop is `kind`, not `variant`)

Also call:
- `#tool:mcp_made-mcp-serv_design-tokens` with category `spacing` — for consistent gap/padding values
- `#tool:mcp_made-mcp-serv_css-utilities` with category `flex` — for form layout classes

**Form structure requirements:**
- Use `<made-input>` for all text/email/password fields — never `<input>`
- Use `<made-checkbox>` for multi-selects and consent fields — never `<input type="checkbox">`
- Use `<made-radio-group>` wrapping `<made-radio>` items for single-select sets — never `<input type="radio">`
- Use `<made-toggle>` for settings and preferences that take immediate effect
- Use `<made-button kind="primary">` for submit, `<made-button kind="secondary">` for cancel/reset
- Apply `made-u-display-flex made-u-flex-column` for vertical stacking with consistent `made-u-margin-bottom-{n}-x` spacing
- All form fields must have proper `label`, `name`, and `aria-*` attributes

**Choosing the right control:**
| Use case | Component |
|---|---|
| Free text / email / password | `made-input` |
| Binary confirm (saved on submit) | `made-checkbox` |
| One choice from 2–5 options | `made-radio-group` + `made-radio` |
| Immediate on/off setting | `made-toggle` |

After generating the form, validate all icon paths (if any icons are used in input slots) using the `made-icon-finder` skill.

---

**Describe the form you want to build.** For example: "a user registration form with name, email, password, and a terms checkbox" or "a notification preferences panel with toggles".
