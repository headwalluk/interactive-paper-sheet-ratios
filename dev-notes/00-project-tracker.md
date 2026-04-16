# Project Tracker

**Version:** 0.1.0
**Last Updated:** 16 April 2026
**Current Phase:** Milestone 5 (Interactive Rendering) - Complete
**Overall Progress:** 60%

---

## Overview

Interactive Paper Sheet Ratios plugin provides a shortcode-based canvas visualization showing the relationship between paper sizes (A4→A0 by default). Users can input custom dimensions for the datum sheet (smallest size) and see how the nested sizes reconfigure in real-time with visual feedback via color overlay.

**Key Features:**
- Canvas-based visualization with auto-scaling
- Configurable number of size doublings (default: 5 levels)
- User inputs: width/height via numeric fields + sliders
- Portrait/landscape orientation toggle
- Real-time calculations: area, aspect ratio
- Color overlay: green/red based on deviation from ideal A0 area (960,000 mm²)
- Background grid that scales with object
- Unit display toggle (mm/inches) for outputs
- Fully responsive, mobile-friendly

---

## Active TODO Items

_Tasks are moved here from milestones when work begins. Mark complete with [x] when done._

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

- [x] Implement size doubling algorithm (each level = 2× area)
- [x] Calculate dimensions for each level (width/height)
- [x] Support configurable number of levels (default: 5)
- [x] Calculate total area (mm² and in²)
- [x] Calculate aspect ratio with configurable precision
- [x] Handle portrait vs landscape orientation
- [x] Default datum dimensions: 297mm × 210mm (A4)

### M4: User Input Controls (100%) ✓
**Goal:** Interactive controls for datum sheet dimensions

- [x] Create numeric inputs for width/height (mm only)
- [x] Create range sliders for width/height
- [x] Sync sliders with numeric inputs bidirectionally
- [x] Add portrait/landscape toggle checkbox
- [x] Implement input validation (min/max bounds)
- [x] Sanitize and escape all inputs
- [x] Handle orientation swap (transpose dimensions)

### M5: Interactive Rendering (100%) ✓
**Goal:** Draw paper sizes and update in real-time

- [x] Draw nested rectangles on canvas
- [x] Label each size level (A0, A1, A2, A3, A4)
- [x] Position labels clearly within each rectangle
- [x] Show dimensions on each sheet
- [x] Implement real-time redraw on input change
- [x] Debounce canvas updates for performance
- [x] Calculate and apply proper scaling factors
- [x] Draw borders/outlines for each size

### M6: Color Overlay System (100%) ✓
**Goal:** Visual feedback via red/green opacity layer

- [x] Create overlay canvas layer above background
- [x] Calculate deviation from ideal area (960,000 mm²)
- [x] Implement logarithmic opacity function
- [x] Red overlay when area > 960,000 mm²
- [x] Green overlay when area < 960,000 mm²
- [x] Fully transparent at exactly 960,000 mm²
- [x] Apply configurable opacity cap (default: 50%)
- [x] Smooth opacity transitions

### M7: Output Display (0%)
**Goal:** Show calculated values to user

- [ ] Display total area (outer/largest sheet)
- [ ] Display aspect ratio (configurable decimals, default: 8)
- [ ] Create unit toggle (mm² ⟷ in²)
- [ ] Format large numbers with separators (e.g., 960,000)
- [ ] Update outputs in real-time with inputs
- [ ] Display current orientation (portrait/landscape)
- [ ] Show dimensions of all levels (optional table)

### M8: Shortcode Configuration (0%)
**Goal:** Make plugin configurable via shortcode attributes

- [ ] `decimals` - Aspect ratio precision (default: 8)
- [ ] `levels` - Number of size doublings (default: 5)
- [ ] `opacity_cap` - Max overlay opacity % (default: 50)
- [ ] `grid_size` - Background grid size in mm (default: 100)
- [ ] `padding` - Canvas padding in mm (default: 20)
- [ ] `default_width` - Initial datum width (default: 297)
- [ ] `default_height` - Initial datum height (default: 210)
- [ ] `default_orientation` - portrait|landscape (default: portrait)
- [ ] Document all parameters in code comments
- [ ] Sanitize and validate all shortcode attributes

### M9: Polish & Optimization (0%)
**Goal:** Code quality, browser compatibility, performance

- [ ] Run PHPCS and fix all violations
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS/Android)
- [ ] Optimize canvas redraw performance
- [ ] Minify JavaScript and CSS
- [ ] Add loading states for heavy calculations
- [ ] Ensure accessibility (ARIA labels, keyboard nav)
- [ ] Add error handling and user feedback

### M10: Documentation & Deployment (0%)
**Goal:** Finalize for production use

- [ ] Write user documentation (how to use shortcode)
- [ ] Document all shortcode parameters
- [ ] Add inline code documentation
- [ ] Create example usage in README
- [ ] Test all edge cases
- [ ] Final PHPCS check
- [ ] Prepare for git commit
- [ ] Version bump and changelog entry

---

## Technical Debt

_Track quick fixes and future improvements here_

---

## Notes for Development

### Key Formulas

**Area Doubling:**
- Each level doubles the area: `Area(n) = Area(n-1) × 2`
- If datum (level 0) is W×H mm, level 1 is (W×√2)×H or W×(H×√2)

**Aspect Ratio:**
- `ratio = width / height`
- Display with configurable decimal precision (default: 8)

**Logarithmic Opacity:**
- `deviation = |current_area - 960000|`
- `opacity = min(opacity_cap, log(deviation + 1) / log(max_deviation) × opacity_cap)`

**Unit Conversion:**
- 1 inch = 25.4 mm
- Area: `mm² ÷ 645.16 = in²`

### Canvas Layers (bottom to top)
1. Background grid (grey, checkered pattern)
2. Color overlay (red/green, variable opacity)
3. Paper rectangles (nested sizes, white/light fills)
4. Labels and text

### JavaScript Structure
- ES6 class-based architecture
- Event delegation for performance
- Debounced canvas updates (e.g., 100ms)
- No inline JavaScript (external files only)

### WordPress Integration
- Single shortcode: `[paper_sheet_ratios]`
- Enqueue assets only when shortcode present
- Use `wp_localize_script()` for PHP→JS data
- Follow WordPress Coding Standards

### Default Values (constants.php)
- `DEF_DATUM_WIDTH = 297` (A4 width, mm)
- `DEF_DATUM_HEIGHT = 210` (A4 height, mm)
- `DEF_LEVELS = 5` (A4→A0)
- `DEF_ASPECT_DECIMALS = 8`
- `DEF_OPACITY_CAP = 50` (percent)
- `DEF_GRID_SIZE = 100` (mm)
- `DEF_CANVAS_PADDING = 20` (mm)
- `IDEAL_AREA_THRESHOLD = 960000` (mm², A0 area)

