---
name: made-basic-templates
description: "Basic UI templates and structural patterns for the MADE Design System. Use when: starting a new UI, generating a page shell, building a top navigation bar, creating a card grid, adding a footer, building a multi-step form wizard, or needing a starting point for any MADE layout. Framework-agnostic (Web Components + HTML). React notes included. Also provides page-level template recipes via the templates MCP tool."
---

# MADE Basic Templates

## When to Use

- Starting a new page or app from scratch
- Generating a standard page shell (header + main + footer)
- Building a top navigation bar with logo, nav items, and actions
- Creating a card grid layout
- Adding a footer with links
- **Building a multi-step form / wizard flow** (onboarding, checkout, signup, configuration)
- Needing a compliant starting point before customising

## Before Writing Code

Always retrieve component APIs via MCP tools before generating code:

1. `#tool:mcp_made-mcp-serv_components-list` — confirm component names
2. `#tool:mcp_made-mcp-serv_component-api` — get props/slots/events per component
3. `#tool:mcp_made-mcp-serv_placeholder-assets` — get overview of available asset categories
4. `#tool:mcp_made-mcp-serv_placeholder-assets-category` — get the full CDN URL table for a specific category
5. For layout, delegate to **`made-layout-builder`** skill
6. For icons, delegate to **`made-icon-finder`** skill
7. For token names, delegate to **`made-token-resolver`** skill

> **Placeholder Assets:** When generating UI that needs images (avatars, cards, lifestyle photos, flags, branding), never use `[IMAGE_URL]` placeholders. Instead:
> 1. Call `#tool:mcp_made-mcp-serv_placeholder-assets` to see all available categories and descriptions.
> 2. Call `#tool:mcp_made-mcp-serv_placeholder-assets-category` with `category="avatars"` (or `cards`, `imagery`, `flags`, `branding`) to get the full list of CDN URLs for that category.
> 3. Pick the most contextually appropriate asset URL from the returned table.

---

## Page-Level Template Recipes (via MCP Tool)

For full page-level patterns with structural skeletons, layout CSS, and component wiring, use the **templates MCP tool**:

`#tool:mcp_made-mcp-serv_templates` — pass a `templateName` to get a recipe.

> **ALWAYS fetch templates before writing page/layout code.** When a request matches a template pattern below, you MUST fetch the relevant template parts via this tool *before* generating the page structure — never improvise the skeleton from memory.

Templates use a **parts-based** model: a `layout-*` orchestrator file holds the page skeleton and composition order, and several self-contained **part** files (hero, nav, CTA, etc.) slot into it. Always start with the `index` template to see what is available, then fetch the layout, then the parts.

### Available Recipes

| Template Name | Type | Use When |
|---------------|------|----------|
| `index` | — | Get the full list of available templates and their parts (fetch this first) |
| `layout-marketing-landing-page` | parts: layout (skeleton) | Marketing homepage, product/launch landing page, or conversion-focused page — **fetch this first**, then its parts: `hero-marketing-landing-page`, `top-nav-marketing-landing-page`, `cta-marketing-landing-page`, `dark-section-marketing-landing-page`, `ai-section-marketing-landing-page`, `footer-marketing-landing-page` |
| `layout-documentation-portal` | parts: layout (skeleton) | Docs site, knowledge base, developer portal, help center, or content-heavy site with hierarchical navigation, search, and 3-column layout — **fetch this first**, then its parts: `top-bar-documentation-portal`, `secondary-nav-documentation-portal`, `sidebar-documentation-portal`, `doc-content-documentation-portal`, `on-this-page-documentation-portal`, `search-results-documentation-portal`, `footer-documentation-portal` |
| `layout-dashboard-with-sidebar` | parts: layout (skeleton) | Analytics dashboard, admin panel, metrics overview, CRM, or any app with persistent sidebar nav, KPI cards, quick actions, and a command bar — **fetch this first**, then its parts: `sidebar-dashboard-with-sidebar`, `top-bar-dashboard-with-sidebar`, `greeting-quick-actions-dashboard-with-sidebar`, `suggested-cards-dashboard-with-sidebar`, `search-bar-dashboard-with-sidebar` |
| `layout-money-transfer-flow` | parts: layout (skeleton) | Transactional multi-step flow with sidebar — money transfers, payment flows, booking checkouts, or any guided process with recipient selection, amount/currency conversion, and review — **fetch this first**, then its parts: `sidebar-money-transfer-flow`, `progress-bar-money-transfer-flow`, `select-recipient-money-transfer-flow`, `recipient-form-money-transfer-flow`, `amount-money-transfer-flow`, `review-money-transfer-flow` |
| `multi-step-form-wizard` | whole-file | Building any stepped/wizard flow: onboarding, checkout, signup, multi-part data entry, configuration |

### How to Use Recipes

1. **Match intent to template** — choose the recipe that most closely matches the user's request.
2. **Fetch the skeleton FIRST** — for a parts-based template, call `#tool:mcp_made-mcp-serv_templates` with the `layout-*` name. The layout lists every part to retrieve and the order to compose them. For a whole-file template, fetch the single file.
3. **Fetch the parts** — retrieve every part listed in the layout's *Parts to Retrieve* table (ideally all of them). You may also mix in parts from other templates if the user's needs call for it.
4. **Adapt freely** — the recipe is a starting point; modify structure, add/remove parts, change layout, swap components as needed.
5. **Apply specifics with skills** — use `made-icon-finder`, `made-layout-builder`, `made-token-resolver` for detailed implementation.

> **Important:** Recipes are inspiration, not rigid blueprints. Encourage creativity and innovation while maintaining MADE compliance.

---

## Template 1 — App Shell

The root wrapper for any MADE app. Always use `made-theme-provider` as the outermost element.

**Supported themes:** `mastercard` | `unify`  
**Supported color modes:** `light` | `dark`

```html
<!-- HTML / Web Components / Angular / Vue -->
<made-theme-provider theme="mastercard" color-mode="light">
  <div style="display:flex; flex-direction:column; min-height:100vh; background-color:var(--made-color-background-default);">
    <header><!-- Template 2: Top Navigation --></header>
    <main style="flex:1; padding:var(--made-size-space-10-x);"><!-- Page content --></main>
    <footer><!-- Template 4: Footer --></footer>
  </div>
</made-theme-provider>
```

```tsx
// React — ThemeProvider uses JSX prop (camelCase color-mode → colorMode not needed; use attribute as-is or check component-api)
import '@mc-made/web-components/made-theme-provider.js';

<made-theme-provider theme="mastercard" color-mode={colorMode}>
  ...
</made-theme-provider>
```

> **React note:** Import the web component JS file, then use the tag directly in JSX. Also wrap with `MadeThemeProvider` React component if using the React package — check `made-project-setup` skill.

---

## Template 2 — Top Navigation Bar

A horizontal nav with: logo area (left) · nav links (center) · action icons + avatar (right).

```html
<!-- Uses: made-icon-button, made-avatar -->
<nav class="made-u-display-flex made-u-align-items-center made-u-justify-content-space-between made-u-padding-vertical-4-x made-u-padding-horizontal-10-x"
     style="background-color:var(--made-color-background-surface-default); gap:var(--made-size-space-8-x);">

  <!-- Left: Logo + App Name -->
  <div class="made-u-display-flex made-u-align-items-center" style="gap:var(--made-size-space-2-x);">
    <!-- Insert logo/brand mark here -->
    <span style="font-family:var(--made-font-family-primary); font-size:var(--made-font-size-08); font-weight:var(--made-font-weight-medium); color:var(--made-color-text-primary);">
      App Name
    </span>
  </div>

  <!-- Center: Nav Links -->
  <div class="made-u-display-flex made-u-align-items-center" style="gap:var(--made-size-space-2-x);">
    <!-- Active item -->
    <span style="font-family:var(--made-font-family-primary); font-size:var(--made-font-size-body-large); font-weight:var(--made-font-weight-medium); color:var(--made-color-text-primary); background-color:var(--made-color-background-surface-secondary); padding:var(--made-size-space-2-x) var(--made-size-space-6-x); border-radius:var(--made-border-radius-full); cursor:pointer;">
      Home
    </span>
    <!-- Inactive item -->
    <span style="font-family:var(--made-font-family-primary); font-size:var(--made-font-size-body-large); font-weight:var(--made-font-weight-medium); color:var(--made-color-text-secondary); cursor:pointer;">
      Nav Item
    </span>
  </div>

  <!-- Right: Icon Buttons + Avatar -->
  <div class="made-u-display-flex made-u-align-items-center" style="gap:var(--made-size-space-2-x);">
    <made-icon-button variant="ghost" size="medium" icon-src="[ICON_PATH]" aria-label="[Label]"
      style="color:var(--made-color-icon-secondary);"></made-icon-button>
    <made-avatar image="[IMAGE_URL]" size="small" alt="User profile"></made-avatar>
  </div>
</nav>
```

> **Icons:** Use `made-icon-finder` skill to resolve every `[ICON_PATH]`.  
> **API:** Call `#tool:mcp_made-mcp-serv_component-api` with `icon-button` and `avatar` before using them.

---

## Template 3 — Card Grid

A responsive grid of `made-card` components.

```html
<!-- Uses: made-card, made-card-content -->
<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:var(--made-size-space-6-x);">

  <made-card>
    <made-card-content>
      <div class="made-u-padding-6-x">
        <p style="font-family:var(--made-font-family-primary); font-size:var(--made-font-size-body-large); font-weight:var(--made-font-weight-medium); color:var(--made-color-text-primary);">
          Card Title
        </p>
        <p style="font-family:var(--made-font-family-primary); font-size:var(--made-font-size-body-medium); color:var(--made-color-text-secondary); margin-top:var(--made-size-space-2-x);">
          Card body text goes here.
        </p>
        <made-button variant="primary" size="medium" style="margin-top:var(--made-size-space-4-x);">
          Action
        </made-button>
      </div>
    </made-card-content>
  </made-card>

</div>
```

> **API:** Call `#tool:mcp_made-mcp-serv_component-api` with `card`, `card-content`, and `button`.

---

## Template 4 — Footer

A simple footer with copyright text and links.

```html
<!-- Uses: made-link -->
<footer class="made-u-display-flex made-u-align-items-center made-u-justify-content-space-between"
        style="background-color:var(--made-color-background-surface-default); padding:var(--made-size-space-6-x) var(--made-size-space-10-x);">

  <div class="made-u-display-flex made-u-align-items-center" style="gap:var(--made-size-space-8-x);">
    <span style="font-family:var(--made-font-family-primary); font-size:var(--made-font-size-body-small); font-weight:var(--made-font-weight-medium); color:var(--made-color-text-secondary);">
      © 1994–2026 Mastercard
    </span>
    <made-link href="#" appearance="neutral" decoration="underline"
      style="font-size:var(--made-font-size-body-small); font-weight:var(--made-font-weight-medium);">
      Terms of Use
    </made-link>
    <made-link href="#" appearance="neutral" decoration="underline"
      style="font-size:var(--made-font-size-body-small); font-weight:var(--made-font-weight-medium);">
      Privacy Policy
    </made-link>
  </div>

</footer>
```

> **API:** Call `#tool:mcp_made-mcp-serv_component-api` with `link`.

---

## Key Conventions

### Import Pattern (flat, no bundles)

```js
// ✅ Correct
import '@mc-made/web-components/made-button.js';
import '@mc-made/web-components/made-card.js';
import '@mc-made/icons/system-icons/[category]/[style]/[name].svg';

// ❌ Wrong
import '@mc-made/web-components';           // bundle import
import '@mc-made/web-components/button/...'; // subfolder import
```

### Token Reference (quick lookup)

| Intent | Token |
|--------|-------|
| Page background | `var(--made-color-background-default)` |
| Surface (cards, nav, footer) | `var(--made-color-background-surface-default)` |
| Secondary surface (active nav, hover) | `var(--made-color-background-surface-secondary)` |
| Primary text | `var(--made-color-text-primary)` |
| Secondary text | `var(--made-color-text-secondary)` |
| Icon color | `var(--made-color-icon-secondary)` |
| Body large font size | `var(--made-font-size-body-large)` |
| Body small font size | `var(--made-font-size-body-small)` |
| Primary font family | `var(--made-font-family-primary)` |
| Medium font weight | `var(--made-font-weight-medium)` |
| Full border radius (pill) | `var(--made-border-radius-full)` |

> For any token not listed here, use the **`made-token-resolver`** skill.

### Framework Notes

| Framework | Notes |
|-----------|-------|
| **HTML** | Use web component tags directly. Load the JS via `<script type="module">` or bundler import. |
| **React** | Import `.js` file to register the custom element, then use the tag in JSX. Boolean props use attribute syntax. |
| **Angular** | Add `CUSTOM_ELEMENTS_SCHEMA` to the module. Import JS files in `main.ts` or the component. |
| **Vue** | Add `compilerOptions.isCustomElement` in `vite.config`. Import JS files in `main.ts`. |
