# Build and install

## Command-line build

```bash
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild \
  -project "xcode/Dark Toggle.xcodeproj" -scheme "Dark Toggle" \
  -configuration Debug -derivedDataPath build -allowProvisioningUpdates build
open "build/Build/Products/Debug/Dark Toggle.app"
```

`DEVELOPER_DIR` is only needed if `xcode-select` still points at the Command Line Tools.

The Xcode project references the files in `extension/` directly, so edits there are picked up on the next build. Keep the built app where it is: removing the `build/` folder removes the extension from Safari.

## Quick test without Xcode

1. Safari ▸ Settings ▸ Advanced ▸ **Show features for web developers**.
2. Safari ▸ Settings ▸ Developer ▸ **Add Temporary Extension…** and choose the `extension/` folder.

Safari removes temporary extensions when it quits.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Embedded binary's bundle identifier is not prefixed with the parent app's` | The extension ID must start with the app ID, for example `com.you.DarkToggle` and `com.you.DarkToggle.Extension`. |
| `Embedded binary is not signed with the same certificate` | Run a clean build after changing signing settings. |
| Extension missing from Safari's Extensions pane | Unsigned builds need Develop ▸ **Allow unsigned extensions**, and Safari may need a full restart (⌘Q) to notice a new extension. |

## Distribution options

| Option | Cost | Notes |
|---|---|---|
| Mac App Store | Apple Developer Program, $99/yr | Easiest for users; goes through App Review |
| Developer ID + notarization | Apple Developer Program, $99/yr | Self-hosted `.dmg` or `.zip` download |
| Source only | Free | Others build it themselves in Xcode |

A free Personal Team signature only works on the Mac that built the app.
