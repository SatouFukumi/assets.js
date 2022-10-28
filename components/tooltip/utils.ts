import styles from "@styles/components/tooltip.module.scss"
import cursor from "@ts/cursor"

if (typeof window !== 'undefined')
    cursor.watch(true)

const duration: number = parseInt(styles.duration)

export const CONSTANT = {
    offset: 135,

    largeXAxis: 0.75,
    largeYAxis: 0.77,
    mouseOffsetX: 13,
    mouseOffsetY: 25,

    throttle: duration / 6 + 5,
    
    hideTimeout: duration - 200,
    deactivateTimeout: duration,
}
