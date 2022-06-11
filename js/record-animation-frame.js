export class RecordAnimationFrame {
    constructor(callback) {
        this.callback = callback;
        this.raf = -1;
        this.__running = false;
    }
    get running() { return this.__running; }
    /** start the callback */
    start(duration) {
        if (this.__running)
            return;
        this.__running = true;
        this.run();
        if (duration)
            window.setTimeout(() => this.stop(), duration);
    }
    run() {
        this.raf = window.requestAnimationFrame(() => {
            if (!this.callback)
                return;
            this.callback();
            if (this.__running)
                this.run();
        });
    }
    /** stop the callback */
    stop() {
        if (!this.__running)
            return;
        this.__running = false;
        window.cancelAnimationFrame(this.raf);
    }
}
export default RecordAnimationFrame;
