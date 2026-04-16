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
		// Clear canvas.
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

		// Calculate dimensions for all levels.
		const dimensions = this.calculateDimensions();

		// Calculate scale to fit largest sheet with padding.
		this.calculateScale(dimensions);

		// Render layers (bottom to top).
		this.renderBackground();
		this.renderGrid();
		this.renderColorOverlay(dimensions);
		this.renderPaperSheets(dimensions);
		let currentHeight = this.state.height;
		
		dimensions.push({ width: currentWidth, height: currentHeight });

		// Each level doubles the area.
		// To maintain aspect ratio, we alternate which dimension gets multiplied by √2.
		for (let i = 1; i < levels; i++) {
			if (i % 2 === 1) {
				// Odd levels: increase width.
				currentWidth = currentWidth * this.config.sqrt_two;
			} else {
				// Even levels: increase height.
				currentHeight = currentHeight * this.config.sqrt_two;
			}
			dimensions.push({ 
				width: Math.round(currentWidth * 100) / 100, 
				height: Math.round(currentHeight * 100) / 100 
			});
		}

		return dimensions;
	}

	/**
	 * Calculate scale factor to fit object in canvas with padding.
	 *
	 * @param {Array} dimensions - Array of dimension objects.
	 */
	calculateScale(dimensions) {
		// Get largest (outer) sheet dimensions.
		const outerSheet = dimensions[dimensions.length - 1];
		const outerWidth = outerSheet.width;
		const outerHeight = outerSheet.height;

		// Add padding (convert to mm).
		const padding = this.config.padding * 2; // Left + right, top + bottom.
		const totalWidth = outerWidth + padding;
		const totalHeight = outerHeight + padding;

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
	 * @param {Array} dimensions - Array of dimension objects.
	 */
	renderColorOverlay(dimensions) {
		// Calculate total area (outer sheet).
		const outerSheet = dimensions[dimensions.length - 1];
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
	 * Render nested paper sheets.
	 *
	 * @param {Array} dimensions - Array of dimension objects.
	 */
	renderPaperSheets(dimensions) {
		// Calculate center position for outer sheet.
		const outerSheet = dimensions[dimensions.length - 1];
		const outerWidth = outerSheet.width * this.scale;
		const outerHeight = outerSheet.height * this.scale;
		
		const startX = (this.canvasWidth - outerWidth) / 2;
		const startY = (this.canvasHeight - outerHeight) / 2;
		
		// Draw from largest to smallest (back to front).
		for (let i = dimensions.length - 1; i >= 0; i--) {
			const dim = dimensions[i];
			const width = dim.width * this.scale;
			const height = dim.height * this.scale;
			
			// Position in top-left corner of outer sheet.
			const x = startX;
			const y = startY;
			
			// Draw filled rectangle with border.
			this.ctx.fillStyle = i === 0 ? '#ffffff' : '#f8f8f8';
			this.ctx.fillRect(x, y, width, height);
			
			// Draw border.
			this.ctx.strokeStyle = '#333333';
			this.ctx.lineWidth = i === 0 ? 2 : 1;
			this.ctx.strokeRect(x, y, width, height);
			
			// Draw label.
			this.renderLabel(i, x, y, width, height, dim);
		}
	}

	/**
	 * Render label for a paper sheet.
	 *
	 * @param {number} level - Level index (0 = smallest).
	 * @param {number} x - X position.
	 * @param {number} y - Y position.
	 * @param {number} width - Sheet width in pixels.
	 * @param {number} height - Sheet height in pixels.
	 * @param {Object} dim - Dimension object {width, height} in mm.
	 */
	renderLabel(level, x, y, width, height, dim) {
		// Label text (A0, A1, A2, etc. in reverse).
		const totalLevels = this.config.levels;
		const labelIndex = totalLevels - 1 - level;
		const label = `A${labelIndex}`;
		
		// Font size based on sheet size.
		const fontSize = Math.max(12, Math.min(32, Math.min(width, height) / 8));
		this.ctx.font = `bold ${fontSize}px sans-serif`;
		this.ctx.fillStyle = '#333333';
		this.ctx.textAlign = 'left';
		this.ctx.textBaseline = 'top';
		
		// Position with padding.
		const padding = fontSize / 4;
		this.ctx.fillText(label, x + padding, y + padding);
		
		// Add dimensions (smaller text).
		const dimFontSize = fontSize * 0.6;
		this.ctx.font = `${dimFontSize}px sans-serif`;
		this.ctx.fillStyle = '#666666';
		
		const dimText = `${Math.round(dim.width)}mm × ${Math.round(dim.height)}mm`;
		this.ctx.fillText(dimText, x + padding, y + padding + fontSize);
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
