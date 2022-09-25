export const cursor = {
    positionX: 0,
    positionY: 0,
    deltaX: 0,
    deltaY: 0,
    isWatching: false,
    alwaysOn: false,

    watch(alwaysOn: boolean = false): void {
        if (this.alwaysOn || this.isWatching || typeof window === "undefined")
            return

        this.isWatching = true
        this.alwaysOn = alwaysOn

        window.addEventListener("mousemove", this.__update)
    },

    stop(): void {
        if (this.alwaysOn || !this.isWatching || typeof window === "undefined")
            return

        window.removeEventListener("mousemove", this.__update)
    },

    __update(event: MouseEvent): void {
        cursor.positionX = event.clientX
        cursor.positionY = event.clientY
        cursor.deltaX = event.movementX
        cursor.deltaY = event.movementY
    },
}

export default cursor
