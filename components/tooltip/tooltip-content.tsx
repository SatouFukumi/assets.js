import styles from "@styles/components/tooltip.module.scss"
import { useResizeCallback } from "@ts/hooks/use-observer"
import { memo, useRef } from "react"
import useStore from "./use-store"
import { CONSTANT } from "./utils"

const TooltipContent: React.FC = () => {
    // store
    const content = useStore((state) => state.content)
    const setSize = useStore((state) => state.setSize)

    // ref
    const contentRef = useRef<HTMLDivElement>(null)

    // watch width and height
    useResizeCallback({
        ref: contentRef,
        throttle: CONSTANT.throttle,
        options: { box: "border-box" },
        onResize(entry) {
            const { blockSize, inlineSize } = entry.borderBoxSize[0]
            setSize({ width: inlineSize, height: blockSize })
        },
    })

    return (
        <div
            ref={contentRef}
            className={styles.content}
        >
            {content}
        </div>
    )
}

export default memo(TooltipContent)
