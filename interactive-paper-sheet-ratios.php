<?php
/**
 * Plugin Name: Interactive Paper Sheet Ratios
 * Plugin URI: https://cubit-calculator.one/
 * Description: Interactive canvas visualization showing relationships between paper sizes (A4→A0) with real-time dimension adjustment and aspect ratio calculations.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Author: Paul Faulkner
 * Author URI: https://headwall-hosting.com/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: interactive-paper-sheet-ratios
 * Domain Path: /languages
 *
 * @package Interactive_Paper_Sheet_Ratios
 */

defined( 'ABSPATH' ) || die();

// Plugin version.
const IPSR_VERSION = '1.0.0';

// Plugin root file.
const IPSR_PLUGIN_FILE = __FILE__;

// Plugin root directory.
const IPSR_PLUGIN_DIR = __DIR__;

// Plugin root URL.
define( 'IPSR_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Load constants.
require_once __DIR__ . '/constants.php';
require_once __DIR__ . '/functions-private.php';

// Load classes.
require_once __DIR__ . '/includes/class-shortcode-paper-sheet-ratios.php';
require_once __DIR__ . '/includes/class-plugin.php';

/**
 * Initialize and run the plugin.
 *
 * Creates the global plugin instance and triggers initialization.
 *
 * @since 1.0.0
 *
 * @return void
 */
function ipsr_plugin_run(): void {
	global $interactive_paper_sheet_ratios_instance;
	$interactive_paper_sheet_ratios_instance = new Interactive_Paper_Sheet_Ratios\Plugin();
	$interactive_paper_sheet_ratios_instance->run();
}
ipsr_plugin_run();
