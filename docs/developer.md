# Developer Guide

## Architecture

### PHP

The main plugin file (`interactive-paper-sheet-ratios.php`) bootstraps by requiring:

- `constants.php` -- all magic numbers and strings under the `Interactive_Paper_Sheet_Ratios` namespace
- `functions-private.php` -- internal helper functions
- `includes/class-plugin.php` -- core `Plugin` class, registers the shortcode and loads the text domain
- `includes/class-shortcode-paper-sheet-ratios.php` -- `Shortcode_Paper_Sheet_Ratios` class, renders HTML and conditionally enqueues assets

Assets are only enqueued when the shortcode is present on the page. Configuration is passed to JavaScript via `wp_localize_script()` as the global `ipsrConfig` object.

### JavaScript

`assets/public/js/canvas-controller.js` contains a single `CanvasController` ES6 class inside an IIFE. It handles:

- Canvas initialisation, sizing, and DPR-aware rendering
- Event binding for inputs, sliders, swap button, and unit toggle
- Debounced rendering (100ms) on input changes
- Iterative subdivision algorithm
- Four canvas layers rendered bottom-to-top: background grid, colour overlay, paper rectangles, labels

### CSS

`assets/public/css/public.css` provides responsive layout styles. No build step or preprocessor -- vanilla CSS loaded via `wp_enqueue_style()`.

### Constants

All constants live in `constants.php` under the `Interactive_Paper_Sheet_Ratios` namespace:

| Prefix | Purpose |
|---|---|
| `DEF_` | Default values for shortcode attributes and input constraints |
| `ASSET_` | Enqueue handles for JS and CSS |
| `CSS_CLASS_` | HTML class names for shortcode output |

## Coding Standards

- **Namespace:** `Interactive_Paper_Sheet_Ratios`
- **CSS/JS prefix:** `ipsr-`
- **PHPCS ruleset:** `phpcs.xml` (WordPress standards, short array syntax allowed)
- **No `declare(strict_types=1)`** -- WordPress convention
- **All output escaped:** `esc_html()`, `esc_attr()`, `esc_url()`
- **No inline JavaScript** -- external files only via `wp_enqueue_script()`

```bash
phpcs              # Check standards
phpcbf             # Auto-fix violations
```

## Hooks

The plugin does not currently register custom hooks. The shortcode is registered via `add_shortcode()` during the `Plugin::run()` method.

To extend or modify behaviour, you can:

- Filter the shortcode output using WordPress's `do_shortcode` pipeline
- Dequeue/re-enqueue assets using the handles `ipsr-public-js` and `ipsr-public-css`
- Override styles by enqueueing your own CSS after the plugin's stylesheet

## File Structure

```
interactive-paper-sheet-ratios/
├── interactive-paper-sheet-ratios.php  # Main plugin file, constants, bootstrap
├── constants.php                        # All named constants
├── functions-private.php                # Internal helpers
├── phpcs.xml                            # PHPCS configuration
├── includes/
│   ├── class-plugin.php                # Core plugin class
│   └── class-shortcode-paper-sheet-ratios.php  # Shortcode rendering & assets
├── assets/
│   └── public/
│       ├── css/public.css              # Frontend styles
│       └── js/canvas-controller.js     # Canvas rendering & interactions
├── docs/                               # Public documentation
├── readme.txt                          # WordPress.org readme
├── CHANGELOG.md                        # Version history
└── LICENSE                             # GPLv2
```
