import { useRef, useEffect, memo } from "react"
import $ from "jquery"
import useStore from "./use-store"
import { CONSTANT } from "./utils"
import { throttled } from "@ts/libraries"
import { useRequestAnimationFrame, useResizeCallback } from "@ts/hooks"
import cursor from "@ts/cursor"
import styles from "@styles/components/tooltip.module.scss"

const Tooltip: React.FC = () => {
    type Timeout = NodeJS.Timeout | undefined
    type TimeoutRef = React.MutableRefObject<NodeJS.Timeout | undefined>
    type DivRef = React.RefObject<HTMLDivElement>

    /** store */
    const show = useStore((state) => state.show)
    const content = useStore((state) => state.content)
    const setContent = useStore((state) => state.setContent)

    /** refs */
    const containerRef: DivRef = useRef(null)
    const contentRef: DivRef = useRef(null)

    const hideTimeoutIDRef: TimeoutRef = useRef<Timeout>()
    const deactivateTimeoutIdRef: TimeoutRef = useRef<Timeout>()

    /** watch width and height */
    useResizeCallback({
        ref: contentRef,
        throttle: CONSTANT.throttle,
        onResize: (entry) => {
            if (!containerRef.current) return

            const width = entry.borderBoxSize[0].inlineSize
            const height = entry.borderBoxSize[0].blockSize

            $(containerRef.current).css({
                "--width": width,
                "--height": height,
            })
        },
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

            $(containerRef.current!).attr({
                'data-activated': true,
                'data-deactivated': false
            })

            start()
        } else {
            start()

            clearTimeout(deactivateTimeoutIdRef.current)
            clearTimeout(hideTimeoutIDRef.current)
            
            hideTimeoutIDRef.current = setTimeout((): void => {
                $(containerRef.current!).attr({ 'data-activated': false })
                
                deactivateTimeoutIdRef.current = setTimeout((): void => {
                    $(containerRef.current!).attr({ 'data-deactivated': true })
                    setContent(null)

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
    }, [show])

    return (
        <div
            ref={containerRef}
            className={styles.container}
        >
            <div
                ref={contentRef}
                className={styles.content}
            >
                {content}
            </div>
        </div>
    )
}

export default memo(Tooltip)
