import useStore from './store'
import cursor from "@ts/cursor"
import { useRenderEffect } from "@ts/hooks/use-render-effect"
import Container from "./container"
import clientSide from "@ts/client-side"

export default function Tooltip({
    children,
}: Fukumi.TooltipProps): JSX.Element {
    const { padding, show, content } = useStore()

    useRenderEffect((): void => {
        if (clientSide.isMobile()) return
        cursor.watch(true)
    }, [])

    return (
        <>
            <Container
                padding={padding}
                show={show}
            >
                {content}
            </Container>

            {children}
        </>
    )
}

declare global {
    namespace Fukumi {
        interface TooltipProps {
            children: React.ReactNode
        }

        type TooltipContent = React.ReactNode | string | number | boolean
    }
}
