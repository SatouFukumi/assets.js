import styles from "@styles/components/glasium.module.scss"
import { useResizeObserver } from "@ts/hooks/use-observer"
import { useRenderEffect } from "@ts/hooks/use-render-effect"
import { useRef } from "react"
import Shape from "./shape"
import useStore from "./store"

const Glasium: React.FC<Fukumi.GlasiumProps> = (props) => {
    const set = useStore((state) => state.set)
    useRenderEffect(() => set(props), [props])

    const ref = useRef(null)
    const { height } = useResizeObserver({ ref })

    // get props from store
    const { colorOptions, rotate, count } = useStore()

    return (
        <div
            ref={ref}
            className={styles.container}
            style={
                {
                    backgroundColor: colorOptions.backgroundColor,
                    "--rotation": rotate ? "360deg" : "0deg",
                    "--background-height": `${height}px`,
                } as React.CSSProperties
            }
        >
            {[...new Array(count)].map(
                (_value: any, index: number): JSX.Element => (
                    <Shape key={index} />
                )
            )}
        </div>
    )
}

export default Glasium

declare global {
    namespace Fukumi {
        interface GlasiumProps {
            shape?: 'triangle' | 'all' | 'hexagon'
            
            colorOptions?: {
                backgroundColor: string
                shapeColor: string

                // [min, max]
                shapeBrightnessScope: number[]
            }

            // bigger scale is bigger shape
            scale?: number

            // speed means how many times do the shape travel
            // down-up/up-down in 5 seconds
            speed?: number

            count?: number
            rotate?: boolean
        }
    }
}
