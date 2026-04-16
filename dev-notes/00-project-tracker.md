# Project Tracker

**Version:** 1.0.0
**Last Updated:** 16 April 2026
**Current Phase:** Release 1.0.0
**Overall Progress:** 100%

---

## Overview

Interactive Paper Sheet Ratios plugin provides a shortcode-based canvas visualization showing the relationship between paper sizes (A4 through A0 by default). Users can input custom dimensions for the datum sheet (smallest size) and see how the nested sizes reconfigure in real-time with visual feedback via color overlay.

**Key Features:**
- Canvas-based visualization with iterative subdivision rendering
- Configurable number of size levels (default: 5 levels)
- User inputs: width/height via numeric fields + sliders with swap button
- Real-time calculations: area, aspect ratio (with inverted display)
- Color overlay: green/red based on deviation from ideal A0 area (960,000 mm2)
- Graduated border width and colour across subdivision hierarchy
- Background grid that scales with object
- Unit display toggle (mm/inches) for outputs
- Input clamping (150-400mm) with decimal precision (0.01mm step)
- Fully responsive, mobile-friendly

---

## Active TODO Items

_No active items -- v1.0.0 released._

---

## Milestones

### M1: Project Foundation (100%) ✓
**Goal:** Establish plugin structure, constants, and basic shortcode registration

- [x] Create main plugin file with header comments
- [x] Create `constants.php` with all magic values
- [x] Create `includes/class-plugin.php` for core plugin class
- [x] Register shortcode `[paper_sheet_ratios]`
- [x] Set up PHPCS configuration
- [x] Create basic `.instructions.md` for project-specific patterns
- [x] Create asset directories and placeholder files

### M2: Core Canvas System (100%) ✓
**Goal:** Canvas rendering foundation with auto-scaling and background grid

- [x] Create `assets/public/js/canvas-controller.js` (ES6 class)
- [x] Implement canvas initialization and sizing
- [x] Create auto-scale algorithm (fit object with padding)
- [x] Render background grid layer (configurable size)
- [x] Handle canvas resize/responsiveness
- [x] Scale grid with object dimensions
- [x] Add checkered pattern to background

### M3: Paper Sheet Calculations (100%) ✓
**Goal:** Mathematical engine for paper size relationships

- [x] Implement iterative subdivision (outer = datum x4 each side)
- [x] Calculate dimensions for each level via halving longest edge
- [x] Support configurable number of levels (default: 5)
- [x] Calculate total area (mm2 and in2)
- [x] Calculate aspect ratio with configurable precision
- [x] Default datum dimensions: 210mm x 297mm (A4 portrait)

### M4: User Input Controls (100%) ✓
**Goal:** Interactive controls for datum sheet dimensions

- [x] Create numeric inputs for width/height (mm)
- [x] Create range sliders for width/height
- [x] Sync sliders with numeric inputs bidirectionally
- [x] Add swap button for width/height transposition
- [x] Implement input clamping (150-400mm range)
- [x] Support decimal input (0.01mm step)
- [x] Sanitize and escape all inputs

### M5: Interactive Rendering (100%) ✓
**Goal:** Draw paper sizes and update in real-time

- [x] Draw outer rectangle (A0) centered on canvas
- [x] Iterative subdivision: split container along longest edge per iteration
- [x] Label each size level (A0, A1, A2, A3, A4)
- [x] Position labels clearly within each rectangle
- [x] Show dimensions on each sheet
- [x] Implement real-time redraw on input change
- [x] Debounce canvas updates for performance (100ms)
- [x] Calculate and apply proper scaling factors
- [x] Graduated border width (thick outer, thin inner)
- [x] Graduated border colour (dark outer, light inner)
- [x] Graduated blue fill (dark A1, light datum)

### M6: Color Overlay System (100%) ✓
**Goal:** Visual feedback via red/green opacity layer

- [x] Create overlay canvas layer above background
- [x] Calculate deviation from ideal area (960,000 mm2)
- [x] Implement logarithmic opacity function
- [x] Red overlay when area > 960,000 mm2
- [x] Green overlay when area < 960,000 mm2
- [x] Fully transparent at exactly 960,000 mm2
- [x] Apply configurable opacity cap (default: 50%)

### M7: Output Display (100%) ✓
**Goal:** Show calculated values to user

- [x] Display total area (outer/largest sheet)
- [x] Display aspect ratio (configurable decimals, default: 8)
- [x] Display inverted aspect ratio in italics
- [x] Create unit toggle (mm2 / in2)
- [x] Update outputs in real-time with inputs
- [x] Move outputs alongside inputs in controls section

### M8: Shortcode Configuration (100%) ✓
**Goal:** Make plugin configurable via shortcode attributes

- [x] `decimals` - Aspect ratio precision (default: 8)
- [x] `levels` - Number of size levels (default: 5)
- [x] `opacity_cap` - Max overlay opacity % (default: 50)
- [x] `grid_size` - Background grid size in mm (default: 100)
- [x] `padding` - Canvas padding in mm (default: 20)
- [x] `default_width` - Initial datum width (default: 210)
- [x] `default_height` - Initial datum height (default: 297)
- [x] Sanitize and validate all shortcode attributes

### M9: Polish & Optimization (100%) ✓
**Goal:** Code quality, responsive layout, input refinements

- [x] Run PHPCS and fix all violations
- [x] Responsive flex layout with mobile breakpoint
- [x] Input clamping with constants (DEF_DATUM_MIN, DEF_DATUM_MAX)
- [x] Decimal input support (DEF_DATUM_STEP)
- [x] Fix decimal input handling (avoid clobbering mid-edit text)
- [x] Remove landscape toggle (swap button replaces it)

### M10: Documentation & Deployment (100%) ✓
**Goal:** Finalize for production use

- [x] Create README.md for Git
- [x] Create readme.txt for WordPress
- [x] Create CHANGELOG.md
- [x] Version bump to 1.0.0
- [x] Update project tracker
- [x] Final PHPCS check

---

## Technical Debt

_No outstanding items._

---

## Notes for Development

### Key Formulas

**Outer Sheet Calculation:**
- Outer width = datum width x 4
- Outer height = datum height x 4
- Same aspect ratio as datum, 16x area

**Iterative Subdivision:**
- Each iteration splits the container along its longest edge
- One half is labelled A{i+1}, the other becomes the next container
- Subdivisions = levels - 1

**Aspect Ratio:**
- `ratio = width / height`
- Display with configurable decimal precision (default: 8)

**Logarithmic Opacity:**
- `deviation = |current_area - 960000|`
- `opacity = min(opacity_cap, log(deviation + 1) / log(max_deviation) x opacity_cap)`

**Unit Conversion:**
- 1 inch = 25.4 mm
- Area: mm2 / 645.16 = in2

### Canvas Layers (bottom to top)
1. Background grid (grey, checkered pattern)
2. Color overlay (red/green, variable opacity)
3. Paper rectangles (iterative subdivision, graduated blue fills)
4. Labels and dimension text

### JavaScript Structure
- ES6 class-based architecture (CanvasController)
- Event delegation for performance
- Debounced canvas updates (100ms)
- No inline JavaScript (external files only)
- Source-aware input sync (avoids clobbering decimal mid-edit)

### WordPress Integration
- Single shortcode: `[paper_sheet_ratios]`
- Enqueue assets only when shortcode present
- Use `wp_localize_script()` for PHP to JS data
- Follow WordPress Coding Standards
