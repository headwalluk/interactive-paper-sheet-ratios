# Configuration

All configuration is via shortcode attributes. There is no admin settings page.

## Shortcode Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `levels` | integer | `5` | Number of paper size levels. 5 gives A0-A4 (4 subdivisions). |
| `decimals` | integer | `8` | Decimal precision for aspect ratio display. |
| `opacity_cap` | integer | `50` | Maximum colour overlay opacity as a percentage (0-100). |
| `grid_size` | integer | `100` | Background grid cell size in millimeters. |
| `padding` | integer | `20` | Canvas padding around the outer sheet in millimeters. |
| `default_width` | integer | `210` | Initial datum sheet width in millimeters. |
| `default_height` | integer | `297` | Initial datum sheet height in millimeters. |

## Examples

### Default (A4 portrait, 5 levels)

```
[paper_sheet_ratios]
```

### More subdivision levels (A0 through A6)

```
[paper_sheet_ratios levels="7"]
```

### Custom datum with reduced precision

```
[paper_sheet_ratios default_width="250" default_height="350" decimals="4"]
```

### Subtle overlay with tight padding

```
[paper_sheet_ratios opacity_cap="25" padding="10"]
```

## How Levels Work

The `levels` attribute controls the total number of paper sizes rendered, including A0:

| Levels | Sizes shown | Subdivisions |
|---|---|---|
| 2 | A0, A1 | 1 |
| 3 | A0, A1, A2 | 2 |
| 5 | A0, A1, A2, A3, A4 | 4 |
| 7 | A0, A1, A2, A3, A4, A5, A6 | 6 |

## How the Outer Sheet is Calculated

The outer rectangle (A0) dimensions are the datum dimensions multiplied by 4 on each side, preserving the datum's aspect ratio. This gives the outer sheet 16x the datum area.

For the default datum of 210mm x 297mm, the outer sheet is 840mm x 1188mm.
