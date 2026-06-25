---
name: made-icon-finder
description: "Find, verify, and validate MADE Design System icon paths by intent or name. Use when: searching for icons, looking up icon paths, verifying icon names, finding icons for buttons/navigation/status/actions, validating icon paths in existing code, fixing broken/missing icons. Prevents the common mistake of guessing icon paths. Also validates icon paths against the filesystem to catch non-existent SVGs."
---

# MADE Icon Finder

## When to Use

- Finding an icon by intent (e.g., "close button", "shopping cart", "user profile")
- Verifying the correct path for a known icon name
- Browsing available icons in a specific category
- **Validating icon paths in existing code** — checking that every icon `name` attribute resolves to a real SVG file
- **Fixing broken icons** — icons that don't display because the path is wrong
- Avoiding the #1 icon mistake: guessing paths like `@mc-made/icons/check.svg`

## Why This Exists

Guessing icon paths is one of the most common AI and developer mistakes with MADE. The correct path structure is:

```
system-icons/{category}/{style}/{name}.svg
```

For example: `system-icons/status/outline/check-outline.svg`

The `<made-icon>` component resolves icons as `{basePath}/assets/icons/system-icons/{name}.svg`. If the SVG file doesn't exist at that path, the icon **silently fails** (no error, just blank). This makes broken icons hard to detect without filesystem validation.

This skill ensures you always get a verified, filesystem-validated path.

## Procedure

### Step 1: Get Icon Categories

Call `#tool:mcp_made-mcp-serv_icons-overview` to retrieve all available icon categories.

MADE has two icon families:
- **System icons** (19 categories): arrows, buildings, chat, chevrons, commerce, controls, data, files, formatting, miscellaneous, navigation, operations, status, technology, time, toggle, travel, user
- **Brand icons** (5 categories): business-tech-transactions, custom, people-places, things, ui

### Step 2: Match Intent to Category

Map the user's intent to the most likely category:

| User Intent | Likely Category |
|-------------|----------------|
| Close, menu, hamburger, back | `navigation` |
| Check, error, warning, success, info | `status` |
| Add, plus, delete, remove, trash | `operations` |
| Edit, pencil, pen | `formatting` |
| Left, right, up, down arrows | `arrows` |
| Expand, collapse, dropdown | `chevrons` |
| Search, filter, sort, settings, cog | `controls` |
| Cart, payment, purchase, credit card, banknotes | `commerce` |
| Upload, download, document | `files` |
| User, profile, account, users | `user` |
| Bold, italic, list, bars, formatting | `formatting` |
| Calendar, clock, schedule | `time` |
| Phone, laptop, wifi, envelope | `technology` |
| Eye, show, hide, toggle, heart, star, bookmark, bell | `toggle` |
| Home, building, office | `buildings` |
| Message, chat, comment | `chat` |
| Chart, graph, analytics | `data` |
| Plane, car, hotel, globe | `travel` |
| Logout, sign out, exit, enter | `arrows` (rectangle variants) |
| Ellipsis, dots, more, menu | `navigation` |

### Step 3: Retrieve Icon List for Category

For system icons, read the icon list from the MADE MCP server. The icons are organized by category in the knowledge engine at `icons/system/{category}.md` or `icons/brand/{category}.md`.

### Step 4: Validate Against Filesystem

**CRITICAL — This is the step that prevents broken icons.**

Before returning any icon path, validate that the SVG file actually exists on disk:

```bash
# Check if a single icon exists
ls public/assets/icons/system-icons/{category}/{style}/{icon-name}.svg

# Bulk validate all icon names used in a file
grep -ohE '"[a-z]+/[a-z]+/[a-z0-9-]+"' src/{file}.js | tr -d '"' | sort -u | while read name; do
  [ ! -f "public/assets/icons/system-icons/${name}.svg" ] && echo "MISSING: $name"
done
```

**Also check icon names in JSX object literals (single-quoted strings):**

```bash
grep -oE "'[a-z]+/[a-z]+/[a-z0-9-]+'" src/{file}.js | tr -d "'" | sort -u | while read name; do
  [ ! -f "public/assets/icons/system-icons/${name}.svg" ] && echo "MISSING: $name"
done
```

If a path doesn't resolve to a real file, find the closest match:

```bash
# Find similar icons in the same category
ls public/assets/icons/system-icons/{category}/{style}/ | grep "{partial-name}"

# Search across all categories
find public/assets/icons/system-icons -name "*{keyword}*"
```

### Step 5: Return Verified Path & Usage Examples

For each matching icon, provide:

1. **Verified path**: The exact path, confirmed to exist on disk
2. **Filesystem check**: ✓ Exists at `public/assets/icons/system-icons/{path}.svg`
3. **Web Component usage**:
   ```html
   <made-icon name="{category}/{style}/{icon-name}"></made-icon>
   ```
4. **React usage**:
   ```jsx
   import '@mc-made/web-components/made-icon.js';
   import MadeIcon from '@mc-made/web-components/react/made-icon/index.js';

   <MadeIcon name="{category}/{style}/{icon-name}" />
   ```
5. **Direct SVG import** (if needed):
   ```js
   import icon from '@mc-made/icons/system-icons/{category}/{style}/{icon-name}.svg';
   ```

### Step 6: Verify Before Returning

Before returning any icon path:
- **Confirm the SVG file exists on disk** via `ls` or `find`
- Confirm it exists in the MCP tool output
- Never fabricate or guess a path
- If the requested icon doesn't exist, suggest the closest alternatives from the same category (use `ls` and `grep` to find them)
- If no match in any category, state clearly: "No matching icon found in MADE. Consider using a custom SVG."

## Bulk Validation Mode

When asked to validate all icons in a file or project:

1. Extract all icon `name` values from the codebase:
   ```bash
   grep -rohE '(icon-)?name="[a-z]+/[a-z]+/[a-z0-9-]+"' src/ | grep '/' | sort -u
   ```
2. Also extract icon names from JS object literals:
   ```bash
   grep -rohE "'[a-z]+/[a-z]+/[a-z0-9-]+'" src/ | grep '/' | sort -u
   ```
3. Check each against the filesystem
4. Report a table:
   ```
   | Icon Path | Exists | Fix |
   |-----------|--------|-----|
   | arrows/outline/arrow-right-outline | ✓ | — |
   | formatting/outline/bars-3-outline | ✗ | → bars-3-bottom-left-outline |
   ```

## Common Path Mistakes

| Wrong | Correct | Why |
|-------|---------|-----|
| `name="check"` | `name="status/outline/check-outline"` | Missing category/style prefix |
| `name="formatting/outline/bars-3-outline"` | `name="formatting/outline/bars-3-bottom-left-outline"` | Icon doesn't exist — bars-3 has directional variants |
| `name="operations/outline/pencil-square-outline"` | `name="formatting/outline/pencil-square-outline"` | Pencil icons are in `formatting`, not `operations` |
| `name="arrows/outline/arrow-left-start-on-rectangle-outline"` | `name="arrows/outline/arrow-left-on-rectangle-outline"` | No "start" in the actual file name |
| `@mc-made/icons/check.svg` | `@mc-made/icons/system-icons/status/outline/check-outline.svg` | Missing full path structure |

## Frequently Misplaced Icons

These icons are commonly assumed to be in the wrong category:

| Icon | Assumed Category | Actual Category |
|------|-----------------|-----------------|
| pencil / pencil-square | operations | **formatting** |
| bars-3 / hamburger menu | navigation | **formatting** |
| magnifying-glass (search) | navigation | **operations** |
| cog / settings | miscellaneous | **controls** |
| envelope / mail | miscellaneous | **technology** |
| heart / star / bookmark | miscellaneous | **toggle** |
| bell / notification | miscellaneous | **toggle** |

## Related Skills

These skills may be needed alongside icon finding:

| Situation | Skill | Location |
|-----------|-------|----------|
| Icon assets not in `public/assets/icons/` | `made-project-setup` | `.github/skills/made-project-setup/SKILL.md` (Step 5) |
| Full code audit including icon validation | `made-compliance-checker` | `.github/skills/made-compliance-checker/SKILL.md` (Category 6) |
