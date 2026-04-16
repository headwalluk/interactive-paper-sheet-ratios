=== Interactive Paper Sheet Ratios ===
Contributors: powerplugins
Tags: paper sizes, visualization, canvas, aspect ratio, A-series
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 8.0
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Interactive canvas visualization showing relationships between paper sizes with real-time dimension adjustment and aspect ratio calculations.

== Description ==

Interactive Paper Sheet Ratios provides a shortcode-based canvas visualization showing the relationship between paper sizes (A4 through A0 by default). Users can input custom dimensions for the datum sheet (smallest size) and see how the nested sizes reconfigure in real-time with visual feedback via color overlay.

**Features:**

* Canvas-based visualization with iterative subdivision rendering
* Configurable number of paper size levels (default: 5, A0-A4)
* Width/height inputs with synchronized sliders and swap button
* Real-time area and aspect ratio display (with inverted ratio)
* Color overlay: green when below ideal area, red when above
* Graduated border width and colour to show size hierarchy
* Unit toggle between mm and inches
* Responsive layout with mobile support
* No admin interface -- configuration entirely via shortcode attributes

== Installation ==

1. Upload the `interactive-paper-sheet-ratios` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Add the `[paper_sheet_ratios]` shortcode to any post or page.

== Usage ==

Basic usage with defaults (A4 datum, 5 levels):

    [paper_sheet_ratios]

Customized example:

    [paper_sheet_ratios levels="7" decimals="4" default_width="210" default_height="297"]

= Shortcode Attributes =

* `levels` - Number of paper size levels, default: 5 (A0-A4)
* `decimals` - Decimal precision for aspect ratio, default: 8
* `opacity_cap` - Maximum color overlay opacity (%), default: 50
* `grid_size` - Background grid size in mm, default: 100
* `padding` - Canvas padding in mm, default: 20
* `default_width` - Initial datum width in mm, default: 210
* `default_height` - Initial datum height in mm, default: 297

== Frequently Asked Questions ==

= How do I add more paper size levels? =

Use the `levels` attribute. For example, `[paper_sheet_ratios levels="7"]` renders A0 through A6 with 6 subdivisions.

= Can I change the default paper dimensions? =

Yes, use the `default_width` and `default_height` attributes to set the datum sheet dimensions in millimeters.

= What does the color overlay mean? =

The overlay indicates deviation from the ideal A0 paper area (960,000 mm2). Green means the total area is below ideal, red means above. The overlay is fully transparent when the area exactly matches.

== Changelog ==

= 1.0.0 =
* Initial public release
* Canvas visualization with iterative subdivision rendering
* Width/height inputs with synchronized sliders
* Swap button for quick width/height transposition
* Real-time area and aspect ratio display with inverted ratio
* Color overlay based on deviation from ideal A0 area
* Graduated border width and colour for size hierarchy
* Unit toggle (mm/inches)
* Responsive layout with mobile support
* Configurable via shortcode attributes: levels, decimals, opacity_cap, grid_size, padding, default_width, default_height
