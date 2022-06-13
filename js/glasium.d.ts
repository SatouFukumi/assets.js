export declare class Glasium {
    private static shape;
    private static background;
    /**
     * {@linkcode Glasium.Option}
     *
     * @param       element                     element
     * @param       options.shape               shape inside the background
     * @param       options.color               color for the background {@linkcode Glasium.Color}
     * @param       options.scale               scale size (bigger number is bigger size)
     * @param       options.speed               speed (how many iterations per 5 seconds)
     * @param       options.count               shape count
     * @param       options.rotate              rotation
     * @param       options.onMutation          mutation change
     */
    static init(element: HTMLElement, { shape, color, scale, speed, count, rotate, onMutation }?: Glasium.Option): void;
    static change(element: HTMLElement, { shape, color, scale, speed, rotate }?: Glasium.Option): void;
}
export default Glasium;
export declare const BRIGHTNESS: {
    DARK: Glasium.Color['brightness'];
    LIGHT: Glasium.Color['brightness'];
    OTHER: Glasium.Color['brightness'];
};
export declare const COLOR: {
    BLUE: Glasium.Color;
    RED: Glasium.Color;
    GREY: Glasium.Color;
    GREEN: Glasium.Color;
    PINK: Glasium.Color;
    DARKRED: Glasium.Color;
    ORANGE: Glasium.Color;
    NAVYBLUE: Glasium.Color;
    WHITESMOKE: Glasium.Color;
    LIGHTBLUE: Glasium.Color;
    DARK: Glasium.Color;
    YELLOW: Glasium.Color;
    PURPLE: Glasium.Color;
};
export declare const SHAPES: Glasium.Shape[];
declare global {
    namespace Glasium {
        type Shape = 'circle' | 'triangle' | 'square' | 'hexagon' | 'all';
        interface Color {
            background: string;
            shape: string;
            invertContrast: boolean;
            brightness: [number, number];
        }
        interface Option {
            shape?: Shape;
            color?: Color;
            scale?: number;
            speed?: number;
            count?: number;
            rotate?: boolean;
            onMutation?: {
                true: {
                    shape?: Shape;
                    color?: Color;
                    scale?: number;
                    speed?: number;
                    rotate?: boolean;
                };
                false: {
                    shape?: Shape;
                    color?: Color;
                    scale?: number;
                    speed?: number;
                    rotate?: boolean;
                };
                rule(): boolean;
                observing: HTMLElement;
                options?: MutationObserverInit;
            };
        }
    }
}
//# sourceMappingURL=glasium.d.ts.map