# ComfyUI MechaBaby Node Search

> **Languages**: [English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Русский](README_ru.md)

Enhance ComfyUI workflow by providing powerful node search, attribute search, and port navigation features with Ctrl+F shortcut support.

## Features

- 🔍 **Node Search & Navigation**: Quickly search for nodes by name and jump to them
- 📝 **Attribute Search**: Search node attribute names and values (including numbers and text)
- 🔗 **Port Teleport**: Right-click on node ports to jump directly to connected nodes
- ⚡ **Quick Jump Menu**: Select a node and press the shortcut (default: F1) to quickly view and jump to all connected nodes
- ⏪ **History Navigation**: Navigate jump history using mouse side buttons or customizable keyboard keys
- 🔄 **Auto Jump**: Automatically jump when port has only one connection (optional)
- ⌨️ **Keyboard Shortcuts**: Press `Ctrl+F` to quickly open the search dialog
- 🎯 **Smart Matching**: Supports searching node titles, types, node IDs, widget names, widget values, property names, and property values
- ✨ **Golden Flash Highlight**: Target node flashes with golden color after jumping for better visibility
- 🔄 **Easy Use Support**: Supports jumping between `easy getNode` and `easy setNode` nodes (comfyui-easy-use extension)
- ⚙️ **Rich Configuration**: Extensive settings for auto jump, menu blocking, navigation keys, and menu scaling

## Installation

1. Place the extension directory `ComfyUI-MechaBabyNodeSearch` into `ComfyUI/custom_nodes/`
2. Restart ComfyUI
3. The extension will load automatically

## Usage

### Node Search

1. **Keyboard Shortcut**: Press `Ctrl+F` to open the search dialog
2. **Right-click Menu**: Right-click on the canvas and select "🔍 Search Nodes (Ctrl+F)"

Enter keywords in the search box to search for:
- Node titles
- Node types
- Node IDs
- Widget names (e.g., "steps", "cfg", "seed")
- Widget values (e.g., "20", "7.5", "prompt text")
- Property names
- Property values

### Extension Settings

Access the extension settings through:
1. **Right-click Menu**: Right-click on the canvas and select "⚙️ NodeSearch Settings"
2. In the settings menu, you can:
   - Change the interface language (Chinese, English, Japanese, Korean, Russian)
   - Customize the keyboard shortcut (default: Ctrl+F)

**Search Tips**:
- Use arrow keys (↑↓) to navigate through the results list
- Press `Enter` to jump to the selected node
- Press `Esc` to close the search dialog

### Port Teleport

1. **Method 1**: Right-click on a node, select "🔗 Teleport to Connected Nodes", then choose the connection to jump to
2. **Method 2**: Right-click directly on a port (if the port has connections), it will automatically jump or show a connection list
3. **Method 3**: Select a node and press the quick jump shortcut (default: F1) to open the quick jump menu showing all connected nodes

### Port Teleport Settings

Access port teleport settings through:
1. **Right-click Menu**: Right-click on the canvas and select "⚙️ NodeSearch Settings" → "🎯 Port Teleport Settings"
2. In the settings menu, you can configure:
   - **Auto Jump**: Enable/disable automatic jump when port has only one connection
   - **Block Menu**: Enable/disable completely blocking menu display during auto jump
   - **History Navigation**: Enable/disable mouse side button and keyboard history navigation
   - **Customize Navigation Keys**: Set custom keys for back/forward navigation
   - **Quick Jump Shortcut**: Set custom shortcut for quick jump menu (default: F1)
   - **Menu Scale**: Adjust quick jump menu scale (50%, 75%, 100%, 125%, 150%, or auto-scale)

## Examples

### Searching Nodes
- Type "ksampler" to find all KSampler nodes
- Type "512" to find all nodes containing the value 512 (e.g., width, height)
- Type "steps" to find all nodes with a steps widget

### Port Teleport
- Right-click on the "model" input port of a KSampler node to jump to the connected CheckpointLoaderSimple node
- Right-click on the output port of a CheckpointLoaderSimple node to jump to all nodes using that model

## Technical Details

- **Extension Type**: Web Extension (JavaScript)
- **Dependencies**: ComfyUI Core API
- **Compatibility**: ComfyUI 1.0+

## License

MIT License

## Changelog

### v1.4.0 (2026-01-08)
- Added automatic jump feature: when a port has only one connection, right-click will jump directly without showing menu
- Added option to completely block menu display during auto jump (including menus from other extensions)
- Added jump history navigation feature:
  - Mouse side button navigation (Back=Side Button 1, Forward=Side Button 2)
  - Keyboard navigation (customizable keys, default: Back=F2, Forward=F3)
- Added quick jump feature:
  - Quick jump shortcut (default: F1, customizable, supports combination keys like Ctrl+F1)
  - Quick jump menu showing all connected nodes in a two-panel layout (input/output)
  - Draggable quick jump menu
  - Menu scale adjustment (50%, 75%, 100%, 125%, 150%, or auto-scale based on canvas zoom)
- Enhanced port teleport settings menu with comprehensive configuration options

### v1.3.2 (2026-01-07)
- Added customizable keyboard shortcut support
- Added multi-language support (Chinese, English, Japanese, Korean, Russian)
- Auto-detect browser language on first load
- Added settings dialog for shortcut and language configuration
- Port teleport menu items now support multi-language
- Added node ID search functionality
- Updated input placeholder to mention node ID search
- Enhanced search to include node ID matching
- Improved keyboard navigation: search results list now auto-scrolls to keep the selected item visible

### v1.2.0 (2026-01-07)
- Added golden flash highlight effect when jumping to nodes
- Added support for `easy getNode` and `easy setNode` jumping (comfyui-easy-use extension)
- Migrated to new ComfyUI Context Menu API
- Auto-focus on search input when opening dialog
- Code optimization and bug fixes

### v1.0.0 (2026-01-06)
- Initial release
- Node search functionality
- Attribute search functionality
- Port teleport functionality
- Keyboard shortcut support

## Contributing

Issues and Pull Requests are welcome!

## Author

MechaBaby
