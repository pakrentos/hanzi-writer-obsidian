import { Plugin, MarkdownPostProcessorContext } from 'obsidian';
import HanziWriter from 'hanzi-writer';

export default class HanziWriterPlugin extends Plugin {
    async onload() {
        // Register the hanzi-writer code block processor
        this.registerMarkdownCodeBlockProcessor('hanzi-writer', (source, el, ctx) => {
            this.handleHanziWriter(source, el, ctx);
        });
    }

    getThemeColors(el: HTMLElement) {
        // Get the computed colors from the current theme
        const computedStyle = getComputedStyle(el);
        const backgroundColor = computedStyle.getPropertyValue('--background-primary');
        const textColor = computedStyle.getPropertyValue('--text-normal');
        
        return {
            backgroundColor: backgroundColor || '#ffffff',
            textColor: textColor || '#000000'
        };
    }

    handleHanziWriter(source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
        // Create container for the character
        const container = el.createDiv({ cls: 'hanzi-writer-container' });
        
        try {
            // Parse the source content
            const config = JSON.parse(source);
            const character = config.character;
            
            if (!character) {
                container.setText('Error: No character specified');
                return;
            }

            // Get theme colors
            const themeColors = this.getThemeColors(el);
            console.log(themeColors);

            // Create target div for HanziWriter
            const target = container.createDiv({ cls: 'hanzi-writer-target' });
            
            // Set up default options with theme colors
            const options = {
                width: config.width || 100,
                height: config.height || 100,
                padding: config.padding || 5,
                quizOnStart: config.quizOnStart || true,
                showOutline: config.showOutline !== undefined ? config.showOutline : false,
                strokeAnimationSpeed: config.strokeAnimationSpeed || 1,
                delayBetweenStrokes: config.delayBetweenStrokes || 1000,
                strokeColor: config.strokeColor || themeColors.textColor,
                // outlineColor: config.outlineColor || themeColors.textColor,
                drawingColor: config.drawingColor || themeColors.textColor,
                // highlightColor: config.highlightColor || themeColors.textColor,
                showCharacter: config.showCharacter || false,
                ...config.options
            };

            // Set background color on the target element
            target.style.backgroundColor = themeColors.backgroundColor;

            // Initialize HanziWriter
            const writer = HanziWriter.create(target, character, options);
            if (options.quizOnStart) {
                writer.quiz();
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
            const debugButton = buttonContainer.createEl('button', { text: 'Debug' });
            debugButton.onclick = () => {
                console.log('Writer instance:', writer);
                console.log('Config:', config);
                console.log('Options:', options);
            };

            // Add some basic styling
            container.style.textAlign = 'center';
            buttonContainer.style.marginTop = '10px';
            
        } catch (error) {
            container.setText(`Error: ${error.message}`);
        }
    }

    onunload() {
        // Cleanup if needed
    }
} 