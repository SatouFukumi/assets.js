import { useState, useRef, useContext, useEffect } from "react"
import $ from "jquery"

import useStore from './store'
import { CONSTANT } from "./utils"
import { throttled } from "@ts/libraries"
import { useRequestAnimationFrame, useResizeObserver } from "@ts/hooks"
import cursor from "@ts/cursor"

import styles from "@styles/components/tooltip.module.scss"

export default function Container({
    children,
    padding,
    show,
}: Fukumi.TooltipContainerProps): JSX.Element {
    type Timeout = NodeJS.Timeout | undefined
    type TimeoutRef = React.MutableRefObject<NodeJS.Timeout | undefined>
    type DivRef = React.RefObject<HTMLDivElement>

    /** */
    const setContent = useStore((state) => state.setContent)

    /** refs */
    const containerRef: DivRef = useRef(null)
    const contentRef: DivRef = useRef(null)

    const hideTimeoutIDRef: TimeoutRef = useRef<Timeout>()
    const deactivateTimeoutIdRef: TimeoutRef = useRef<Timeout>()

    /** local state */
    const [activated, setActivated] = useState(false)
    const [deactivated, setDeactivated] = useState(true)

    /** watch width and height */
    const { width, height } = useResizeObserver({
        ref: contentRef,
        throttle: CONSTANT.throttle,
    })

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
    useEffect((): void | (() => void) => {
        if (show) {
            clearTimeout(deactivateTimeoutIdRef.current)
            clearTimeout(hideTimeoutIDRef.current)

            setActivated(true)
            setDeactivated(false)

            start()
        } else {
            start() // the `stop` function fires when `show` changes,
                    // so, this is necessary

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, containerRef, contentRef, setContent])

    return (
        <div
            ref={containerRef}
            data-padding={padding}
            data-activated={activated}
            data-deactivated={deactivated}
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
            children: React.ReactNode | string | number | boolean
            padding: boolean
            show: boolean
        }
    }
}
