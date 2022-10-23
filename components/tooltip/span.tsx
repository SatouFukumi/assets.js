import { useCallback } from "react"

import useStore from "./store"
import clientSide from "@ts/client-side"

export default function Span(props: Fukumi.TooltipSpanProps): JSX.Element {
    const { setShow, setPadding, setContent } = useStore()

    const onPointerLeave = useCallback(
        function (event: React.PointerEvent<HTMLSpanElement>): void {
            if (!clientSide.isMobile()) {
                setShow(false)
                setPadding(true)
            }

            props.onPointerLeave?.(event)
        },
        [props, setPadding, setShow]
    )

    const onPointerEnter = useCallback(
        function (event: React.PointerEvent<HTMLSpanElement>): void {
            if (!clientSide.isMobile()) {
                setPadding(props.padding ?? true)
                setContent(props.tooltip)
                setShow(true)
            }

            props.onPointerEnter?.(event)
        },
        [props, setContent, setPadding, setShow]
    )

    return (
        <div
            {...props}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        />
    )
}

declare global {
    namespace Fukumi {
        interface TooltipSpanProps extends React.HTMLAttributes<HTMLSpanElement> {
            tooltip: React.ReactNode | string | number | boolean
            padding?: boolean
        }
    }
}
