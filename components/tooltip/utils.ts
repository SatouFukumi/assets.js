import styles from "./tooltip.module.scss"
import { throttled, cursor } from "@fukumi/libraries"

if (typeof window !== "undefined") cursor.watch(true)

const DURATION: number = parseInt(styles.duration)
export const CONSTANT = {
  offset: 135,

  largeXAxis: 0.75,
  largeYAxis: 0.77,
  mouseOffsetX: 13,
  mouseOffsetY: 25,

  throttle: DURATION / 6 + 5,

  hideTimeout: DURATION - 200,
  deactivateTimeout: DURATION,
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

    const root = document.querySelector("html")
    root?.style.setProperty("--fukumi-tooltip-position-x", `${posX}px`)
    root?.style.setProperty("--fukumi-tooltip-position-y", `${posY}px`)
  },
  CONSTANT.throttle
)
