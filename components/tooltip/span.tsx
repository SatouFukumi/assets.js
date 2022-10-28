import { useCallback } from "react"
import useStore from "./use-store"
import clientSide from "@ts/client-side"

const Span: React.FC<Fukumi.TooltipSpanProps> = (props) => {
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
        <span
            {...props}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        />
    )
}

export default Span

declare global {
    namespace Fukumi {
        interface TooltipSpanProps extends React.HTMLAttributes<HTMLSpanElement> {
            tooltip: React.ReactNode | string | number | boolean
            padding?: boolean
        }
    }
}
