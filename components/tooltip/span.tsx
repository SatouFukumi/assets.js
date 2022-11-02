import { useCallback } from "react"
import useStore from "./use-store"
import clientSide from "@ts/client-side"

const Span: React.FC<Fukumi.TooltipSpanProps> = (props) => {
    const { padding, tooltip, onPointerEnter, onPointerLeave, ...restProps } = props

    const setShow = useStore((state) => state.setShow)
    const setPadding = useStore((state) => state.setPadding)
    const setContent = useStore((state) => state.setContent)

    const handlePointerLeave = useCallback(
        function (event: React.PointerEvent<HTMLSpanElement>): void {
            if (!clientSide.isMobile()) {
                setShow(false)
                setPadding(true)
            }

            onPointerLeave?.(event)
        },
        [onPointerLeave, setPadding, setShow]
    )

    const handlePointerEnter = useCallback(
        function (event: React.PointerEvent<HTMLSpanElement>): void {
            if (!clientSide.isMobile()) {
                setPadding(padding ?? true)
                setContent(tooltip)
                setShow(true)
            }

            onPointerEnter?.(event)
        },
        [onPointerEnter, setContent, setPadding, setShow, tooltip, padding]
    )

    return (
        <span
            {...restProps}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        />
    )
}

export default Span

declare global {
    namespace Fukumi {
        interface TooltipSpanProps extends React.HTMLAttributes<HTMLSpanElement> {
            tooltip: React.ReactNode
            padding?: boolean
        }
    }
}
