# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WordPress plugin that renders an interactive canvas visualization of nested paper sizes (A4 through A0 by default) via the `[paper_sheet_ratios]` shortcode. Users adjust datum sheet dimensions with sliders/inputs and see nested sizes reconfigure in real-time with a color overlay indicating deviation from ideal A0 area (960,000 mm²). No admin interface — configuration is entirely via shortcode attributes.

## Commands

```bash
phpcs              # Check WordPress coding standards (all PHP files)
phpcs includes/    # Check specific directory
phpcbf             # Auto-fix PHPCS violations
```

No build step, test suite, or package manager. PHP files are loaded directly by WordPress. CSS and JS are vanilla (no bundler/transpiler).

## Architecture

**PHP side:** Main plugin file (`interactive-paper-sheet-ratios.php`) bootstraps by requiring `constants.php`, `functions-private.php`, and `includes/class-plugin.php`. The `Plugin` class registers the shortcode, renders HTML controls/canvas/output, and conditionally enqueues assets only when the shortcode is present on the page. Config is passed to JS via `wp_localize_script()` as the global `ipsrConfig` object.

**JS side:** `assets/public/js/canvas-controller.js` contains a single `CanvasController` ES6 class inside an IIFE. It renders 4 canvas layers bottom-to-top: background grid, color overlay (logarithmic opacity, red/green), nested paper rectangles, and labels. Input changes trigger debounced redraws (100ms). The class manages all state, calculations, event binding, and rendering.

**Constants:** All magic numbers and strings live in `constants.php` under the `Interactive_Paper_Sheet_Ratios` namespace. Prefixes: `DEF_` for defaults, `OPT_` for wp_options keys, `ASSET_` for enqueue handles, `CSS_CLASS_` for HTML classes.

## Coding Standards

- **Namespace:** `Interactive_Paper_Sheet_Ratios`; prefix `ipsr` for CSS/JS/HTML IDs
- **PHPCS ruleset:** `phpcs.xml` enforces WordPress standards with short array syntax allowed
- **No `declare(strict_types=1)`** — WordPress convention
- **Single-Entry Single-Exit (SESE):** Functions should have one return statement at the end
- **No inline HTML in PHP:** Use `printf()`/`echo` with `sprintf()`, never mixed HTML+PHP templates
- **All template output must be escaped:** `esc_html()`, `esc_attr()`, `esc_url()`
- **JS uses class-based selectors** (`.ipsr-*`), not IDs, for querying (IDs only for unique elements like the canvas)
- **No inline JavaScript** — all JS in external files loaded via `wp_enqueue_script()`

## Git Conventions

Commit message format: `type: brief description` followed by optional bullet points. Types: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `test:`. Run `phpcs` before committing.

## Project Status

Version 1.0.0 released. All milestones (M1-M10) complete. Progress tracked in `dev-notes/00-project-tracker.md`.

## Key References

- **Project-specific patterns:** `.instructions.md` (shortcode usage, calculation formulas, canvas layer architecture, CSS class reference)
- **WordPress coding standards/patterns:** `.github/copilot-instructions.md` (portable guidelines used across all Power Plugins projects)
- **Detailed implementation patterns:** `dev-notes/patterns/` (admin tabs, caching, database, JS, settings API, templates, WooCommerce)
