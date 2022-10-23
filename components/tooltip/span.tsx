import clientSide from "@ts/client-side"
import useStore from './store'

export default function Span(props: Fukumi.TooltipSpanProps): JSX.Element {
    const { setShow, setPadding, setContent } = useStore()

    function onPointerEnter(event: React.PointerEvent<HTMLSpanElement>): void {
        if (!clientSide.isMobile()) {
            setPadding(props.padding ?? true)
            setContent(props.tooltip)
            setShow(true)
        }

        props.onPointerEnter?.(event)
    }

    function onPointerLeave(event: React.PointerEvent<HTMLSpanElement>): void {
        if (!clientSide.isMobile()) {
            setShow(false)
            setPadding(true)
        }

        props.onPointerLeave?.(event)
    }

    return (
        <span
            {...props}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        />
    )
}

declare global {
    namespace Fukumi {
        interface TooltipSpanProps
            extends React.HTMLAttributes<HTMLSpanElement> {
            tooltip: Fukumi.TooltipContent
            padding?: boolean
        }
    }
}
