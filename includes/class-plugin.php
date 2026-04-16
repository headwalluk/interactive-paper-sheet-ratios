<?php
/**
 * Core plugin class.
 *
 * Handles plugin initialization, hook registration, and shortcode setup.
 *
 * @package Interactive_Paper_Sheet_Ratios
 * @since 1.0.0
 */

namespace Interactive_Paper_Sheet_Ratios;

defined( 'ABSPATH' ) || die();

/**
 * Main Plugin class.
 *
 * @since 1.0.0
 */
class Plugin {

	/**
	 * Whether shortcode is present on current page.
	 *
	 * @since 1.0.0
	 *
	 * @var bool
	 */
	private bool $shortcode_present = false;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		// Intentionally empty - setup happens in run().
	}

	/**
	 * Initialize plugin and register hooks.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function run(): void {
		// Register shortcode.
		add_shortcode( SHORTCODE_TAG, array( $this, 'render_shortcode' ) );

		// Enqueue assets only when shortcode is present.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// Load text domain.
		add_action( 'init', array( $this, 'load_textdomain' ) );
	}

	/**
	 * Load plugin text domain for translations.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function load_textdomain(): void {
		load_plugin_textdomain(
			'interactive-paper-sheet-ratios',
			false,
			dirname( plugin_basename( IPSR_PLUGIN_FILE ) ) . '/languages'
		);
	}

	/**
	 * Render shortcode output.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $atts Shortcode attributes.
	 *
	 * @return string HTML output.
	 */
	public function render_shortcode( array $atts ): string {
		$this->shortcode_present = true;

		// Parse attributes with defaults.
		$atts = shortcode_atts(
			array(
				'decimals'            => DEF_ASPECT_DECIMALS,
				'levels'              => DEF_LEVELS,
				'opacity_cap'         => DEF_OPACITY_CAP,
				'grid_size'           => DEF_GRID_SIZE,
				'padding'             => DEF_CANVAS_PADDING,
				'default_width'       => DEF_DATUM_WIDTH,
				'default_height'      => DEF_DATUM_HEIGHT,
				'default_orientation' => DEF_ORIENTATION,
			),
			$atts,
			SHORTCODE_TAG
		);

		// Sanitize attributes.
		$config = array(
			'decimals'            => absint( $atts['decimals'] ),
			'levels'              => absint( $atts['levels'] ),
			'opacity_cap'         => absint( $atts['opacity_cap'] ),
			'grid_size'           => absint( $atts['grid_size'] ),
			'padding'             => absint( $atts['padding'] ),
			'default_width'       => absint( $atts['default_width'] ),
			'default_height'      => absint( $atts['default_height'] ),
			'default_orientation' => sanitize_text_field( $atts['default_orientation'] ),
			'ideal_area'          => IDEAL_AREA_THRESHOLD,
			'sqrt_two'            => SQRT_TWO,
			'mm_per_inch'         => MM_PER_INCH,
			'sq_mm_per_sq_inch'   => SQ_MM_PER_SQ_INCH,
		);

		// Validate orientation.
		if ( ! in_array( $config['default_orientation'], array( 'portrait', 'landscape' ), true ) ) {
			$config['default_orientation'] = DEF_ORIENTATION;
		}

		// Store config for JavaScript.
		wp_localize_script( ASSET_JS_PUBLIC, 'ipsrConfig', $config );

		// Build output.
		$output = '';

		$output .= sprintf(
			'<div class="%s" id="ipsr-main">',
			esc_attr( CSS_CLASS_WRAPPER )
		);

		// Controls section.
		$output .= sprintf(
			'<div class="%s">',
			esc_attr( CSS_CLASS_CONTROLS )
		);
		$output .= $this->render_controls( $config );
		$output .= '</div>';

		// Canvas section.
		$output .= sprintf(
			'<div class="%s">',
			esc_attr( CSS_CLASS_CANVAS_CONTAINER )
		);
		$output .= '<canvas id="ipsr-canvas"></canvas>';
		$output .= '</div>';

		// Output section.
		$output .= sprintf(
			'<div class="%s">',
			esc_attr( CSS_CLASS_OUTPUT )
		);
		$output .= $this->render_output();
		$output .= '</div>';

		$output .= '</div>';

		return $output;
	}

	/**
	 * Render control inputs.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $config Configuration array.
	 *
	 * @return string HTML output.
	 */
	private function render_controls( array $config ): string {
		$output = '';

		// Orientation toggle.
		$output .= sprintf(
			'<div class="ipsr-control-group"><label><input type="checkbox" id="ipsr-orientation" class="ipsr-orientation-toggle" %s> %s</label></div>',
			checked( 'landscape', $config['default_orientation'], false ),
			esc_html__( 'Landscape orientation', 'interactive-paper-sheet-ratios' )
		);

		// Width controls.
		$output .= '<div class="ipsr-control-group">';
		$output .= sprintf(
			'<label for="ipsr-width">%s</label>',
			esc_html__( 'Width (mm)', 'interactive-paper-sheet-ratios' )
		);
		$output .= sprintf(
			'<input type="number" id="ipsr-width" class="ipsr-width-input" value="%d" min="1" max="10000" step="1">',
			absint( $config['default_width'] )
		);
		$output .= sprintf(
			'<input type="range" id="ipsr-width-slider" class="ipsr-width-slider" value="%d" min="1" max="10000" step="1">',
			absint( $config['default_width'] )
		);
		$output .= '</div>';

		// Height controls.
		$output .= '<div class="ipsr-control-group">';
		$output .= sprintf(
			'<label for="ipsr-height">%s</label>',
			esc_html__( 'Height (mm)', 'interactive-paper-sheet-ratios' )
		);
		$output .= sprintf(
			'<input type="number" id="ipsr-height" class="ipsr-height-input" value="%d" min="1" max="10000" step="1">',
			absint( $config['default_height'] )
		);
		$output .= sprintf(
			'<input type="range" id="ipsr-height-slider" class="ipsr-height-slider" value="%d" min="1" max="10000" step="1">',
			absint( $config['default_height'] )
		);
		$output .= '</div>';

		return $output;
	}

	/**
	 * Render output display area.
	 *
	 * @since 1.0.0
	 *
	 * @return string HTML output.
	 */
	private function render_output(): string {
		$output = '';

		$output .= '<div class="ipsr-output-group">';
		$output .= sprintf(
			'<strong>%s:</strong> <span id="ipsr-output-area">—</span>',
			esc_html__( 'Total Area', 'interactive-paper-sheet-ratios' )
		);
		$output .= '</div>';

		$output .= '<div class="ipsr-output-group">';
		$output .= sprintf(
			'<strong>%s:</strong> <span id="ipsr-output-ratio">—</span>',
			esc_html__( 'Aspect Ratio', 'interactive-paper-sheet-ratios' )
		);
		$output .= '</div>';

		$output .= '<div class="ipsr-output-group">';
		$output .= sprintf(
			'<label><input type="checkbox" id="ipsr-unit-toggle" class="ipsr-unit-toggle"> %s</label>',
			esc_html__( 'Show inches', 'interactive-paper-sheet-ratios' )
		);
		$output .= '</div>';

		return $output;
	}

	/**
	 * Enqueue JavaScript and CSS assets.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue_assets(): void {
		if ( ! $this->shortcode_present ) {
			return;
		}

		// Enqueue CSS.
		wp_enqueue_style(
			ASSET_CSS_PUBLIC,
			IPSR_PLUGIN_URL . 'assets/public/css/public.css',
			array(),
			IPSR_VERSION,
			'all'
		);

		// Enqueue JavaScript.
		wp_enqueue_script(
			ASSET_JS_PUBLIC,
			IPSR_PLUGIN_URL . 'assets/public/js/canvas-controller.js',
			array(),
			IPSR_VERSION,
			true
		);
	}
}
