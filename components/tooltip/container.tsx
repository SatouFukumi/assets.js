import { useState, useMemo, useRef, useContext } from "react"
import { useResizeDetector } from "react-resize-detector"

import { TooltipContext, CONSTANT } from "./utils"
import { throttled, useRenderEffect } from "@ts/libraries"
import cursor from "@ts/cursor"
import RecordAnimationFrame from "@ts/record-animation-frame"
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
    const container: DOMRef = useRef(null)
    const content: DOMRef = useRef(null)

    const hideTimeoutID: TimeoutRef = useRef<Timeout>()
    const deactivateTimeoutId: TimeoutRef = useRef<Timeout>()

    /** local state */
    const [glow, setGlow] = useState(false)
    const [activated, setActivated] = useState(false)
    const [deactivated, setDeactivated] = useState(true)
    const { width, height } = useResizeDetector({ targetRef: content })

    /** this record is used to calculating position of the tooltip */
    const record: RecordAnimationFrame = useMemo(
        (): RecordAnimationFrame =>
            new RecordAnimationFrame(
                throttled((): void => {
                    if (!container.current) return

                    const { innerWidth, innerHeight } = window
                    const { offsetWidth, offsetHeight } = container.current
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
                    $(container.current).css({
                        "--position-x": posX,
                        "--position-y": posY,
                    })
                }, CONSTANT.throttle)
            ),
        [container]
    )

    /** display */
    useRenderEffect((): void | (() => void) => {
        if (show) {
            clearTimeout(deactivateTimeoutId.current)
            clearTimeout(hideTimeoutID.current)

            setActivated(true)
            setDeactivated(false)

            record.start()
        } else {
            record.start() /** the stop function fired when show changes, \
                               so, this is necessary */

            clearTimeout(deactivateTimeoutId.current)
            clearTimeout(hideTimeoutID.current)

            hideTimeoutID.current = setTimeout((): void => {
                setActivated(false)

                deactivateTimeoutId.current = setTimeout((): void => {
                    setContent("")
                    setDeactivated(true)

                    record.stop()
                }, CONSTANT.deactivateTimeout)
            }, CONSTANT.hideTimeout)
        }

        return (): void => {
            clearTimeout(deactivateTimeoutId.current)
            clearTimeout(hideTimeoutID.current)

            record.stop()
        }
    }, [show, container, content, record, setContent])

    return (
        <div
            ref={container}
            data-padding={padding}
            data-activated={activated}
            data-deactivated={deactivated}
            data-glow={glow}
            onAnimationEnd={(): void => setGlow(false)}
            className={styles.container}
            style={{ width, height }}
        >
            <div
                ref={content}
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
