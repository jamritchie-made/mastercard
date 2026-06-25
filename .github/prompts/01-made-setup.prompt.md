---
agent: agent
description: "Set up this project for the MADE Design System — installs packages, configures CSS, copies assets, and wraps the app with ThemeProvider."
tools:
  - made-mcp-server/*
  - execute
  - read
  - edit
  - search
---

Run the `made-project-setup` skill to fully configure this project for the MADE Design System.

The skill must:
1. Create or verify `.npmrc` with the Mastercard npm registry entry
2. Install all required MADE packages: `@mc-made/web-components`, `@mc-made/css`, `@mc-made/design-tokens`, `@mc-made/icons`, `@mc-made/fonts`
3. Configure `src/index.css` — import design tokens, fonts, and CSS utilities
4. Copy icon and font assets into `public/assets/` so they're served statically
5. Wrap the React app root with `<MadeThemeProvider theme="mastercard" color-mode="light">`

Read `.github/skills/made-project-setup/SKILL.md` and follow every step exactly. Report the result of each step and stop immediately if any step fails.
