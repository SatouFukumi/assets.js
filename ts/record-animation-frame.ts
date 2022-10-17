export class RecordAnimationFrame {
    constructor(private callback: (...args: any[]) => any) {}

    private raf: number = -1
    private __running: boolean = false

    public get running(): boolean {
        return this.__running
    }

    /** start the callback */
    public start(duration?: number): any {
        if (this.__running) return
        this.__running = true

        this.run()

        if (duration) setTimeout((): void => this.stop(), duration)
    }

    private run(): any {
        if (typeof window === 'undefined') return
        
        this.raf = window.requestAnimationFrame((): void => {
            if (!this.callback) return

            this.callback()

            if (this.__running) this.run()
        })
    }

    /** stop the callback */
    public stop(): any {
        if (!this.__running || typeof window === 'undefined') return
        this.__running = false

        window.cancelAnimationFrame(this.raf)
    }
}

/** */
export default RecordAnimationFrame
