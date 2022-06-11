declare global {
    namespace MagicDOM {
        interface TreeLeave {
            tag?: keyof HTMLElementTagNameMap;
            classList?: string | string[];
            attribute?: Record<string, string | number>;
            children?: Record<string, TreeLeave> | string | HTMLElement | HTMLElement[];
        }
    }
}
export declare const magicDOM: {
    /**
        * Create a HTMLElement the easy way
        * @param       tagName             HTMLElement type
        * @param       prop                HTMLElement prop
        * @param       prop.id             HTMLElement id
        * @param       prop.classList      HTMLElement class list
        * @param       prop.attribute      HTMLElement attribute
        * @param       prop.child          HTMLElement child
        */
    createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, { id, classList, attribute, children }?: {
        id?: string;
        classList?: string | string[];
        attribute?: Record<string, string | number>;
        children?: string | HTMLElement | HTMLElement[];
    }): HTMLElementTagNameMap[K];
    createTree<K_1 extends keyof HTMLElementTagNameMap>(tag: K_1, classList?: string | string[], attribute?: Record<string, string | number>, children?: string | HTMLElement | HTMLElement[] | Record<string, MagicDOM.TreeLeave | HTMLElement>): HTMLElementTagNameMap[K_1] & {
        [key: string]: HTMLElement;
    };
    /**
    * empty node
    * @param { HTMLElement } node node to empty
    */
    emptyNode(node: HTMLElement): void;
    /** this function only return the first child */
    toHTMLElement<T extends HTMLElement>(htmlString: string): T;
};
export default magicDOM;
//# sourceMappingURL=magic-dom.d.ts.map