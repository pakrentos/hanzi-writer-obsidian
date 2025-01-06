# Hanzi Writer for Obsidian

An Obsidian plugin that adds interactive Chinese character writing blocks using [Hanzi Writer](https://hanziwriter.org/). This plugin allows you to create interactive blocks for practicing Chinese character writing directly in your Obsidian notes.

## Features

- Interactive Chinese character writing practice
- Character stroke animation
- Writing quizzes with stroke order checking
- Customizable character display options

## Installation

1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Click Browse and search for "Hanzi Writer"
4. Install the plugin and enable it

## Usage

Create a code block with the language `hanzi-writer` and provide a JSON configuration:

    ```hanzi-writer
    {
        "character": "你",
        "width": 100,
        "height": 100,
        "showOutline": true,
        "strokeAnimationSpeed": 1,
        "delayBetweenStrokes": 1000
    }
    ```

### Configuration Options

- `character`: (Required) The Chinese character to display
- `width`: Width of the character box in pixels (default: 100)
- `height`: Height of the character box in pixels (default: 100)
- `padding`: Padding around the character (default: 5)
- `quizOnStart`: Start in quiz mode immediately (default: true)
- `showOutline`: Show character outline (default: false)
- `strokeAnimationSpeed`: Speed of stroke animations (default: 1)
- `delayBetweenStrokes`: Delay between strokes in milliseconds (default: 1000)
- `strokeColor`: Color of character strokes (defaults to theme text color)
- `drawingColor`: Color of user drawing (defaults to theme text color)

and all other options from [Hanzi Writer](https://hanziwriter.org/docs/api/options)

## Controls

Each character block includes three buttons:
- **Animate**: Shows stroke order animation
- **Quiz**: Starts writing practice mode
- **Debug**: Shows debug information in console

## Development

This plugin is built using:
- [Obsidian API](https://github.com/obsidianmd/obsidian-api)
- [Hanzi Writer](https://hanziwriter.org/)
- TypeScript

To build from source:

1. Clone this repository
2. Install dependencies with `npm install`
3. Build with `npm run build`
4. Copy `main.js` and `manifest.json` to your Obsidian plugins folder

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have suggestions, please [open an issue](https://github.com/yourusername/hanzi-writer-obsidian/issues) on GitHub. 