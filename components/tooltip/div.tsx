import { useCallback } from "react"
import useStore from "./store"
import clientSide from "@ts/client-side"

const Div: React.FC<Fukumi.TooltipDivProps> = (props) => {
    const { setShow, setPadding, setContent } = useStore()

    const onPointerLeave = useCallback(
        function (event: React.PointerEvent<HTMLDivElement>): void {
            if (!clientSide.isMobile()) {
                setShow(false)
                setPadding(true)
            }

            props.onPointerLeave?.(event)
        },
        [props, setPadding, setShow]
    )

    const onPointerEnter = useCallback(
        function (event: React.PointerEvent<HTMLDivElement>): void {
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

export default Div

declare global {
    namespace Fukumi {
        interface TooltipDivProps extends React.HTMLAttributes<HTMLDivElement> {
            tooltip: React.ReactNode | string | number | boolean
            padding?: boolean
        }
    }
}
