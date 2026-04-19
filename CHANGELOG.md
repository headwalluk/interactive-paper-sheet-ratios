# Changelog

All notable changes to the Interactive Paper Sheet Ratios plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-04-19

### Added
- `normaliseParameters()` in the canvas controller clamps width/height to the input's min/max at render time, preventing huge mid-typed values from locking up the browser

### Changed
- Colour overlay opacity now uses a linear scale instead of logarithmic for a more gradual transition near the ideal area
- Ideal A0 area threshold raised from 960,000 mm² to 1,000,000 mm² (1 m²); previous value retained as a commented reference in `constants.php`
- Lower input debounce interval for smoother live rendering
- Background grid is now centred within the canvas

## [1.0.0] - 2026-04-16

### Added
- Canvas visualization with iterative subdivision rendering (A0 through A4 by default)
- Outer sheet calculated as datum dimensions x4, preserving aspect ratio
- Width and height numeric inputs with synchronized range sliders
- Swap button for quick width/height transposition
- Input clamping (150-400mm) with decimal precision (0.01mm step)
- Real-time total area display with mm/inches unit toggle
- Aspect ratio display with inverted ratio in italics
- Color overlay based on logarithmic deviation from ideal A0 area (960,000 mm2)
- Graduated border width and colour across subdivision hierarchy
- Graduated blue fill from darkest (A1) to lightest (datum)
- Background grid with checkered pattern, scaled to object
- Responsive flex layout with mobile breakpoint
- Shortcode attributes: levels, decimals, opacity_cap, grid_size, padding, default_width, default_height
- WordPress coding standards compliance via PHPCS
- Assets conditionally enqueued only when shortcode is present
- Configuration passed to JS via wp_localize_script()

## [0.1.0] - 2026-04-15

### Added
- Initial plugin scaffold and shortcode registration
- Core canvas system with auto-scaling
- Paper size calculation engine
- Basic user input controls
- Nested rectangle rendering with labels
- Color overlay system
