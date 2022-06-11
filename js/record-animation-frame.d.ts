export declare class RecordAnimationFrame {
    private callback;
    constructor(callback: (...args: any[]) => any);
    private raf;
    private __running;
    get running(): boolean;
    /** start the callback */
    start(duration?: number): any;
    private run;
    /** stop the callback */
    stop(): any;
}
export default RecordAnimationFrame;
//# sourceMappingURL=record-animation-frame.d.ts.map