import { useCallback } from "react"
import useStore from "./use-store"
import clientSide from "@ts/client-side"

const Span: React.FC<Fukumi.TooltipSpanProps> = (props) => {
    const { tooltip, onPointerEnter, onPointerLeave, ...restProps } = props

    const setShow = useStore((state) => state.setShow)
    const setContent = useStore((state) => state.setContent)

    const handlePointerLeave = useCallback(
        function (event: React.PointerEvent<HTMLSpanElement>): void {
            if (!clientSide.isMobile()) setShow(false)

            onPointerLeave?.(event)
        },
        [onPointerLeave, setShow]
    )

    const handlePointerEnter = useCallback(
        function (event: React.PointerEvent<HTMLSpanElement>): void {
            if (!clientSide.isMobile()) {
                setContent(tooltip)
                setShow(true)
            }

            onPointerEnter?.(event)
        },
        [onPointerEnter, setContent, setShow, tooltip]
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
        }
    }
}
