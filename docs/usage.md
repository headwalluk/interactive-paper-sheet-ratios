# Usage Guide

## Installation

1. Upload the `interactive-paper-sheet-ratios` folder to `/wp-content/plugins/`
2. Activate the plugin through the WordPress **Plugins** screen
3. Add the `[paper_sheet_ratios]` shortcode to any post or page

## Basic Usage

Add the shortcode with default settings (A4 datum, 5 levels A0-A4):

```
[paper_sheet_ratios]
```

The plugin renders an interactive canvas showing nested paper sizes. Users can:

- **Adjust dimensions** using the width/height number inputs or sliders
- **Swap width and height** with the swap button for quick orientation changes
- **Toggle units** between mm and inches
- **View calculations** including total area and aspect ratio (with inverted ratio)

## Controls

### Width / Height Inputs

Numeric inputs and synchronised range sliders for setting the datum (smallest) sheet dimensions in millimeters. Values are clamped between 150mm and 400mm with 0.01mm precision.

### Swap Button

Transposes the width and height values instantly, allowing quick switching between portrait and landscape orientations.

### Show Inches

Checkbox to toggle the area output between square millimeters and square inches.

## Canvas Visualisation

The canvas renders:

- **Outer rectangle (A0)** sized at 4x the datum dimensions on each side
- **Iterative subdivisions** splitting each container along its longest edge
- **Graduated fills** from dark blue (A1) to light blue (datum)
- **Graduated borders** from thick/dark (outer) to thin/light (inner)
- **Colour overlay** indicating deviation from the ideal A0 area (960,000 mm2) -- green when below, red when above
- **Background grid** with a checkered pattern that scales with the visualisation

## Output Display

- **Total Area** -- the outer sheet area in mm2 or in2
- **Aspect Ratio** -- width/height with configurable decimal precision, plus the inverted ratio (height/width) in italics
