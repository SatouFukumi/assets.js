import { useCallback } from "react"
import useStore from "./use-store"
import clientSide from "@ts/client-side"

const Span: React.FC<Fukumi.TooltipSpanProps> = (props) => {
    const { tooltip, padding, onPointerEnter, onPointerLeave, ...restProps } = props

    const setShow = useStore((state) => state.setShow)
    const setContent = useStore((state) => state.setContent)
    const setPadding = useStore((state) => state.setPadding)

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
                setPadding(padding)
            }

            onPointerEnter?.(event)
        },
        [onPointerEnter, setContent, setShow, setPadding, tooltip, padding]
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
