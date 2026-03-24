# Design System Specification: Academic Precision

## 1. Overview & Creative North Star

### Creative North Star: "The Curated Academic"
This design system moves away from the utilitarian, spreadsheet-heavy aesthetics common in educational software. Instead, it adopts the persona of a **high-end editorial journal**. The goal is to transform a complex university timetable into a serene, navigable experience that feels bespoke and authoritative.

We achieve this through **Quiet Luxury**: replacing loud borders with tonal shifts, substituting generic "tech" blues with a scholarly palette of deep emerald and charcoal, and utilizing aggressive white space to provide cognitive relief. By breaking the standard grid with intentional layering and staggered typographic scales, we ensure the interface feels crafted, not generated.

---

## 2. Colors

The palette is anchored in deep, grounded tones and "off-white" surfaces to reduce eye strain during long planning sessions.

### Core Tones
*   **Primary (`#003527`)**: A deep, sophisticated emerald. Use this for moments of highest importance and brand authority.
*   **Secondary (`#555f6d`)**: A muted charcoal-grey that provides professional neutrality for secondary actions.
*   **Tertiary (`#521e00`)**: A burnt sienna/gold-adjacent tone used sparingly for highlighting specific course types or urgent conflicts.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries between the timetable grid, the sidebar, and header must be defined solely through background shifts:
*   **Main Background**: `surface` (`#f8f9ff`).
*   **Sidebar/Navigation**: `surface_container_low` (`#eff4ff`).
*   **Hovered Timetable Slots**: `surface_container_high` (`#dee9fc`).

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. A "Course Card" should not have a border; instead, it should be a `surface_container_lowest` (`#ffffff`) element sitting on top of a `surface_container` (`#e6eeff`) track. This "nested depth" mimics fine stationery stacked on a desk.

### The "Glass & Gradient" Rule
For floating elements like "Quick-Add" buttons or modal overlays, use **Glassmorphism**. Apply a semi-transparent `surface_tint` with a `backdrop-blur` of 12px. For main CTAs, use a subtle linear gradient from `primary` (`#003527`) to `primary_container` (`#064e3b`) at a 135-degree angle to add "soul" and visual depth.

---

## 3. Typography

**Font Family:** Inter (Primary)
The typographic system is built on an editorial scale, using significant size contrasts to establish hierarchy without the need for bold colors.

*   **Display Scales (`display-lg` to `display-sm`)**: Reserved for calendar headers and semester overviews. Use a tight letter-spacing (-0.02em) to maintain a modern, premium feel.
*   **Headline & Title**: Used for Course Names and Day headers. `title-lg` (1.375rem) provides an authoritative anchor for each schedule block.
*   **Body (`body-md`)**: The workhorse for descriptions. Set with generous line-height (1.6) to ensure readability in dense schedules.
*   **Label (`label-sm`)**: Specifically for metadata (Room numbers, Professor names). Use `on_surface_variant` (`#404944`) to de-emphasize this information relative to the Course Title.

---

## 4. Elevation & Depth

### The Layering Principle
Avoid "drop shadows" as a default. Depth is achieved via **Tonal Layering**:
1.  **Base Layer**: `surface`
2.  **Section Layer**: `surface_container_low`
3.  **Object Layer (Cards/Buttons)**: `surface_container_lowest`

### Ambient Shadows
When an element must float (e.g., a dragged course or a dropdown menu), use a "Signature Ambient Shadow":
*   **Blur**: 24px - 40px.
*   **Spread**: -4px.
*   **Color**: `on_surface` (`#121c2a`) at **6% opacity**.
This mimics natural light rather than digital "glow."

### The "Ghost Border" Fallback
If accessibility requirements demand a container boundary, use a **Ghost Border**: `outline_variant` (`#bfc9c3`) at **20% opacity**. It should be felt, not seen.

---

## 5. Components

### Timetable Cards (Course Blocks)
*   **Style**: No borders. Use `primary_fixed` (`#b0f0d6`) for the background of core courses.
*   **Rounding**: `md` (`0.75rem`) for a modern, approachable feel.
*   **Padding**: `3` (`1rem`) internally to ensure text never feels cramped.

### Buttons
*   **Primary**: Gradient fill (`primary` to `primary_container`), `on_primary` text, `full` rounding for a pill-shaped "Signature" look.
*   **Secondary**: `secondary_container` background with `on_secondary_container` text.
*   **States**: On hover, increase the elevation through a subtle background shift to `primary_fixed_dim`, rather than a heavy shadow.

### Selection Chips
*   For filtering by faculty or course level. Use `surface_container_highest` for unselected states and `primary` with `on_primary` for selected states. Forbid icons/emojis; use typographic weight to indicate selection.

### Inputs & Search
*   **Style**: "Underline-only" or "Flat-fill" (using `surface_container_low`). Avoid the "boxed" input look. 
*   **Error State**: Use `error` (`#ba1a1a`) for the text and a `error_container` (`#ffdad6`) subtle background wash.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a separator. Use spacing token `6` (2rem) between major layout sections.
*   **DO** use "Deep Emerald" (`primary`) for success states instead of "Tech Green."
*   **DO** ensure the timetable grid lines are `outline_variant` at 10% opacity—they should be a guide, not a cage.
*   **DO** use `title-sm` for the "Current Time" indicator to make it stand out through scale rather than color.

### Don'ts
*   **DONT** use any emojis. Use text-based labels or minimalist geometric icons if absolutely necessary.
*   **DONT** use `#000000` for text. Always use `on_surface` (`#121c2a`) to maintain the "charcoal" sophisticated feel.
*   **DONT** use 1px solid dividers between list items. Use spacing token `2` (0.7rem) and a background color shift.
*   **DONT** use "Standard Blue" for links. Use `primary` with a 1px underline offset by 2px.