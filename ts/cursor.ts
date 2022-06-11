export const cursor = {
    positionX: (typeof window !== 'undefined') ? window.innerWidth / 2 : 500,
    positionY: (typeof window !== 'undefined') ? window.innerHeight / 2 : 500,
    deltaX: 0,
    deltaY: 0,
    isWatching: false,
    alwaysOn: false,

    watch(alwaysOn: boolean = false): void {
        if (this.isWatching) return
        this.isWatching = true

        this.alwaysOn = alwaysOn

        window.addEventListener('mousemove', this.__update)
    },

    stop(): void {
        if (this.alwaysOn) return
        if (!this.isWatching) return

        window.removeEventListener('mousemove', this.__update)
    },

    __update(event: MouseEvent): void {
        cursor.positionX = event.clientX
        cursor.positionY = event.clientY
        cursor.deltaX = event.movementX
        cursor.deltaY = event.movementY
    }
}


export default cursor
