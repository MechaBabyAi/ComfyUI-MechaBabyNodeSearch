# ComfyUI MechaBaby Node Search

> **Languages**: [English](README.md) | [中文](README_zh.md) | [日本語](README_ja.md) | [한국어](README_ko.md) | [Русский](README_ru.md)

Enhance ComfyUI workflow by providing powerful node search, attribute search, and port navigation features with Ctrl+F shortcut support.

## Features

- 🔍 **Node Search & Navigation**: Quickly search for nodes by name and jump to them
- 📝 **Attribute Search**: Search node attribute names and values (including numbers and text)
- 🔗 **Port Teleport**: Right-click on node ports to jump directly to connected nodes
- ⌨️ **Keyboard Shortcuts**: Press `Ctrl+F` to quickly open the search dialog
- 🎯 **Smart Matching**: Supports searching node titles, types, widget names, widget values, property names, and property values
- ✨ **Golden Flash Highlight**: Target node flashes with golden color after jumping for better visibility
- 🔄 **Easy Use Support**: Supports jumping between `easy getNode` and `easy setNode` nodes (comfyui-easy-use extension)

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
- Widget names (e.g., "steps", "cfg", "seed")
- Widget values (e.g., "20", "7.5", "prompt text")
- Property names
- Property values

**Search Tips**:
- Use arrow keys (↑↓) to navigate through the results list
- Press `Enter` to jump to the selected node
- Press `Esc` to close the search dialog

### Port Teleport

1. **Method 1**: Right-click on a node, select "🔗 Teleport to Connected Nodes", then choose the connection to jump to
2. **Method 2**: Right-click directly on a port (if the port has connections), it will automatically jump or show a connection list

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

### v1.3.1 (2025-01-08)
- Added node ID search functionality
- Updated input placeholder to mention node ID search
- Enhanced search to include node ID matching

### v1.3.0 (2025-01-08)
- Added customizable keyboard shortcut support
- Added multi-language support (Chinese, English, Japanese, Korean, Russian)
- Auto-detect browser language on first load
- Added settings dialog for shortcut and language configuration
- Port teleport menu items now support multi-language
- Settings menu renamed to "NodeSearch Settings" for clarity

### v1.2.0 (2025-01-07)
- Added golden flash highlight effect when jumping to nodes
- Added support for `easy getNode` and `easy setNode` jumping (comfyui-easy-use extension)
- Migrated to new ComfyUI Context Menu API
- Auto-focus on search input when opening dialog
- Code optimization and bug fixes

### v1.0.0 (2025-01-05)
- Initial release
- Node search functionality
- Attribute search functionality
- Port teleport functionality
- Keyboard shortcut support

## Contributing

Issues and Pull Requests are welcome!

## Author

MechaBaby
