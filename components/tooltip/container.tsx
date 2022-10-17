import { useState, useMemo, useRef, useContext } from "react"

import { TooltipContext, CONSTANT } from "./utils"
import { throttled } from "@ts/libraries"
import {
    useRenderEffect,
    useRequestAnimationFrame,
    useResizeObserver,
} from "@ts/hooks"
import cursor from "@ts/cursor"
import { $ } from "@ts/jquery"

import styles from "@styles/components/tooltip.module.scss"

export default function Container({
    children,
    padding,
    show,
}: Fukumi.TooltipContainerProps): JSX.Element {
    type Timeout = NodeJS.Timeout | undefined
    type TimeoutRef = React.MutableRefObject<Timeout>
    type DOMRef = React.RefObject<HTMLDivElement>

    /** */
    const { setContent } = useContext(TooltipContext)

    /** refs */
    const containerRef: DOMRef = useRef(null)
    const contentRef: DOMRef = useRef(null)

    const hideTimeoutIDRef: TimeoutRef = useRef<Timeout>()
    const deactivateTimeoutIdRef: TimeoutRef = useRef<Timeout>()

    /** local state */
    const [glow, setGlow] = useState(false)
    const [activated, setActivated] = useState(false)
    const [deactivated, setDeactivated] = useState(true)
    const { width, height } = useResizeObserver({ ref: contentRef })

    /** this record is used to calculating position of the tooltip */
    const { start, stop } = useRequestAnimationFrame(
        throttled((): void => {
            if (!containerRef.current) return

            const { innerWidth, innerHeight } = window
            const { offsetWidth, offsetHeight } = containerRef.current
            const { positionX, positionY } = cursor

            const isOverflowedX: boolean
                = innerWidth * CONSTANT.largeXAxis < positionX
            const isOverflowedY: boolean
                = innerHeight * CONSTANT.largeYAxis < positionY
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

            /** using state for this is not good, because setState will
             *  make this extremely glitchy */
            $(containerRef.current).css({
                "--position-x": posX,
                "--position-y": posY,
            })
        }, CONSTANT.throttle)
    )

    /** display */
    useRenderEffect((): void | (() => void) => {
        if (show) {
            clearTimeout(deactivateTimeoutIdRef.current)
            clearTimeout(hideTimeoutIDRef.current)

            setActivated(true)
            setDeactivated(false)

            start()
        } else {
            start() /** the stop function fired when show changes, \
                               so, this is necessary */

            clearTimeout(deactivateTimeoutIdRef.current)
            clearTimeout(hideTimeoutIDRef.current)

            hideTimeoutIDRef.current = setTimeout((): void => {
                setActivated(false)

                deactivateTimeoutIdRef.current = setTimeout((): void => {
                    setContent("")
                    setDeactivated(true)

                    stop()
                }, CONSTANT.deactivateTimeout)
            }, CONSTANT.hideTimeout)
        }

        return (): void => {
            clearTimeout(deactivateTimeoutIdRef.current)
            clearTimeout(hideTimeoutIDRef.current)

            stop()
        }
    }, [show, containerRef, contentRef, start, stop, setContent])

    return (
        <div
            ref={containerRef}
            data-padding={padding}
            data-activated={activated}
            data-deactivated={deactivated}
            data-glow={glow}
            onAnimationEnd={(): void => setGlow(false)}
            className={styles.container}
            style={{ width, height }}
        >
            <div
                ref={contentRef}
                className={styles.content}
            >
                {children}
            </div>
        </div>
    )
}

declare global {
    namespace Fukumi {
        interface TooltipContainerProps {
            children: Fukumi.TooltipContent
            padding: boolean
            show: boolean
        }
    }
}
