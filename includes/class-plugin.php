<?php
/**
 * Core plugin class.
 *
 * Handles plugin initialization and hook registration.
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
	 * Paper sheet ratios shortcode instance.
	 *
	 * @since 1.0.0
	 *
	 * @var Shortcode_Paper_Sheet_Ratios
	 */
	private Shortcode_Paper_Sheet_Ratios $shortcode_paper_sheet_ratios;

	/**
	 * Initialize plugin and register hooks.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function run(): void {
		// Shortcodes.
		$this->shortcode_paper_sheet_ratios = new Shortcode_Paper_Sheet_Ratios();
		add_shortcode( SHORTCODE_TAG, array( $this->shortcode_paper_sheet_ratios, 'render' ) );

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
}
