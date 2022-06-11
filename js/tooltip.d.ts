import RecordAnimationFrame from './record-animation-frame.js';
declare global {
    namespace Tooltip {
        interface THTMLElement extends HTMLElement {
            tooltipAttached?: boolean;
        }
        interface Interface {
            readonly initialized: boolean;
            glowing: boolean;
            hideId: number;
            deactivateId: number;
            container?: HTMLElement;
            content?: HTMLElement;
            processor: {
                attribute: {
                    process(target: HTMLElement, key: string): undefined | string;
                    attach(hook: Hook): void;
                };
                dataset: {
                    process(target: HTMLElement, key: string): undefined | string;
                    attach(hook: Hook): void;
                };
            };
            process(target: HTMLElement, hook: Hook): undefined | string;
            attach(target: THTMLElement, hook: Hook): void;
            hooks: Array<Hook>;
            init: () => void;
            scan: () => void;
            addHook: (on: Hook['on'], key: Hook['key'], hookAssets?: AddHook) => void;
            pointerenter(target: HTMLElement, hook: Hook): void;
            pointerleave(hook: Hook): void;
            show: (content: string | HTMLElement) => void;
            hide: () => void;
            move: RecordAnimationFrame;
            __move: () => void;
            updateSize: () => void;
            update: (content: string | HTMLElement) => void;
            glow: () => void;
        }
        interface Hook extends Required<AddHook> {
            on: 'attribute' | 'dataset';
            key: string;
        }
        interface AddHook {
            handler?: (assets: {
                target: HTMLElement;
                value: undefined | string;
                update: (content: string | HTMLElement) => void;
            }) => undefined | string | HTMLElement;
            follower?: () => void;
            fit?: boolean;
            priority?: number;
        }
    }
}
export declare const tooltip: Tooltip.Interface;
export default tooltip;
//# sourceMappingURL=tooltip.d.ts.map