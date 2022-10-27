import styles from "@styles/components/glasium.module.scss"
import { useAsync } from "@ts/hooks/use-async"
import { libraries } from "@ts/libraries"
import useStore from "./store"

const Shape: React.FC = () => {
    const { shape, colorOptions, speed, scale } = useStore()

    const { data: state } = useAsync(async () => {
        const randomScale: number
            = libraries.randomBetween(0.8, 2, { toInt: false }) * scale

        const s
            = shape === "all" ? libraries.randomItem(["triangle", "hexagon"]) : shape

        const sp5s
            = (libraries.randomBetween(0.67, 1.35, { toInt: false }) * 5) / speed

        const delay = libraries.randomBetween(-sp5s / 2, sp5s / 2, {
            toInt: false,
        })

        return {
            shape: s,
            position: libraries.randomBetween(0, 100, { toInt: false }),
            brightness: libraries.randomBetween(
                colorOptions.shapeBrightnessScope[0],
                colorOptions.shapeBrightnessScope[1],
                { toInt: false, outerRange: [0.97, 1.03] }
            ),
            speedPerFiveSeconds: sp5s,
            delay,
            size: 45 * randomScale,
        }
    }, [scale, speed, shape, colorOptions])

    if (!state) return <span />

    return (
        <span
            className={styles[state.shape]}
            style={{
                backgroundColor: colorOptions.shapeColor,
                width: `${state.size}px`,
                height: `${state.size}px`,
                filter: `brightness(${state.brightness})`,
                left: `calc(${state.position}% - ${state.size}px / 2)`,
                animationDelay: `${state.delay}s`,
                animationDuration: `${state.speedPerFiveSeconds}s`,
            }}
        />
    )
}

export default Shape

declare global {
    namespace Fukumi {
        interface GlasiumShapeState {
            shape: "triangle" | "hexagon"
            size: number
            brightness: number
            delay: number
            speedPerFiveSeconds: number
        }

        type GlasiumShapeAction =
            | { type: "SHAPE_CHANGE"; newShape: "triangle" | "hexagon" | "all" }
            | {
                  type: "COLOR_OPTIONS_CHANGE"
                  newColorOptions: Exclude<GlasiumProps["colorOptions"], undefined>
              }
            | { type: "SCALE_CHANGE"; newScale: number }
            | { type: "SPEED_CHANGE"; newSpeed: number }
    }
}
