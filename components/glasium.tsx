import type { Property } from "csstype"

import { Component, createRef, useEffect, useLayoutEffect, useState } from "react"

import styles from "@styles/components/glasium.module.scss"

import { libraries } from "@ts/libraries"
import { $ } from "@ts/jquery"

/** */
export default class Glasium extends Component<Fukumi.GlasiumProps, Fukumi.GlasiumState> {
    private ref: Fukumi.GlasiumRef = {
        container: createRef<HTMLDivElement>(),
    }

    public state: Fukumi.GlasiumState = {
        colorOptions: this.props.colorOptions ?? COLOR.blue,
        count: this.props.count ?? 10,
        height: 0,
        rotate: this.props.rotate ?? false,
        scale: this.props.scale ?? 2,
        shape: this.props.shape ?? "triangle",
        speed: this.props.speed ?? 6,
    }

    private observer?: ResizeObserver

    public componentDidMount(): void {
        if (!this.ref.container.current?.parentElement) return

        /** resize observer */
        this.observer = new ResizeObserver((): void => {
            if (!this.ref.container.current) return
            this.setState({ height: this.ref.container.current.offsetHeight })
        })
        this.observer.observe(this.ref.container.current)

        /** css parent */
        $(this.ref.container.current.parentElement).css({
            position: "relative",
            color: this.state.colorOptions.textColor,
        })
    }

    public componentWillUnmount(): void {
        if (!this.ref.container.current) return
        this.observer?.disconnect()
    }

    public render(): React.ReactNode {
        return (
            <div
                ref={this.ref.container}
                className={styles.container}
                style={
                    {
                        backgroundColor: this.state.colorOptions.backgroundColor,
                        color: this.state.colorOptions.textColor,
                        "--rotation": this.state.rotate ? "360deg" : "0deg",
                        "--background-height": `${this.state.height}px`,
                    } as React.CSSProperties
                }
            >
                {[...new Array(this.state.count)].map(
                    (_value: any, index: number): JSX.Element => (
                        <Shape
                            key={index}
                            shape={this.state.shape}
                            scale={this.state.scale}
                            speed={this.state.speed}
                            colorOptions={this.state.colorOptions}
                        />
                    )
                )}
            </div>
        )
    }
}

function Shape(props: Fukumi.GlasiumShapeProps): JSX.Element {
    const [shape, setShape] = useState<Fukumi.GlasiumShape>(props.shape)
    const [brightness, setBrightness] = useState(0)
    const [position, setPosition] = useState(0)
    const [color, setColor] = useState<Property.BackgroundColor>()
    const [size, setSize] = useState(0)
    const [delay, setDelay] = useState(0)
    const [speedPerFiveSeconds, setSpeedPerFiveSeconds] = useState(0)

    useLayoutEffect((): void => {
        let randomScale: number = libraries.randomBetween(0.8, 2, false) * props.scale

        setShape(props.shape === "all" ? libraries.randomItem(SHAPE) : props.shape)
        setSize(45 * randomScale)
        setColor(props.colorOptions.shapeColor)
        setPosition(libraries.randomBetween(0, 100, false))
        setBrightness(
            libraries.randomBetween(
                props.colorOptions.shapeBrightnessScope[0],
                props.colorOptions.shapeBrightnessScope[1],
                false,
                [0.97, 1.03]
            )
        )
        setSpeedPerFiveSeconds(
            (libraries.randomBetween(0.67, 1.35, false) * 5) / props.speed
        )
        setDelay(
            libraries.randomBetween(
                -speedPerFiveSeconds / 2,
                speedPerFiveSeconds / 2,
                false
            )
        )
    }, [props])

    return (
        <span
            className={styles[shape]}
            style={{
                backgroundColor: color,
                width: `${size}px`,
                height: `${size}px`,
                filter: `brightness(${brightness})`,
                left: `calc(${position}% - ${size}px / 2)`,
                animationDelay: `${delay}s`,
                animationDuration: `${speedPerFiveSeconds}s`,
            }}
        />
    )
}

/** default brightness template */
export const BRIGHTNESS_SCOPE: Readonly<{
    dark: Fukumi.GlasiumOptions["shapeBrightnessScope"]
    light: Fukumi.GlasiumOptions["shapeBrightnessScope"]
    other: Fukumi.GlasiumOptions["shapeBrightnessScope"]
}> = Object.freeze({
    dark: [1.14, 1.3],
    light: [0.94, 1.05],
    other: [0.9, 1.2],
})

/** default shape */
export const SHAPE: Fukumi.GlasiumShape[] = ["triangle", "hexagon"]

/** default color template */
export const COLOR: Readonly<{
    blue: Fukumi.GlasiumOptions
    red: Fukumi.GlasiumOptions
    grey: Fukumi.GlasiumOptions
    green: Fukumi.GlasiumOptions
    pink: Fukumi.GlasiumOptions
    darkred: Fukumi.GlasiumOptions
    orange: Fukumi.GlasiumOptions
    navyblue: Fukumi.GlasiumOptions
    whitesmoke: Fukumi.GlasiumOptions
    lightblue: Fukumi.GlasiumOptions
    dark: Fukumi.GlasiumOptions
    yellow: Fukumi.GlasiumOptions
    purple: Fukumi.GlasiumOptions
}> = Object.freeze({
    blue: {
        backgroundColor: "#44aadd",
        shapeColor: "#44aadd",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    red: {
        backgroundColor: "#fb3852",
        shapeColor: "hsl(352, 85%, 50%)",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    grey: {
        backgroundColor: "#485e74",
        shapeColor: "#485e74",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    green: {
        backgroundColor: "#38e538",
        shapeColor: "#38e538",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    pink: {
        backgroundColor: "#ff66aa",
        shapeColor: "#ff66aa",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    darkred: {
        backgroundColor: "#c52339",
        shapeColor: "#c52339",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.dark,
    },
    orange: {
        backgroundColor: "#ffa502",
        shapeColor: "#ffa502",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    navyblue: {
        backgroundColor: "#333d79",
        shapeColor: "#333d79",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    whitesmoke: {
        backgroundColor: "#f6f6f6",
        shapeColor: "#f6f6f6",
        textColor: "rgb(28, 28, 28)",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.light,
    },
    lightblue: {
        backgroundColor: "#b9e8fd",
        shapeColor: "#b9e8fd",
        textColor: "rgb(28, 28, 28)",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.light,
    },
    dark: {
        backgroundColor: "#1e1e1e",
        shapeColor: "#242424",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.dark,
    },
    yellow: {
        backgroundColor: "#ffc414",
        shapeColor: "#fccc3de6",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
    purple: {
        backgroundColor: "rgb(95, 57, 155)",
        shapeColor: "rgb(95, 57, 155)",
        textColor: "whitesmoke",
        shapeBrightnessScope: BRIGHTNESS_SCOPE.other,
    },
})

/** global typing */
declare global {
    export namespace Fukumi {
        interface GlasiumProps {
            shape?: GlasiumShape
            colorOptions?: GlasiumOptions
            scale?: number
            speed?: number
            count?: number
            rotate?: boolean
        }

        interface GlasiumState extends Required<GlasiumProps> {
            height: number
        }

        interface GlasiumRef {
            container: React.RefObject<HTMLDivElement>
        }

        interface GlasiumOptions {
            backgroundColor: Property.BackgroundColor
            shapeColor: Property.BackgroundColor
            textColor: Property.Color
            shapeBrightnessScope: [number, number]
        }

        interface GlasiumShapeProps {
            shape: GlasiumShape
            scale: number
            speed: number
            colorOptions: Omit<GlasiumOptions, "backgroundColor" | "textColor">
        }

        type GlasiumShape = "triangle" | "hexagon" | "all"
    }
}
