<?php
/**
 * Private internal functions.
 *
 * Functions in this file are namespaced and intended for internal plugin use only.
 *
 * @package Interactive_Paper_Sheet_Ratios
 * @since 1.0.0
 */

namespace Interactive_Paper_Sheet_Ratios;

defined( 'ABSPATH' ) || die();

/**
 * Get the global plugin instance.
 *
 * @since 1.0.0
 *
 * @return Plugin The plugin instance.
 */
function get_plugin(): Plugin {
	global $interactive_paper_sheet_ratios_instance;
	return $interactive_paper_sheet_ratios_instance;
}
