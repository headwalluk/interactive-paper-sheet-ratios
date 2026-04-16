/**
 * Canvas Controller for Interactive Paper Sheet Ratios.
 *
 * Handles all canvas rendering, calculations, and user interactions.
 *
 * @package Interactive_Paper_Sheet_Ratios
 * @since 1.0.0
 */

(function() {
	'use strict';

	/**
	 * CanvasController class.
	 *
	 * @class
	 */
	class CanvasController {
		/**
		 * Constructor.
		 *
		 * @param {Object} config - Configuration object from PHP.
		 */
		constructor(config) {
			this.config = config;
			this.canvas = document.getElementById('ipsr-canvas');
			this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

			if (!this.canvas || !this.ctx) {
				console.error('Canvas element not found');
				return;
			}

			// Initialize state.
			this.state = {
				width: config.default_width,
				height: config.default_height,
				isLandscape: config.default_orientation === 'landscape',
				showInches: false
			};

			// Debounce timer.
			this.renderTimer = null;

			this.init();
		}

		/**
		 * Initialize controller.
		 */
		init() {
			this.bindEvents();
			this.render();
		}

		/**
		 * Bind event listeners.
		 */
		bindEvents() {
			// Width input.
			const widthInput = document.getElementById('ipsr-width');
			const widthSlider = document.getElementById('ipsr-width-slider');

			if (widthInput) {
				widthInput.addEventListener('input', (e) => this.handleWidthChange(e.target.value));
			}

			if (widthSlider) {
				widthSlider.addEventListener('input', (e) => this.handleWidthChange(e.target.value));
			}

			// Height input.
			const heightInput = document.getElementById('ipsr-height');
			const heightSlider = document.getElementById('ipsr-height-slider');

			if (heightInput) {
				heightInput.addEventListener('input', (e) => this.handleHeightChange(e.target.value));
			}

			if (heightSlider) {
				heightSlider.addEventListener('input', (e) => this.handleHeightChange(e.target.value));
			}

			// Orientation toggle.
			const orientationToggle = document.getElementById('ipsr-orientation');
			if (orientationToggle) {
				orientationToggle.addEventListener('change', (e) => this.handleOrientationChange(e.target.checked));
			}

			// Unit toggle.
			const unitToggle = document.getElementById('ipsr-unit-toggle');
			if (unitToggle) {
				unitToggle.addEventListener('change', (e) => this.handleUnitChange(e.target.checked));
			}
		}

		/**
		 * Handle width change.
		 *
		 * @param {string} value - New width value.
		 */
		handleWidthChange(value) {
			const width = parseInt(value, 10);
			if (isNaN(width) || width <= 0) {
				return;
			}

			this.state.width = width;

			// Sync inputs.
			const widthInput = document.getElementById('ipsr-width');
			const widthSlider = document.getElementById('ipsr-width-slider');

			if (widthInput) {
				widthInput.value = width;
			}
			if (widthSlider) {
				widthSlider.value = width;
			}

			this.debouncedRender();
		}

		/**
		 * Handle height change.
		 *
		 * @param {string} value - New height value.
		 */
		handleHeightChange(value) {
			const height = parseInt(value, 10);
			if (isNaN(height) || height <= 0) {
				return;
			}

			this.state.height = height;

			// Sync inputs.
			const heightInput = document.getElementById('ipsr-height');
			const heightSlider = document.getElementById('ipsr-height-slider');

			if (heightInput) {
				heightInput.value = height;
			}
			if (heightSlider) {
				heightSlider.value = height;
			}

			this.debouncedRender();
		}

		/**
		 * Handle orientation change.
		 *
		 * @param {boolean} isLandscape - Whether landscape is selected.
		 */
		handleOrientationChange(isLandscape) {
			this.state.isLandscape = isLandscape;

			// Transpose dimensions.
			const temp = this.state.width;
			this.state.width = this.state.height;
			this.state.height = temp;

			// Update inputs.
			const widthInput = document.getElementById('ipsr-width');
			const widthSlider = document.getElementById('ipsr-width-slider');
			const heightInput = document.getElementById('ipsr-height');
			const heightSlider = document.getElementById('ipsr-height-slider');

			if (widthInput) {
				widthInput.value = this.state.width;
			}
			if (widthSlider) {
				widthSlider.value = this.state.width;
			}
			if (heightInput) {
				heightInput.value = this.state.height;
			}
			if (heightSlider) {
				heightSlider.value = this.state.height;
			}

			this.debouncedRender();
		}

		/**
		 * Handle unit toggle change.
		 *
		 * @param {boolean} showInches - Whether to show inches.
		 */
		handleUnitChange(showInches) {
			this.state.showInches = showInches;
			this.updateOutputs();
		}

		/**
		 * Debounced render (100ms delay).
		 */
		debouncedRender() {
			clearTimeout(this.renderTimer);
			this.renderTimer = setTimeout(() => this.render(), 100);
		}

		/**
		 * Main render method.
		 */
		render() {
			// TODO: Implement full canvas rendering in subsequent milestones.
			// For now, just update outputs.
			this.updateOutputs();
		}

		/**
		 * Update output displays.
		 */
		updateOutputs() {
			// Calculate total area (outer sheet after all doublings).
			const levels = this.config.levels;
			const datumArea = this.state.width * this.state.height;
			const totalArea = datumArea * Math.pow(2, levels - 1);

			// Calculate aspect ratio.
			const ratio = (this.state.width / this.state.height).toFixed(this.config.decimals);

			// Update area display.
			const areaElement = document.getElementById('ipsr-output-area');
			if (areaElement) {
				if (this.state.showInches) {
					const areaInches = (totalArea / this.config.sq_mm_per_sq_inch).toFixed(2);
					areaElement.textContent = `${areaInches.toLocaleString()} in²`;
				} else {
					areaElement.textContent = `${totalArea.toLocaleString()} mm²`;
				}
			}

			// Update ratio display.
			const ratioElement = document.getElementById('ipsr-output-ratio');
			if (ratioElement) {
				ratioElement.textContent = ratio;
			}
		}
	}

	// Initialize when DOM is ready.
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			if (typeof ipsrConfig !== 'undefined') {
				new CanvasController(ipsrConfig);
			}
		});
	} else {
		if (typeof ipsrConfig !== 'undefined') {
			new CanvasController(ipsrConfig);
		}
	}
})();
