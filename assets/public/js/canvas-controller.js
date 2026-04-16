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
				showInches: false
			};

			// Canvas dimensions (will be set on resize).
			this.canvasWidth = 0;
			this.canvasHeight = 0;

			// Scaling factor (pixels per mm).
			this.scale = 1;

			// Debounce timer.
			this.renderTimer = null;
			this.resizeTimer = null;

			this.init();
		}

		/**
		 * Initialize controller.
		 */
		init() {
			this.setupCanvas();
			this.bindEvents();
			this.render();
		}

		/**
		 * Setup canvas dimensions and properties.
		 */
		setupCanvas() {
			// Set canvas size to match container.
			this.resizeCanvas();

			// Handle window resize.
			window.addEventListener('resize', () => {
				clearTimeout(this.resizeTimer);
				this.resizeTimer = setTimeout(() => {
					this.resizeCanvas();
					this.render();
				}, 250);
			});
		}

		/**
		 * Resize canvas to match container dimensions.
		 */
		resizeCanvas() {
			const container = this.canvas.parentElement;
			const containerWidth = container.clientWidth;

			// Use 16:9 aspect ratio for canvas, or square for mobile.
			const isMobile = window.innerWidth < 768;
			const aspectRatio = isMobile ? 1 : 16 / 9;

			this.canvasWidth = containerWidth;
			this.canvasHeight = containerWidth / aspectRatio;

			// Set canvas resolution (use device pixel ratio for crisp rendering).
			const dpr = window.devicePixelRatio || 1;
			this.canvas.width = this.canvasWidth * dpr;
			this.canvas.height = this.canvasHeight * dpr;

			// Set display size.
			this.canvas.style.width = this.canvasWidth + 'px';
			this.canvas.style.height = this.canvasHeight + 'px';

			// Scale context to match device pixel ratio.
			this.ctx.scale(dpr, dpr);
		}

		/**
		 * Bind event listeners.
		 */
		bindEvents() {
			// Width input.
			const widthInput = document.getElementById('ipsr-width');
			const widthSlider = document.getElementById('ipsr-width-slider');

			if (widthInput) {
				widthInput.addEventListener('input', (e) => this.handleWidthChange(e.target.value, e.target));
			}

			if (widthSlider) {
				widthSlider.addEventListener('input', (e) => this.handleWidthChange(e.target.value, e.target));
			}

			// Height input.
			const heightInput = document.getElementById('ipsr-height');
			const heightSlider = document.getElementById('ipsr-height-slider');

			if (heightInput) {
				heightInput.addEventListener('input', (e) => this.handleHeightChange(e.target.value, e.target));
			}

			if (heightSlider) {
				heightSlider.addEventListener('input', (e) => this.handleHeightChange(e.target.value, e.target));
			}

			// Swap button.
			const swapButton = document.getElementById('ipsr-swap');
			if (swapButton) {
				swapButton.addEventListener('click', () => this.handleSwap());
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
		 * @param {string}  value  - New width value.
		 * @param {Element} source - The input element that triggered the change.
		 */
		handleWidthChange(value, source) {
			const width = parseFloat(value);
			if (isNaN(width) || width <= 0) {
				return;
			}

			this.state.width = width;

			// Sync the other input (not the source, to avoid clobbering mid-edit text).
			const widthInput = document.getElementById('ipsr-width');
			const widthSlider = document.getElementById('ipsr-width-slider');

			if (widthInput && widthInput !== source) {
				widthInput.value = width;
			}
			if (widthSlider && widthSlider !== source) {
				widthSlider.value = width;
			}

			this.debouncedRender();
		}

		/**
		 * Handle height change.
		 *
		 * @param {string}  value  - New height value.
		 * @param {Element} source - The input element that triggered the change.
		 */
		handleHeightChange(value, source) {
			const height = parseFloat(value);
			if (isNaN(height) || height <= 0) {
				return;
			}

			this.state.height = height;

			// Sync the other input (not the source, to avoid clobbering mid-edit text).
			const heightInput = document.getElementById('ipsr-height');
			const heightSlider = document.getElementById('ipsr-height-slider');

			if (heightInput && heightInput !== source) {
				heightInput.value = height;
			}
			if (heightSlider && heightSlider !== source) {
				heightSlider.value = height;
			}

			this.debouncedRender();
		}

		/**
		 * Handle swap button click: transpose width and height.
		 */
		handleSwap() {
			const temp = this.state.width;
			this.state.width = this.state.height;
			this.state.height = temp;

			// Sync all inputs.
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
		 * Calculate the outer sheet dimensions.
		 *
		 * The outer sheet preserves the datum's aspect ratio, scaled up by 4×
		 * on each side (16× area).
		 *
		 * @return {Object} {width, height} of the outer sheet in mm.
		 */
		calculateOuterSheet() {
			return {
				width: this.state.width * 4,
				height: this.state.height * 4
			};
		}

		/**
		 * Main render method.
		 */
		render() {
			// Clear canvas.
			this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

			// Calculate outer sheet from datum.
			const outerSheet = this.calculateOuterSheet();

			// Calculate scale to fit outer sheet with padding.
			this.calculateScale(outerSheet);

			// Render layers (bottom to top).
			this.renderBackground();
			this.renderGrid();
			this.renderColorOverlay(outerSheet);
			this.renderPaperSheets(outerSheet);

			// Update output displays.
			this.updateOutputs();
		}

		/**
		 * Calculate scale factor to fit outer sheet in canvas with padding.
		 *
		 * @param {Object} outerSheet - {width, height} of outer sheet in mm.
		 */
		calculateScale(outerSheet) {
			// Add padding (convert to mm).
			const padding = this.config.padding * 2; // Left + right, top + bottom.
			const totalWidth = outerSheet.width + padding;
			const totalHeight = outerSheet.height + padding;

			// Calculate scale to fit in canvas.
			const scaleX = this.canvasWidth / totalWidth;
			const scaleY = this.canvasHeight / totalHeight;

			// Use smaller scale to ensure it fits.
			this.scale = Math.min(scaleX, scaleY);
		}

		/**
		 * Render background fill.
		 */
		renderBackground() {
			// Solid grey background.
			this.ctx.fillStyle = '#e0e0e0';
			this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		}

		/**
		 * Render background grid with checkered pattern.
		 */
		renderGrid() {
			const gridSize = this.config.grid_size * this.scale;

			// Draw checkered pattern.
			this.ctx.fillStyle = '#d0d0d0';

			for (let x = 0; x < this.canvasWidth; x += gridSize) {
				for (let y = 0; y < this.canvasHeight; y += gridSize) {
					// Alternate pattern.
					if ((Math.floor(x / gridSize) + Math.floor(y / gridSize)) % 2 === 0) {
						this.ctx.fillRect(x, y, gridSize, gridSize);
					}
				}
			}

			// Draw grid lines.
			this.ctx.strokeStyle = '#c0c0c0';
			this.ctx.lineWidth = 0.5;

			// Vertical lines.
			for (let x = 0; x < this.canvasWidth; x += gridSize) {
				this.ctx.beginPath();
				this.ctx.moveTo(x, 0);
				this.ctx.lineTo(x, this.canvasHeight);
				this.ctx.stroke();
			}

			// Horizontal lines.
			for (let y = 0; y < this.canvasHeight; y += gridSize) {
				this.ctx.beginPath();
				this.ctx.moveTo(0, y);
				this.ctx.lineTo(this.canvasWidth, y);
				this.ctx.stroke();
			}
		}

		/**
		 * Render color overlay based on deviation from ideal area.
		 *
		 * @param {Object} outerSheet - {width, height} of outer sheet in mm.
		 */
		renderColorOverlay(outerSheet) {
			// Calculate total area (outer sheet).
			const totalArea = outerSheet.width * outerSheet.height;

			// Calculate deviation from ideal area.
			const idealArea = this.config.ideal_area;
			const deviation = Math.abs(totalArea - idealArea);

			// If exactly at ideal, no overlay.
			if (deviation < 1) {
				return;
			}

			// Calculate opacity using logarithmic scale.
			const maxDeviation = idealArea; // Maximum reasonable deviation.
			const normalized = Math.log(deviation + 1) / Math.log(maxDeviation + 1);
			const opacity = Math.min(this.config.opacity_cap / 100, normalized * (this.config.opacity_cap / 100));

			// Determine color (red if above, green if below).
			const color = totalArea > idealArea ? '255, 0, 0' : '0, 255, 0';

			// Render overlay.
			this.ctx.fillStyle = `rgba(${color}, ${opacity})`;
			this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		}

		/**
		 * Get fill color for a labelled subdivision region.
		 *
		 * Produces a graduated blue: darkest at A1, fading to lightest at
		 * the final subdivision.
		 *
		 * @param {number} labelIndex - Label index (1 = A1, 2 = A2, etc.).
		 * @return {string} CSS color string.
		 */
		getRegionColor(labelIndex) {
			const subdivisions = this.config.levels - 1;

			// t=0 → darkest (A1), t=1 → lightest (datum).
			const t = (labelIndex - 1) / (subdivisions - 1);
			const r = Math.round(42 + t * (240 - 42));
			const g = Math.round(113 + t * (245 - 113));
			const b = Math.round(186 + t * (250 - 186));

			return `rgb(${r}, ${g}, ${b})`;
		}

		/**
		 * Get graduated border style for a subdivision depth.
		 *
		 * Outer borders (depth 0) are thickest and darkest; inner borders
		 * are thinnest and lightest.
		 *
		 * @param {number} depth - Subdivision depth (0 = outer/A0, increasing inward).
		 * @return {Object} Object with lineWidth and strokeStyle properties.
		 */
		getBorderStyle(depth) {
			const maxDepth = this.config.levels - 1;
			const t = depth / maxDepth;

			// Line width: 4px at outer, 0.5px at innermost.
			const lineWidth = 4 - t * 3.5;

			// Colour: dark (#1a1a1a) at outer, light (#aaaaaa) at innermost.
			const channel = Math.round(26 + t * 144);
			const strokeStyle = `rgb(${channel}, ${channel}, ${channel})`;

			return { lineWidth, strokeStyle };
		}

		/**
		 * Render paper sheets by iterative subdivision.
		 *
		 * Starts with the A0 outer rectangle and iteratively splits the
		 * container in half along its longest edge. One half is labelled
		 * as A{i+1}; the other (empty) half becomes the container for the
		 * next iteration. Runs levels-1 iterations total.
		 *
		 * @param {Object} outerSheet - {width, height} of outer sheet in mm.
		 */
		renderPaperSheets(outerSheet) {
			const outerWidthPx = outerSheet.width * this.scale;
			const outerHeightPx = outerSheet.height * this.scale;
			const startX = (this.canvasWidth - outerWidthPx) / 2;
			const startY = (this.canvasHeight - outerHeightPx) / 2;
			const subdivisions = this.config.levels - 1;

			// Fill entire outer sheet with base colour (A0).
			this.ctx.fillStyle = '#2a71ba';
			this.ctx.fillRect(startX, startY, outerWidthPx, outerHeightPx);

			// Draw outer border (A0).
			const outerBorder = this.getBorderStyle(0);
			this.ctx.strokeStyle = outerBorder.strokeStyle;
			this.ctx.lineWidth = outerBorder.lineWidth;
			this.ctx.strokeRect(startX, startY, outerWidthPx, outerHeightPx);

			// Iterative subdivision: container starts as the full outer sheet.
			let rx = startX;
			let ry = startY;
			let rw = outerWidthPx;
			let rh = outerHeightPx;
			let rwMm = outerSheet.width;
			let rhMm = outerSheet.height;

			for (let i = 0; i < subdivisions; i++) {
				const label = i + 1;
				const border = this.getBorderStyle(label);

				if (rw >= rh) {
					// Vertical split along width.
					const halfW = rw / 2;
					const halfWMm = rwMm / 2;

					// Fill labelled piece (left half).
					this.ctx.fillStyle = this.getRegionColor(label);
					this.ctx.fillRect(rx, ry, halfW, rh);

					// Draw dividing line.
					this.ctx.strokeStyle = border.strokeStyle;
					this.ctx.lineWidth = border.lineWidth;
					this.ctx.beginPath();
					this.ctx.moveTo(rx + halfW, ry);
					this.ctx.lineTo(rx + halfW, ry + rh);
					this.ctx.stroke();

					// Label the piece.
					this.renderLabel(label, rx, ry, halfW, rh, halfWMm, rhMm);

					// Empty half (right) becomes next container.
					rx = rx + halfW;
					rw = halfW;
					rwMm = halfWMm;
				} else {
					// Horizontal split along height.
					const halfH = rh / 2;
					const halfHMm = rhMm / 2;

					// Fill labelled piece (top half).
					this.ctx.fillStyle = this.getRegionColor(label);
					this.ctx.fillRect(rx, ry, rw, halfH);

					// Draw dividing line.
					this.ctx.strokeStyle = border.strokeStyle;
					this.ctx.lineWidth = border.lineWidth;
					this.ctx.beginPath();
					this.ctx.moveTo(rx, ry + halfH);
					this.ctx.lineTo(rx + rw, ry + halfH);
					this.ctx.stroke();

					// Label the piece.
					this.renderLabel(label, rx, ry, rw, halfH, rwMm, halfHMm);

					// Empty half (bottom) becomes next container.
					ry = ry + halfH;
					rh = halfH;
					rhMm = halfHMm;
				}
			}

			// Label A0 at the center of the full outer rectangle.
			this.renderLabel(0, startX, startY, outerWidthPx, outerHeightPx, outerSheet.width, outerSheet.height);
		}

		/**
		 * Render label for a paper sheet region.
		 *
		 * Labels are centered within the region with dimensions shown below.
		 *
		 * @param {number} labelIndex - Label index (0 = A0, 1 = A1, etc.).
		 * @param {number} x - X position in pixels.
		 * @param {number} y - Y position in pixels.
		 * @param {number} width - Region width in pixels.
		 * @param {number} height - Region height in pixels.
		 * @param {number} widthMm - Region width in mm.
		 * @param {number} heightMm - Region height in mm.
		 */
		renderLabel(labelIndex, x, y, width, height, widthMm, heightMm) {
			const label = `A${labelIndex}`;
			const centerX = x + width / 2;
			const centerY = y + height / 2;

			// Font size based on region size.
			const fontSize = Math.max(10, Math.min(48, Math.min(width, height) / 4));
			this.ctx.font = `bold ${fontSize}px sans-serif`;
			this.ctx.fillStyle = '#1a1a1a';
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'bottom';

			// Label slightly above center.
			this.ctx.fillText(label, centerX, centerY);

			// Dimensions text below label.
			const dimFontSize = Math.max(8, fontSize * 0.4);
			this.ctx.font = `${dimFontSize}px sans-serif`;
			this.ctx.fillStyle = '#444444';
			this.ctx.textBaseline = 'top';

			const dimText = `${Math.round(widthMm)}mm × ${Math.round(heightMm)}mm`;
			this.ctx.fillText(dimText, centerX, centerY + 2);
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

			// Update inverted ratio display.
			const ratioInvElement = document.getElementById('ipsr-output-ratio-inv');
			if (ratioInvElement) {
				const inverted = (this.state.height / this.state.width).toFixed(this.config.decimals);
				ratioInvElement.textContent = inverted;
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
