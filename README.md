# Dark Toggle — Safari Dark Mode Extension

**Status:** Working Safari extension for macOS and iOS; Mac version installed and signed for local use  
**Project source:** Independent project

## Overview

A Safari web extension that adds a toolbar button to switch any website into dark mode. The choice is remembered per site, and every open tab of that site updates at once. It needs no account, sends no data anywhere, and stores only a list of site names in Safari's local extension storage.

Shortcut: **Option+Shift+D**

## Components

| Component | Purpose | Status |
|---|---|---|
| [`manifest.json`](extension/manifest.json) | Manifest V3 settings, permissions, and keyboard shortcut | Complete |
| [`background.js`](extension/background.js) | Handles the toolbar button, saves the per-site setting, and swaps the icon | Complete |
| [`content.js`](extension/content.js) | Injects the dark-mode CSS and reacts to setting changes | Complete |
| [`make_icons.py`](tools/make_icons.py) | Generates all PNG icons with no third-party dependencies | Complete |
| [`xcode/`](xcode/) | Xcode project that packages the extension as an iOS and a macOS app | Complete |

## Repository structure

```text
extension/   Safari web extension source (manifest, scripts, icons)
xcode/       Xcode project with iOS and macOS app targets that wrap the extension
tools/       Icon generator
docs/        Design notes, build steps, and distribution options
```

## Build and install

Requires macOS with Xcode and an Apple ID added under Xcode ▸ Settings ▸ Accounts. The project has two schemes: **Dark Toggle (macOS)** and **Dark Toggle (iOS)**.

1. Open `xcode/Dark Toggle.xcodeproj` in Xcode.
2. For all four targets, choose your own team under **Signing & Capabilities**. If the bundle ID is already taken, change `com.castro.DarkToggle` to your own prefix; the extension ID must start with the app ID.
3. Pick a scheme and press **Run**.
   - **Mac:** turn on Dark Toggle in Safari ▸ Settings ▸ Extensions and allow it on all websites.
   - **iPhone/iPad:** open Settings ▸ Apps ▸ Safari ▸ Extensions ▸ Dark Toggle, turn it on, and allow All Websites. In Safari, tap the page menu in the address bar and choose Dark Toggle.

Command-line build and quick-test steps are in [docs/build-and-install.md](docs/build-and-install.md).

## Quality checklist

- No credentials, secrets, tracking, or network requests
- Minimal permissions: `storage`, `tabs`, and site access needed for the content script
- Per-site state only; nothing is shared between devices or sent off the machine
- Images, video, and canvases are re-inverted so media keeps its real colors
- Icons are generated from source, not downloaded

## Validation status

- The dark-mode CSS was tested on a sample page in a Chromium-based browser: the page turned dark, link colors kept their hue, and images kept their real colors.
- The macOS app builds with Xcode 27, is signed with an Apple Development certificate, and appears in Safari 27's Extensions pane without "Allow unsigned extensions".
- The iOS app builds and launches on an iOS 27 iPhone simulator. The extension has not yet been turned on and tested in iOS Safari, and the app has not been installed on a physical iPhone.
- No automated tests exist yet. Behavior across a broad set of real websites has not been systematically checked.

Known limitation: the color-inversion approach can make some sites look off, such as sites that are already dark or that use heavy CSS background images. See [docs/how-it-works.md](docs/how-it-works.md).

## Disclaimer

Provided as-is for personal use. The extension changes how pages look in your browser only and does not change the websites themselves.
