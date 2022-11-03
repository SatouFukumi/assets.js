import styles from "@styles/components/tooltip.module.scss"
import $ from 'jquery'
import cursor from "@ts/cursor"
import { throttled } from "@ts/libraries"

if (typeof window !== "undefined") cursor.watch(true)

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

export const updateTooltipPosition: (container: HTMLDivElement) => void = throttled(
    (container: HTMLDivElement) => {
        const { innerWidth, innerHeight } = window
        const { offsetWidth, offsetHeight } = container
        const { positionX, positionY } = cursor

        const isOverflowedX: boolean = innerWidth * CONSTANT.largeXAxis < positionX
        const isOverflowedY: boolean = innerHeight * CONSTANT.largeYAxis < positionY
        const isLargerThanScreenX: boolean
            = innerWidth - offsetWidth - CONSTANT.offset < positionX
        const isLargerThanScreenY: boolean
            = innerWidth - offsetHeight - CONSTANT.offset < positionY

        const posX: number
            = isOverflowedX || isLargerThanScreenX
                ? positionX - offsetWidth - CONSTANT.mouseOffsetX
                : positionX + CONSTANT.mouseOffsetX

        const posY: number
            = isOverflowedY || isLargerThanScreenY
                ? positionY - offsetHeight - CONSTANT.mouseOffsetY
                : positionY + CONSTANT.mouseOffsetY

        $(":root").css({
            "--fukumi-tooltip-position-x": posX,
            "--fukumi-tooltip-position-y": posY,
        })
    },
    CONSTANT.throttle
)
