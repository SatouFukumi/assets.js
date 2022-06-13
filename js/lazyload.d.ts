export declare class Lazyload {
    constructor(source?: string, { objectFit, classList }?: {
        objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
        classList?: string | string[];
    });
    component: HTMLElement;
    private image;
    private loadCover;
    private __src?;
    set source(src: string);
    get source(): string;
    updateSize(): void;
}
export default Lazyload;
//# sourceMappingURL=lazyload.d.ts.map