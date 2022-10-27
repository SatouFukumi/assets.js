import useStore from './store'
import cursor from "@ts/cursor"
import { useRenderEffect } from "@ts/hooks/use-render-effect"
import Container from "./container"
import clientSide from "@ts/client-side"

const Tooltip: React.FC = () => {
    const { padding, show, content } = useStore()

    useRenderEffect((): void => {
        if (clientSide.isMobile()) return
        cursor.watch(true)
    }, [])

    return (
        <Container
            padding={padding}
            show={show}
        >
            {content}
        </Container>
    )
}

export default Tooltip
