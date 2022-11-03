import { useCallback } from "react"
import useStore from "./use-store"
import clientSide from "@ts/client-side"

const Div: React.FC<Fukumi.TooltipDivProps> = (props) => {
    const { tooltip, padding, onPointerEnter, onPointerLeave, ...restProps } = props

    const setShow = useStore((state) => state.setShow)
    const setContent = useStore((state) => state.setContent)
    const setPadding = useStore((state) => state.setPadding)

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
                setPadding(padding)
            }

            onPointerEnter?.(event)
        },
        [onPointerEnter, setContent, setShow, setPadding, tooltip, padding]
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
            padding?: boolean
        }
    }
}
