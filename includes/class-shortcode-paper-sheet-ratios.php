<?php
/**
 * Paper Sheet Ratios shortcode.
 *
 * Handles rendering, controls, output display, and asset enqueuing
 * for the [paper_sheet_ratios] shortcode.
 *
 * @package Interactive_Paper_Sheet_Ratios
 * @since 1.0.0
 */

namespace Interactive_Paper_Sheet_Ratios;

defined( 'ABSPATH' ) || die();

/**
 * Shortcode class for paper sheet ratios visualization.
 *
 * @since 1.0.0
 */
class Shortcode_Paper_Sheet_Ratios {

	/**
	 * Configuration array for JavaScript.
	 *
	 * @since 1.0.0
	 *
	 * @var array<string, mixed>
	 */
	private array $config = array();

	/**
	 * Whether assets have been enqueued.
	 *
	 * @since 1.0.0
	 *
	 * @var bool
	 */
	private bool $enqueued = false;

	/**
	 * Render shortcode output.
	 *
	 * @since 1.0.0
	 *
	 * @param array<string, mixed> $atts Shortcode attributes.
	 *
	 * @return string HTML output.
	 */
	public function render( array $atts ): string {
		// Parse attributes with defaults.
		$atts = shortcode_atts(
			array(
				'decimals'       => DEF_ASPECT_DECIMALS,
				'levels'         => DEF_LEVELS,
				'opacity_cap'    => DEF_OPACITY_CAP,
				'grid_size'      => DEF_GRID_SIZE,
				'padding'        => DEF_CANVAS_PADDING,
				'default_width'  => DEF_DATUM_WIDTH,
				'default_height' => DEF_DATUM_HEIGHT,
			),
			$atts,
			SHORTCODE_TAG
		);

		// Sanitize attributes.
		$this->config = array(
			'decimals'          => absint( $atts['decimals'] ),
			'levels'            => absint( $atts['levels'] ),
			'opacity_cap'       => absint( $atts['opacity_cap'] ),
			'grid_size'         => absint( $atts['grid_size'] ),
			'padding'           => absint( $atts['padding'] ),
			'default_width'     => absint( $atts['default_width'] ),
			'default_height'    => absint( $atts['default_height'] ),
			'ideal_area'        => IDEAL_AREA_THRESHOLD,
			'sqrt_two'          => SQRT_TWO,
			'mm_per_inch'       => MM_PER_INCH,
			'sq_mm_per_sq_inch' => SQ_MM_PER_SQ_INCH,
		);

		// Enqueue assets (will be added to footer).
		$this->enqueue_assets();

		// Build output.
		$output = sprintf( '<div class="%s" id="ipsr-main">', esc_attr( CSS_CLASS_WRAPPER ) );

		// Controls section (includes inputs and output displays).
		$output .= sprintf( '<div class="%s">', esc_attr( CSS_CLASS_CONTROLS ) );
		$output .= $this->render_controls();
		$output .= $this->render_output();
		$output .= '</div>';

		// Canvas section.
		$output .= sprintf( '<div class="%s">', esc_attr( CSS_CLASS_CANVAS_CONTAINER ) );
		$output .= '<canvas id="ipsr-canvas"></canvas>';
		$output .= '</div>';

		$output .= '</div>';

		return $output;
	}

	/**
	 * Render control inputs.
	 *
	 * @since 1.0.0
	 *
	 * @return string HTML output.
	 */
	private function render_controls(): string {
		$output = '';

		$output .= '<div class="ispr-column">';

		// Width controls.
		$output .= '<div class="ipsr-control-group">';
		$output .= sprintf( '<label for="ipsr-width">%s</label>', esc_html__( 'Width (mm)', 'interactive-paper-sheet-ratios' ) );
		$output .= sprintf( '<input type="number" id="ipsr-width" class="ipsr-width-input" value="%s" min="%s" max="%s" step="%s">', esc_attr( $this->config['default_width'] ), esc_attr( DEF_DATUM_MIN ), esc_attr( DEF_DATUM_MAX ), esc_attr( DEF_DATUM_STEP ) );
		$output .= sprintf( '<input type="range" id="ipsr-width-slider" class="ipsr-width-slider" value="%s" min="%s" max="%s" step="%s">', esc_attr( $this->config['default_width'] ), esc_attr( DEF_DATUM_MIN ), esc_attr( DEF_DATUM_MAX ), esc_attr( DEF_DATUM_STEP ) );
		$output .= '</div>';

		// Swap button.
		$output .= '<div class="ipsr-control-group ipsr-swap-group">';
		$output .= sprintf(
			'<button type="button" id="ipsr-swap" class="ipsr-swap-button" title="%s">&#8693; %s</button>',
			esc_attr__( 'Swap width and height', 'interactive-paper-sheet-ratios' ),
			esc_html__( 'Swap W/H', 'interactive-paper-sheet-ratios' )
		);
		$output .= '</div>';

		// Height controls.
		$output .= '<div class="ipsr-control-group">';
		$output .= sprintf( '<label for="ipsr-height">%s</label>', esc_html__( 'Height (mm)', 'interactive-paper-sheet-ratios' ) );
		$output .= sprintf( '<input type="number" id="ipsr-height" class="ipsr-height-input" value="%s" min="%s" max="%s" step="%s">', esc_attr( $this->config['default_height'] ), esc_attr( DEF_DATUM_MIN ), esc_attr( DEF_DATUM_MAX ), esc_attr( DEF_DATUM_STEP ) );
		$output .= sprintf( '<input type="range" id="ipsr-height-slider" class="ipsr-height-slider" value="%s" min="%s" max="%s" step="%s">', esc_attr( $this->config['default_height'] ), esc_attr( DEF_DATUM_MIN ), esc_attr( DEF_DATUM_MAX ), esc_attr( DEF_DATUM_STEP ) );
		$output .= '</div>';

		$output .= '</div>'; // .ispr-column
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

		$output .= '<div class="ispr-column">';

		$output .= '<div class="ipsr-output-group">';
		$output .= sprintf( '<strong>%s:</strong> <span id="ipsr-output-area">—</span>', esc_html__( 'Total Area', 'interactive-paper-sheet-ratios' ) );
		$output .= '</div>';

		$output .= '<div class="ipsr-output-group">';
		$output .= sprintf(
			'<strong>%s:</strong> <span id="ipsr-output-ratio">—</span> <em class="ipsr-ratio-inverted">(<span id="ipsr-output-ratio-inv">—</span>)</em>',
			esc_html__( 'Aspect Ratio', 'interactive-paper-sheet-ratios' )
		);
		$output .= '</div>';

		$output .= '<div class="ipsr-output-group">';
		$output .= sprintf( '<label><input type="checkbox" id="ipsr-unit-toggle" class="ipsr-unit-toggle"> %s</label>', esc_html__( 'Show inches', 'interactive-paper-sheet-ratios' ) );
		$output .= '</div>';

		$output .= '</div>'; // .ispr-column

		return $output;
	}

	/**
	 * Enqueue JavaScript and CSS assets.
	 *
	 * Called from render() to ensure assets are only loaded on pages
	 * where the shortcode is present.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	private function enqueue_assets(): void {
		if ( $this->enqueued ) {
			return;
		}
		$this->enqueued = true;

		// Enqueue CSS.
		wp_enqueue_style( ASSET_CSS_PUBLIC, IPSR_PLUGIN_URL . 'assets/public/css/public.css', array(), IPSR_VERSION, 'all' );

		// Enqueue JavaScript (in footer).
		wp_enqueue_script( ASSET_JS_PUBLIC, IPSR_PLUGIN_URL . 'assets/public/js/canvas-controller.js', array(), IPSR_VERSION, true );

		// Localize config data for JavaScript.
		wp_localize_script( ASSET_JS_PUBLIC, 'ipsrConfig', $this->config );
	}
}
