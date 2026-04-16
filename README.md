# Interactive Paper Sheet Ratios

Interactive canvas visualization showing relationships between paper sizes (A4→A0) with real-time dimension adjustment.

## Features

- Canvas-based visualization with auto-scaling
- Real-time user inputs (width/height via numeric + slider controls)
- Portrait/landscape orientation toggle
- Color overlay feedback (green/red based on deviation from ideal A0 area)
- Configurable aspect ratio precision
- Unit toggle (mm² ⟷ in²)
- Fully responsive and mobile-friendly

## Installation

1. Upload plugin folder to `/wp-content/plugins/`
2. Activate through the WordPress 'Plugins' menu

## Usage

Add the shortcode to any post or page:

```
[paper_sheet_ratios]
```

### Shortcode Parameters

All parameters are optional:

```
[paper_sheet_ratios 
    decimals="8"              Default: 8
    levels="5"                Default: 5 (A4→A0)
    opacity_cap="50"          Default: 50 (percent)
    grid_size="100"           Default: 100 (mm)
    padding="20"              Default: 20 (mm)
    default_width="297"       Default: 297 (A4 width, mm)
    default_height="210"      Default: 210 (A4 height, mm)
    default_orientation="portrait"  Default: portrait
]
```

## Requirements

- WordPress 6.0+
- PHP 8.0+
- Modern browser with canvas support

## Development

### File Structure

```
interactive-paper-sheet-ratios/
├── interactive-paper-sheet-ratios.php  # Main plugin file
├── constants.php                        # All constants
├── includes/
│   └── class-plugin.php                # Core plugin class
├── assets/
│   └── public/
│       ├── css/public.css              # Styles
│       └── js/canvas-controller.js     # Canvas logic
└── dev-notes/                          # Documentation
```

### Coding Standards

Follow WordPress Coding Standards:

```bash
phpcs              # Check standards
phpcbf             # Auto-fix issues
```

### Documentation

- **Project Tracker:** `dev-notes/00-project-tracker.md`
- **Project Instructions:** `.instructions.md`
- **Coding Standards:** `.github/copilot-instructions.md`

## License

GPL v2 or later

## Author

Power Plugins - https://powerplugins.com
