import { useState } from "react"

import cursor from "@ts/cursor"
import { useRenderEffect } from "@ts/libraries"
import Container from "./container"
import { TooltipContext } from "./utils"
import clientSide from "@ts/client-side"

export default function Tooltip({
    children,
}: Fukumi.TooltipProps): JSX.Element {
    const [content, setContent] = useState<Fukumi.TooltipContent>(<></>)
    const [padding, setPadding] = useState<boolean>(true)
    const [show, setShow] = useState(false)

    useRenderEffect((): void => {
        if (clientSide.isMobile()) return
        cursor.watch(true)
    }, [])

    return (
        <TooltipContext.Provider value={{ setContent, setPadding, setShow }}>
            <Container
                padding={padding}
                show={show}
            >
                {content}
            </Container>

            {children}
        </TooltipContext.Provider>
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
