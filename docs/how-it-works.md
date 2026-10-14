# How it works

## Flow

1. The user clicks the toolbar button (or presses Option+Shift+D).
2. `background.js` reads the tab's hostname and flips a key such as `dark:example.com` in `browser.storage.local`.
3. Every `content.js` instance listens to `storage.onChanged`. Tabs on that hostname add or remove a `<style id="dark-toggle-style">` element.
4. `background.js` updates the toolbar icon and tooltip for every tab on that site.

On page load, `content.js` runs at `document_start` and applies the saved state before the page paints, which avoids a white flash.

## The CSS

```css
html { filter: invert(1) hue-rotate(180deg) !important; background-color: #fff; }
img, picture, video, canvas, iframe, embed, object, svg image,
[style*="background-image"] { filter: invert(1) hue-rotate(180deg) !important; }
```

- `invert(1)` turns light backgrounds dark and dark text light.
- `hue-rotate(180deg)` puts hues back where they were, so a red link stays red rather than turning cyan.
- Media gets the same filter again, which cancels the inversion and keeps photos and video looking real.
- The `background-color: #fff` fallback gives pages with a transparent root a dark result instead of a light one.

## Known limitations

- Sites that are already dark become light.
- Elements with CSS background images set in stylesheets (not inline `style`) are inverted.
- `invert(1)` produces pure black backgrounds, which some people find harsh.

## Possible improvements

- Detect already-dark pages and skip them.
- Add a popup with a brightness or contrast slider.
- Add a global "dark everywhere" default with per-site exceptions.
