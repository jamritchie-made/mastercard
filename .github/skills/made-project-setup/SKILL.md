---
name: made-project-setup
description: "Set up a project for the MADE Design System: create .npmrc, install @mc-made packages, configure index.css with design tokens/fonts/utilities, copy icon and font assets, wrap React apps with ThemeProvider. Use when: starting a new MADE project, bootstrapping MADE in an existing project, fixing MADE setup issues, verifying MADE installation."
---

# MADE Project Setup

## When to Use

- Starting a new project that will use the MADE Design System
- Adding MADE to an existing project
- Verifying that MADE is correctly installed and configured
- Fixing setup issues (missing packages, broken imports, missing assets)
- Re-running setup after package updates

## Procedure

This skill is **idempotent** — it checks what already exists before running each step. Safe to run multiple times.

### Step 1: Detect Project Context

1. Check if `package.json` exists in the project root
2. Check if this is a React project (look for `react` in dependencies)
3. Check if MADE packages are already installed (`npm list @mc-made/web-components`)
4. Check if `.npmrc` already exists

Report what was found before proceeding.

### Step 2: Create `.npmrc`

**Skip if:** `.npmrc` already exists with correct content.

Create `.npmrc` in the project root:

```
strict-ssl=false
NODE_TLS_REJECT_UNAUTHORIZED=0
@mc-made:registry=https://artifacts.forge.mastercard.com/artifactory/api/npm/npm-all
registry=https://registry.npmjs.org/
```

**Verify:** `cat .npmrc` — confirm all 4 lines present.

### Step 3: Install MADE Packages

**Skip if:** All packages already installed at correct versions.

> **Single source of truth for versions:** Do not hardcode `@mc-made/*` versions here. Fetch the canonical, up-to-date versions from the MADE setup guideline (`#tool:mcp_made-mcp-serv_setup`, i.e. `guidelines/overview-setup.md`) and pin each package to the version it lists.

```bash
npm install @mc-made/design-tokens \
      @mc-made/web-components \
      @mc-made/css \
      @mc-made/icons \
      @mc-made/fonts \
      geist
```

Pin each `@mc-made/*` package to the exact version from the setup guideline (e.g. `@mc-made/web-components@<version>`).

**Verify:** `npm list @mc-made/design-tokens @mc-made/web-components @mc-made/css @mc-made/icons @mc-made/fonts` — all 5 packages listed without errors.

### Step 4: Create `src/index.css`

**Skip if:** `src/index.css` already exists with MADE imports.

Create `src/index.css`:

```css
/* MADE Design System - Core Imports */
@import "@mc-made/css/made.css";
@import '@mc-made/fonts/mark-for-mc.css';
@import '@mc-made/design-tokens/themes/mastercard/light.css';

body {
  margin: 0;
  font-family: var(--made-font-family-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--made-color-background-surface-default);
  color: var(--made-color-text-primary);
}

code {
  font-family: var(--made-font-family-monospace);
}
```

**Verify:** `cat src/index.css` — confirm 3 `@import` statements present.

### Step 5: Copy Icon & Font Assets

**Skip if:** `public/assets/icons/system-icons/` and `public/assets/fonts/` already populated.

```bash
mkdir -p public/assets/icons public/assets/images public/assets/fonts
cp -r node_modules/@mc-made/icons/system-icons public/assets/icons/
cp -r node_modules/@mc-made/web-components/dist/assets/fonts/ public/assets/fonts/
```

**Verify:** `ls public/assets/icons/system-icons/ && ls public/assets/fonts/` — both directories contain files.

### Step 6: Setup ThemeProvider (React Only)

**Skip if:** Not a React project, or ThemeProvider already present.

If React is detected, check the entry file (`src/index.js`, `src/index.tsx`, `src/main.tsx`, or `src/main.jsx`) and ensure the app is wrapped with:

```jsx
import MadeThemeProvider from "@mc-made/web-components/react/made-theme-provider/index.js";

<MadeThemeProvider theme="mastercard" color-mode="light">
  <App />
</MadeThemeProvider>
```

### Step 7: Final Verification & Report

Run all verification commands and output a summary:

```
## MADE Project Setup — Complete

| Step | Status |
|------|--------|
| .npmrc | ✓ Created / ✓ Already existed |
| npm packages | ✓ Installed (5/5) |
| src/index.css | ✓ Created with 3 imports |
| Icon assets | ✓ Copied to public/assets/icons/ |
| Font assets | ✓ Copied to public/assets/fonts/ |
| ThemeProvider | ✓ Configured / ⊘ Not React |

Ready for MADE development.
```

### Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `npm ERR! 401` | Missing or wrong `.npmrc` | Re-run Step 2 |
| `npm ERR! ERESOLVE` | Version conflicts | Try `npm install --legacy-peer-deps` |
| Icons not found | Assets not copied | Re-run Step 5 |
| Components unstyled | Missing CSS imports | Check `src/index.css` has all 3 `@import` lines |
| Components unthemed | Missing ThemeProvider | Re-run Step 6 |

## Related Skills

After setup completes, these skills are typically needed next:

| Next Step | Skill | Location |
|-----------|-------|----------|
| Audit existing code for MADE compliance | `made-compliance-checker` | `.github/skills/made-compliance-checker/SKILL.md` |
| Migrate legacy HTML/CSS to MADE | `made-migration-helper` | `.github/skills/made-migration-helper/SKILL.md` |
| Verify icon assets are correct | `made-icon-finder` | `.github/skills/made-icon-finder/SKILL.md` (Bulk Validation Mode) |
