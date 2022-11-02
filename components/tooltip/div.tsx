import { useCallback } from "react"
import useStore from "./use-store"
import clientSide from "@ts/client-side"

const Div: React.FC<Fukumi.TooltipDivProps> = (props) => {
    const { tooltip, onPointerEnter, onPointerLeave, ...restProps } = props

    const setShow = useStore((state) => state.setShow)
    const setContent = useStore((state) => state.setContent)

    const handlePointerLeave = useCallback(
        function (event: React.PointerEvent<HTMLDivElement>): void {
            if (!clientSide.isMobile()) setShow(false)

            onPointerLeave?.(event)
        },
        [onPointerLeave, setShow]
    )

    const handlePointerEnter = useCallback(
        function (event: React.PointerEvent<HTMLDivElement>): void {
            if (!clientSide.isMobile()) {
                setContent(tooltip)
                setShow(true)
            }

            onPointerEnter?.(event)
        },
        [onPointerEnter, setContent, setShow, tooltip]
    )

    return (
        <div
            {...restProps}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        />
    )
}

export default Div

declare global {
    namespace Fukumi {
        interface TooltipDivProps extends React.HTMLAttributes<HTMLDivElement> {
            tooltip: React.ReactNode
        }
    }
}
