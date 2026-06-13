# Responsive Navigation Breakpoints

This document outlines the responsive navigation behavior for the MainNav component across different screen sizes.

## Navigation Structure

The MainNav component uses a consistent 3-column layout across all screen sizes:

- **Left Column:** Logo (Home button) - Always visible
- **Center Column:** Progressive navigation buttons - Shown based on screen size
- **Right Column:** Hamburger menu - Always visible

## Screen Size Breakpoints

### Mobile (≤599px)
- **Layout:** Logo + Hamburger only
- **Center Navigation:** Hidden
- **Auth Section:** Hidden
- **Logo:** Landscape version, height: 2rem
- **Header:** 95% width, positioned at top: 0.5rem

### Small Screens (600px - 799px)
- **Layout:** Logo + Products + Hamburger
- **Center Navigation:** Products button only
- **Auth Section:** Hidden
- **Logo:** Landscape version, height: 2.5rem
- **Header:** 90% width, positioned at top: 1rem

### Medium Screens (800px - 999px)
- **Layout:** Logo + Products + Yacht List + Hamburger
- **Center Navigation:** Products + Yacht List buttons
- **Auth Section:** Hidden
- **Logo:** Landscape version, height: 2.5rem
- **Header:** 90% width, positioned at top: 1rem

### Large Screens (1000px - 1199px)
- **Layout:** Logo + Products + Installation + Yacht List + Hamburger
- **Center Navigation:** Products + Installation + Yacht List buttons
- **Auth Section:** Hidden
- **Logo:** Landscape version, height: 2.5rem
- **Header:** 90% width, positioned at top: 1rem

### Extra Large Screens (1200px+)
- **Layout:** Logo + Products + Installation + Yacht List + Contact + Hamburger + Auth
- **Center Navigation:** All navigation buttons (Products + Installation + Yacht List + Contact)
- **Auth Section:** Visible (Sign Out button when user is logged in)
- **Logo:** Landscape version, height: 2.5rem
- **Header:** 90% width, positioned at top: 1rem

## Navigation Button Priority

The navigation buttons are added to the center column in the following priority order:

1. **Products** - First to appear (600px+)
2. **Yacht List** - Second to appear (800px+)
3. **Installation** - Third to appear (1000px+)
4. **Contact** - Last to appear (1200px+)

## Hamburger Menu

The hamburger menu is always visible on the right side and contains all navigation options in a dropdown:

- Products
- Installation
- Yacht List
- FAQ
- Testimonials
- About
- Contact

## CSS Classes

### Main Layout Classes
- `.header-content` - Flexbox container with space-between
- `.logo-container` - Left column, flex-shrink: 0
- `.nav-center` - Center column, flex: 1, justify-content: center
- `.hamburger-menu` - Right column, flex-shrink: 0

### Responsive Classes
- `.nav-center .nav-link:nth-child(n)` - Controls visibility of specific navigation buttons
- `.auth-section` - Controls visibility of authentication section

## Implementation Notes

- All breakpoints use `min-width` and `max-width` media queries
- The layout is mobile-first with progressive enhancement
- The hamburger menu uses CSS-only implementation with checkbox toggle
- Navigation buttons use Font Awesome icons with text labels
- The logo serves as the Home button (links to "/")

## Testing

To test the responsive behavior:

1. **Mobile (≤599px):** Resize browser to 599px or less
2. **Small (600px-799px):** Resize browser to 600px-799px range
3. **Medium (800px-999px):** Resize browser to 800px-999px range
4. **Large (1000px-1199px):** Resize browser to 1000px-1199px range
5. **Extra Large (1200px+):** Resize browser to 1200px or more

The navigation should smoothly transition between these breakpoints, showing the appropriate number of buttons in the center column while maintaining the logo on the left and hamburger menu on the right.
