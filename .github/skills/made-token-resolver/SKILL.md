---
name: made-token-resolver
description: "Resolve design intent to exact MADE design token CSS variables. Use when: choosing colors, spacing, typography, shadows, opacity, duration tokens. Translates descriptions like 'primary heading color' or 'medium spacing' to the correct --made-* CSS variable. Prevents hardcoded values and wrong token level (semantic vs primitive)."
---

# MADE Token Resolver

## When to Use

- Translating design intent into the correct `--made-*` CSS variable
- Choosing between semantic and primitive tokens
- Finding the right color, spacing, typography, shadow, opacity, or duration token
- Replacing hardcoded CSS values with the correct token
- Understanding which token category to use for a given property

## Procedure

### Step 1: Identify Token Category

Map the user's intent to a token category:

| Design Intent | Token Category | MCP Path |
|---------------|---------------|----------|
| Colors (text, background, border, status) | Color | `design-tokens/color.md` |
| Spacing (margins, padding, gaps) | Dimension | `design-tokens/dimension.md` |
| Sizing (width, height, border-radius) | Dimension | `design-tokens/dimension.md` |
| Font size, family, weight, line-height | Typography | `design-tokens/typography.md` |
| Box shadows, drop shadows | Shadow | `design-tokens/shadow.md` |
| Opacity / transparency | Opacity | `design-tokens/opacity.md` |
| Animation timing, transitions | Duration | `design-tokens/duration.md` |
| Z-index, stacking | Other | `design-tokens/other.md` |

### Step 2: Retrieve Tokens from MCP

Call `#tool:mcp_made-mcp-serv_design-tokens` with the appropriate file path from the table above.

If the category is unclear, first call `#tool:mcp_made-mcp-serv_design-tokens-overview` to see all categories and narrow down.

### Step 3: Select the Correct Token

**CRITICAL — Semantic vs Primitive tokens:**

MADE tokens have two levels:
- **Semantic tokens**: Purpose-based (e.g., `--made-color-text-primary`) — **ALWAYS prefer these**
- **Primitive tokens**: Value-based (e.g., `--made-color-neutral-900`) — only when no semantic token exists

**Decision flow:**

```
Does a semantic token exist for this use case?
├─ YES → Use the semantic token (adapts to light/dark mode automatically)
└─ NO  → Use the closest primitive token (document why no semantic fits)
```

**Why this matters:** Semantic tokens automatically adapt when switching between light/dark mode or Mastercard/Unify themes. Primitive tokens are fixed values that break theme switching.

### Step 4: Return the Token

For each resolved token, provide:

1. **Token name**: `--made-color-text-primary`
2. **Token level**: Semantic or Primitive
3. **Usage example**:
   ```css
   /* In CSS */
   color: var(--made-color-text-primary);
   ```
   ```html
   <!-- Inline (only if no utility class exists) -->
   <p style="color: var(--made-color-text-primary)">Text</p>
   ```
4. **Utility class alternative** (if one exists):
   - Check if a `made-u-*` class covers this case (e.g., spacing → `made-u-margin-md`)
   - If yes, recommend the utility class over inline token usage
5. **Theme behavior**: Note if the token changes between themes/modes

### Common Resolutions

| Intent | Token | Level |
|--------|-------|-------|
| Primary text color | `--made-color-text-primary` | Semantic |
| Secondary/subtle text | `--made-color-text-secondary` | Semantic |
| Page background | `--made-color-background-surface-default` | Semantic |
| Primary brand color | `--made-color-action-primary-default` | Semantic |
| Error/danger color | `--made-color-feedback-error-default` | Semantic |
| Success color | `--made-color-feedback-success-default` | Semantic |
| Warning color | `--made-color-feedback-warning-default` | Semantic |
| Border color | `--made-color-border-default` | Semantic |
| Small spacing | `--made-spacing-sm` | Semantic |
| Medium spacing | `--made-spacing-md` | Semantic |
| Large spacing | `--made-spacing-lg` | Semantic |
| Body font size | `--made-font-size-body` | Semantic |
| Heading font size | `--made-font-size-heading-*` | Semantic |
| Primary font family | `--made-font-family-primary` | Semantic |
| Standard shadow | `--made-shadow-md` | Semantic |

**Note:** These are common examples. Always verify the exact token name from the MCP tool output — token names may differ from these examples.

## Related Skills

| Situation | Skill | Location |
|-----------|-------|----------|
| Need utility class instead of inline token | `made-layout-builder` | `.github/skills/made-layout-builder/SKILL.md` |
| Auditing code for hardcoded values | `made-compliance-checker` | `.github/skills/made-compliance-checker/SKILL.md` |
| Migrating legacy CSS values to tokens | `made-migration-helper` | `.github/skills/made-migration-helper/SKILL.md` |
