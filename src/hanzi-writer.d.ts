declare module 'hanzi-writer' {
    interface HanziWriterOptions {
        width?: number;
        height?: number;
        padding?: number;
        showOutline?: boolean;
        strokeAnimationSpeed?: number;
        delayBetweenStrokes?: number;
        delayBetweenLoops?: number;
        strokeColor?: string;
        [key: string]: any;
    }

    interface HanziWriter {
        animateCharacter(): void;
        loopCharacterAnimation(): void;
        pauseAnimation(): void;
        resumeAnimation(): void;
        quiz(): void;
    }

    interface HanziWriterStatic {
        create(element: HTMLElement | string, character: string, options?: HanziWriterOptions): HanziWriter;
    }

    const HanziWriter: HanziWriterStatic;
    export = HanziWriter;
} 