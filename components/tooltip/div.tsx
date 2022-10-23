import useStore from './store'
import clientSide from "@ts/client-side"

export default function Span(props: Fukumi.TooltipDivProps): JSX.Element {
    const { setShow, setPadding, setContent } = useStore()

    function onPointerEnter(event: React.PointerEvent<HTMLDivElement>): void {
        if (!clientSide.isMobile()) {
            setPadding(props.padding ?? true)
            setContent(props.tooltip)
            setShow(true)
        }

        props.onPointerEnter?.(event)
    }

    function onPointerLeave(event: React.PointerEvent<HTMLDivElement>): void {
        if (!clientSide.isMobile()) {
            setShow(false)
            setPadding(true)
        }

        props.onPointerLeave?.(event)
    }

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
        interface TooltipDivProps extends React.HTMLAttributes<HTMLDivElement> {
            tooltip: Fukumi.TooltipContent
            padding?: boolean
        }
    }
}
