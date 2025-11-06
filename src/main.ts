import { Plugin, MarkdownPostProcessorContext, PluginSettingTab, App, Setting } from 'obsidian';
import HanziWriter from 'hanzi-writer';

export default class HanziWriterPlugin extends Plugin {
    settings!: HanziWriterPluginSettings;

    async onload() {
        await this.loadSettings();

        // Register the hanzi-writer code block processor
        this.registerMarkdownCodeBlockProcessor('hanzi-writer', (source, el, ctx) => {
            this.handleHanziWriter(source, el, ctx);
        });

        this.addSettingTab(new HanziWriterSettingsTab(this.app, this));
    }

    getThemeColors() {
        // Get the computed colors from the current theme
        const computedStyle = window.getComputedStyle(document.body);
        const backgroundColor = computedStyle.getPropertyValue('--background-primary');
        const textColor = computedStyle.getPropertyValue('--text-normal');
        
        return {
            backgroundColor: backgroundColor || '#ffffff',
            textColor: textColor || '#000000'
        };
    }

    handleHanziWriter(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
        try {
            // Parse the source content
            const config = JSON.parse(source);
            
            // Determine characters to render
            let characters: string[] = [];
            if (config.characters && Array.isArray(config.characters)) {
                // Use explicit characters array
                characters = config.characters;
            } else if (config.character) {
                // Split character string into individual characters
                characters = Array.from(config.character);
            } else {
                const errorContainer = el.createDiv({ cls: 'hanzi-writer-container' });
                errorContainer.setText('Error: No character(s) specified');
                return;
            }

            // Get theme colors
            const themeColors = this.getThemeColors();

            // Store quizOnStart preference
            const quizOnStart = config.quizOnStart !== undefined ? config.quizOnStart : true;
            
            // Set up default options with theme colors
            const baseOptions = {
                width: config.width || 100,
                height: config.height || 100,
                padding: config.padding || 5,
                showOutline: config.showOutline !== undefined ? config.showOutline : false,
                strokeAnimationSpeed: config.strokeAnimationSpeed || 1,
                delayBetweenStrokes: config.delayBetweenStrokes || 1000,
                strokeColor: config.strokeColor || themeColors.textColor,
                // The default outline color (#DDD) is almost identical to the default text color (#dadada)
                outlineColor: config.outlineColor || "#888",
                drawingColor: config.drawingColor || themeColors.textColor,
                showCharacter: config.showCharacter || false,
                ...config.options
            };

            // Create a HanziWriter instance for each character
            characters.forEach((character) => {
                // Create container for this character
                const container = el.createDiv({ cls: 'hanzi-writer-container' });
                
                // Create target div for HanziWriter
                const target = container.createDiv({ cls: 'hanzi-writer-target' });
                
                // Initialize HanziWriter with load callbacks
                let writer: any;
                try {
                    const writerOptions = {
                        ...baseOptions,
                        onLoadCharDataSuccess: () => {
                            if (quizOnStart) {
                                writer.quiz();
                            }
                        },
                        onLoadCharDataError: (err: any) => {
                            console.error('Failed to load character data for:', character, err);
                            target.setText(`Failed to load: ${character}`);
                        }
                    };
                    
                    writer = HanziWriter.create(target, character, writerOptions);
                } catch (error) {
                    console.error('Failed to create HanziWriter for character:', character, error);
                    target.setText(`Failed to load character: ${character}`);
                    return;
                }
        
                // Add control buttons
                const buttonContainer = container.createDiv({ cls: 'hanzi-writer-controls' });
                
                // Animate button
                const animateButton = buttonContainer.createEl('button', { text: 'Animate' });
                animateButton.onclick = () => writer.animateCharacter();

                // Quiz button
                const quizButton = buttonContainer.createEl('button', { text: 'Quiz' });
                quizButton.onclick = () => writer.quiz();

                // Debug button
                if (this.settings.showDebug) {
                    const debugButton = buttonContainer.createEl('button', { text: 'Debug' });
                    debugButton.onclick = () => {
                        console.log('Character:', character);
                        console.log('Writer instance:', writer);
                        console.log('Config:', config);
                        console.log('Options:', baseOptions);
                    };
                }
            });
            
        } catch (error) {
            const errorContainer = el.createDiv({ cls: 'hanzi-writer-container' });
            errorContainer.setText(`Error: ${error.message}`);
        }
    }

    onunload() { }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
} 

class HanziWriterSettingsTab extends PluginSettingTab {
    plugin: HanziWriterPlugin;

    constructor(app: App, plugin: HanziWriterPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName("Show debug button")
            .setDesc("Shows the debug button that will print debug information to the console.")
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showDebug)
                .onChange(async (value) => {
                    this.plugin.settings.showDebug = value;
                    await this.plugin.saveSettings();
                })
            );
    }
}

interface HanziWriterPluginSettings {
    showDebug: boolean;
}

const DEFAULT_SETTINGS: HanziWriterPluginSettings = {
    showDebug: false
}
