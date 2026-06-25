---
name: made-layout-builder
description: "Generate responsive page layouts using MADE CSS utility classes and design tokens. Use when: building page layouts, creating grids, flexbox layouts, responsive designs, sidebar layouts, card grids, form layouts, centering content. No custom CSS needed — uses MADE utility classes for flex, grid, spacing, sizing, and responsive breakpoints."
---

# MADE Layout Builder

## When to Use

- Building page layouts (sidebar + main, header + content + footer, etc.)
- Creating responsive card grids
- Building form layouts with proper spacing
- Centering content vertically and horizontally
- Setting up flexbox or grid-based layouts
- Applying responsive breakpoints (mobile-first)
- Replacing custom CSS layout code with MADE utility classes

## Procedure

### Step 1: Understand the Layout Request

Classify the layout type:

| Layout Type | Key Utilities Needed |
|-------------|---------------------|
| Sidebar + Main content | Flex, sizing |
| Card grid | Grid or flex-wrap, gap |
| Stacked sections | Flex-column, gap |
| Centered content | Flex, justify-center, items-center |
| Form layout | Flex-column, gap, sizing |
| Header + Content + Footer | Flex-column, min-height |
| Navigation bar | Flex, justify-between, items-center |

### Step 2: Retrieve MADE Utility Classes

Call these MCP tools:

| Tool | Input | Purpose |
|------|-------|---------|
| `#tool:mcp_made-mcp-serv_css-utilities` | `css-utility-classes/flex.md` | Flexbox utilities |
| `#tool:mcp_made-mcp-serv_css-utilities` | `css-utility-classes/grid.md` | Grid utilities |
| `#tool:mcp_made-mcp-serv_css-utilities` | `css-utility-classes/spacing.md` | Margin, padding, gap |
| `#tool:mcp_made-mcp-serv_css-utilities` | `css-utility-classes/sizing.md` | Width, height, min/max |
| `#tool:mcp_made-mcp-serv_css-utilities` | `css-utility-classes/display.md` | Display, visibility |

Also retrieve spacing tokens for any custom inline values:

| Tool | Input | Purpose |
|------|-------|---------|
| `#tool:mcp_made-mcp-serv_design-tokens` | `design-tokens/dimension.md` | Spacing/sizing token values |

### Step 3: Build the Layout

Generate the layout using ONLY MADE utility classes and design tokens.

**Priority order:**
1. MADE utility classes (e.g., `made-u-flex`, `made-u-gap-md`) — **first choice**
2. Design tokens in inline styles (e.g., `var(--made-spacing-lg)`) — only if no utility class exists
3. Custom CSS — **last resort, must be justified**

### Step 4: Apply Responsive Breakpoints

MADE uses a mobile-first breakpoint system with prefixes:

| Prefix | Breakpoint | Min-width |
|--------|-----------|-----------|
| (none) | Default/mobile | 0px |
| `made-u-medium--` | Medium | 768px |
| `made-u-large--` | Large | 1024px |
| `made-u-x-large--` | X-Large | 1280px |
| `made-u-xx-large--` | XX-Large | 1440px |

**Pattern:** Apply mobile styles by default, then override at larger breakpoints.

```html
<!-- Stack on mobile, side-by-side on medium+ -->
<div class="made-u-flex made-u-flex-col made-u-medium--flex-row made-u-gap-md">
  <aside class="made-u-width-full made-u-medium--width-1/4">Sidebar</aside>
  <main class="made-u-width-full made-u-medium--width-3/4">Content</main>
</div>
```

### Step 5: Verify & Output

Before outputting the layout:
- Confirm all class names exist in the MCP tool output
- Ensure no hardcoded px/color/font values
- Verify responsive classes use correct prefix syntax
- Check that semantic HTML elements are used (`<main>`, `<aside>`, `<header>`, `<footer>`, `<nav>`, `<section>`)

Output the complete layout with:
1. The HTML/JSX code
2. A brief explanation of which utility classes are used and why
3. A note on responsive behavior

## Layout Templates

### Sidebar + Main

```html
<div class="made-u-flex made-u-flex-col made-u-medium--flex-row made-u-min-height-screen">
  <aside class="made-u-width-full made-u-medium--width-1/4 made-u-padding-md">
    <!-- Sidebar content -->
  </aside>
  <main class="made-u-width-full made-u-medium--width-3/4 made-u-padding-lg">
    <!-- Main content -->
  </main>
</div>
```

### Card Grid

```html
<div class="made-u-grid made-u-grid-cols-1 made-u-medium--grid-cols-2 made-u-large--grid-cols-3 made-u-gap-lg">
  <!-- Cards go here -->
</div>
```

### Centered Content

```html
<div class="made-u-flex made-u-justify-center made-u-items-center made-u-min-height-screen">
  <div class="made-u-width-full made-u-max-width-md made-u-padding-lg">
    <!-- Centered content -->
  </div>
</div>
```

**Note:** These are starter templates. Always verify the exact class names from the MCP tool output — utility class names may differ from these examples.

## Related Skills

| Situation | Skill | Location |
|-----------|-------|----------|
| Need token values for custom inline styles | `made-token-resolver` | `.github/skills/made-token-resolver/SKILL.md` |
| Layout includes icons | `made-icon-finder` | `.github/skills/made-icon-finder/SKILL.md` |
| Auditing layout for MADE compliance | `made-compliance-checker` | `.github/skills/made-compliance-checker/SKILL.md` |
