import { COLOR } from './glasium.js';
export declare const navigation: Nav.Interface;
declare class Tooltip {
    constructor(container: HTMLElement);
    private title;
    private description;
    private flip;
    private container;
    set({ title, description, flip }?: {
        title?: string;
        description?: string;
        flip?: boolean;
    }): void;
    show({ target }: PointerEvent): void;
    hide(): void;
}
declare class Clicker {
    private container;
    private onlyActive;
    constructor(container: HTMLElement, onlyActive?: boolean);
    private clickHandlers;
    private __activated;
    get activated(): boolean;
    get toOnlyActive(): boolean;
    set toOnlyActive(onlyActive: boolean);
    onClick(func: (isActive: boolean) => void): number;
    offClick(id: number): void;
    toggle(isActive?: boolean): void;
    show(): void;
    hide(): void;
}
declare class SubWindow {
    private container;
    constructor(container: HTMLElement, content?: string | HTMLElement);
    /** props */
    private __id;
    private __isShowing;
    private hideId;
    /** getters */
    get id(): string;
    get isShowing(): boolean;
    /** handlers collection */
    private toggleHandlers;
    /** nodes */
    private windowNode;
    private overlayNode;
    private contentNode;
    /** setters */
    set loading(loading: boolean);
    set content(content: string | HTMLElement);
    /** public funcs */
    update(): void;
    show(): void;
    hide(trusted?: boolean): void;
    toggle(): void;
    onToggle(func: (...args: any[]) => void): void;
}
export declare class Component {
    container: HTMLElement;
    constructor(container: HTMLElement);
    tooltip: Tooltip;
    clicker: Clicker;
    subWindow: SubWindow;
}
export default navigation;
declare global {
    namespace Nav {
        interface Interface {
            get initialized(): boolean;
            container?: HTMLElement;
            component?: HTMLElement;
            block: {
                left?: HTMLElement;
                right?: HTMLElement;
            };
            tooltip?: Tooler;
            underlay?: HTMLElement;
            setUnderlay(activate?: boolean): void;
            setLoading(loading?: boolean): void;
            subWindowList: Array<SubWindow>;
            init: (container: string, content: string) => void;
            /** {@linkcode Component} */
            insert: (component: Pick<Component, 'container'>, location: keyof this['block'], order?: number) => void;
            /** {@linkcode Component} */
            addComponent: {
                logo: (props?: {
                    logo?: string;
                    title?: string;
                    onlyActive?: boolean;
                }) => Component;
                /**
                 * this uses `[data-href]` as the spa anchor
                 * ```html
                 * <element data-href=%href></element>
                 * ```
                 * `%href` should be primary and global most
                 * ```ts
                 * href = `/${path}`
                 * ```
                 */
                route(collection: Array<{
                    href: string;
                    icon?: string;
                    tooltip?: {
                        title?: string;
                        description?: string;
                    };
                }>, spa?: boolean): void;
                hamburger: () => Component;
                /** {@linkcode ButtonComponent} */
                button: (props?: {
                    alwaysActive?: boolean;
                    text?: string;
                    icon?: string;
                    color?: Glasium.Color | keyof typeof COLOR;
                    image?: string;
                }) => ButtonComponent;
                /** {@linkcode AccountComponent}*/
                account: () => AccountComponent;
            };
            global: {
                [key: string | number | symbol]: any;
            };
        }
        interface Tooler extends HTMLElement {
            t: HTMLElement;
            d: HTMLElement;
        }
        interface Component {
            container: HTMLElement;
            tooltip: Tooltip;
            clicker: Clicker;
            subWindow: SubWindow;
        }
        interface ButtonComponent extends Component {
            set icon(icon: string);
            set text(text: string | null);
            set image(image: string);
            set color(color: Glasium.Color | keyof typeof COLOR);
        }
        interface AccountComponent extends Component {
            set avatar(avatar: string);
            set username(username: string);
            set color(color: Glasium.Color | keyof typeof COLOR);
        }
    }
}
//# sourceMappingURL=navigation.d.ts.map