<?php
/**
 * Plugin constants.
 *
 * All magic strings, numbers, and default values used throughout the plugin.
 *
 * @package Interactive_Paper_Sheet_Ratios
 * @since 1.0.0
 */

namespace Interactive_Paper_Sheet_Ratios;

defined( 'ABSPATH' ) || die();

// ------------------------------------------------------------------------
// Shortcode
// ------------------------------------------------------------------------

/**
 * Shortcode tag name.
 *
 * @since 1.0.0
 */
const SHORTCODE_TAG = 'paper_sheet_ratios';

// ------------------------------------------------------------------------
// Default Values - Paper Dimensions
// ------------------------------------------------------------------------

/**
 * Default datum sheet width in millimeters (A4 portrait).
 *
 * @since 1.0.0
 */
const DEF_DATUM_WIDTH = 210;

/**
 * Default datum sheet height in millimeters (A4 portrait).
 *
 * @since 1.0.0
 */
const DEF_DATUM_HEIGHT = 297;

/**
 * Default number of size levels (A4 through A0 = 5 levels).
 *
 * @since 1.0.0
 */
const DEF_LEVELS = 5;

/**
 * Default decimal precision for aspect ratio display.
 *
 * @since 1.0.0
 */
const DEF_ASPECT_DECIMALS = 8;

/**
 * Default maximum opacity for color overlay (percentage).
 *
 * @since 1.0.0
 */
const DEF_OPACITY_CAP = 50;

/**
 * Default background grid size in millimeters.
 *
 * @since 1.0.0
 */
const DEF_GRID_SIZE = 100;

/**
 * Default canvas padding in millimeters.
 *
 * @since 1.0.0
 */
const DEF_CANVAS_PADDING = 20;

/**
 * Minimum allowed datum dimension in millimeters.
 *
 * @since 1.0.0
 */
const DEF_DATUM_MIN = 150;

/**
 * Maximum allowed datum dimension in millimeters.
 *
 * @since 1.0.0
 */
const DEF_DATUM_MAX = 400;

/**
 * Step increment for datum dimension inputs.
 *
 * @since 1.0.0
 */
const DEF_DATUM_STEP = 0.01;

// ------------------------------------------------------------------------
// Calculation Constants
// ------------------------------------------------------------------------

/**
 * Ideal A0 paper area in square millimeters.
 * Used as threshold for color overlay (960,000 mm² ≈ 1200mm × 800mm).
 *
 * @since 1.0.0
 */
const IDEAL_AREA_THRESHOLD = 960000;

/**
 * Square root of 2 for A-series paper ratio calculations.
 *
 * @since 1.0.0
 */
const SQRT_TWO = 1.41421356237;

/**
 * Millimeters per inch conversion factor.
 *
 * @since 1.0.0
 */
const MM_PER_INCH = 25.4;

/**
 * Square millimeters per square inch conversion factor.
 *
 * @since 1.0.0
 */
const SQ_MM_PER_SQ_INCH = 645.16;

// ------------------------------------------------------------------------
// Asset Handles
// ------------------------------------------------------------------------

/**
 * Handle for public JavaScript file.
 *
 * @since 1.0.0
 */
const ASSET_JS_PUBLIC = 'ipsr-public-js';

/**
 * Handle for public CSS file.
 *
 * @since 1.0.0
 */
const ASSET_CSS_PUBLIC = 'ipsr-public-css';

// ------------------------------------------------------------------------
// HTML/CSS Classes
// ------------------------------------------------------------------------

/**
 * Main wrapper class for shortcode output.
 *
 * @since 1.0.0
 */
const CSS_CLASS_WRAPPER = 'ipsr-wrapper';

/**
 * Canvas container class.
 *
 * @since 1.0.0
 */
const CSS_CLASS_CANVAS_CONTAINER = 'ipsr-canvas-container';

/**
 * Controls container class.
 *
 * @since 1.0.0
 */
const CSS_CLASS_CONTROLS = 'ipsr-controls';

/**
 * Output display class.
 *
 * @since 1.0.0
 */
const CSS_CLASS_OUTPUT = 'ipsr-output';
