import type { Property } from "csstype"

import { Component, createRef, useReducer, useState } from "react"

import styles from "@styles/components/glasium.module.scss"

import { libraries, useRenderEffect } from "@ts/libraries"
import { $ } from "@ts/jquery"

/** */
export default class Glasium extends Component<
    Fukumi.GlasiumProps,
    Fukumi.GlasiumState
> {
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

    public static getDerivedStateFromProps(
        nextProps: Fukumi.GlasiumProps,
        prevState: Fukumi.GlasiumState
    ): null | Fukumi.GlasiumState {
        if (
            nextProps.colorOptions === prevState.colorOptions &&
            nextProps.count === prevState.count &&
            nextProps.rotate === prevState.rotate &&
            nextProps.scale === prevState.scale &&
            nextProps.shape === prevState.shape &&
            nextProps.speed === prevState.speed
        )
            return null

        return { ...prevState, ...nextProps }
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
                        backgroundColor:
                            this.state.colorOptions.backgroundColor,
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

function Shape({
    shape,
    colorOptions,
    scale,
    speed,
}: Fukumi.GlasiumShapeProps): JSX.Element {
    const [position, setPosition] = useState(0)
    const [state, dispatch] = useReducer<
        React.Reducer<Fukumi.GlasiumShapeState, Fukumi.GlasiumShapeAction>
    >(
        function (
            prevState: Fukumi.GlasiumShapeState,
            action: Fukumi.GlasiumShapeAction
        ): Fukumi.GlasiumShapeState {
            const randomScale: number =
                libraries.randomBetween(0.8, 2, false) * scale

            switch (action.type) {
                case "SHAPE_CHANGE":
                    return {
                        ...prevState,
                        shape:
                            action.newShape === "all"
                                ? libraries.randomItem(["triangle", "hexagon"])
                                : action.newShape,
                    }

                case "COLOR_OPTIONS_CHANGE":
                    return {
                        ...prevState,
                        brightness: libraries.randomBetween(
                            action.newColorOptions.shapeBrightnessScope[0],
                            action.newColorOptions.shapeBrightnessScope[1],
                            false,
                            [0.97, 1.03]
                        ),
                    }

                case "SCALE_CHANGE":
                    return {
                        ...prevState,
                        size: 45 * randomScale,
                    }

                case "SPEED_CHANGE":
                    const sp5s: number =
                        (libraries.randomBetween(0.67, 1.35, false) * 5) / speed

                    return {
                        ...prevState,
                        speedPerFiveSeconds: sp5s,
                        delay: libraries.randomBetween(
                            -sp5s / 2,
                            sp5s / 2,
                            false
                        ),
                    }

                default:
                    break
            }

            return prevState
        },
        {
            shape:
                shape === "all"
                    ? libraries.randomItem(["triangle", "hexagon"])
                    : shape,
            size: 0,
            brightness: 0,
            delay: 0,
            speedPerFiveSeconds: 0,
        }
    )

    useRenderEffect((): void => {
        setPosition(libraries.randomBetween(0, 100, false))
        dispatch({ type: "SCALE_CHANGE", newScale: scale })
        dispatch({ type: "SPEED_CHANGE", newSpeed: speed })
        dispatch({
            type: "COLOR_OPTIONS_CHANGE",
            newColorOptions: colorOptions,
        })
        dispatch({
            type: "COLOR_OPTIONS_CHANGE",
            newColorOptions: colorOptions,
        })
    }, [scale, speed, shape, colorOptions])

    return (
        <span
            className={styles[state.shape]}
            style={{
                backgroundColor: colorOptions.shapeColor,
                width: `${state.size}px`,
                height: `${state.size}px`,
                filter: `brightness(${state.brightness})`,
                left: `calc(${position}% - ${state.size}px / 2)`,
                animationDelay: `${state.delay}s`,
                animationDuration: `${state.speedPerFiveSeconds}s`,
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
            /** bigger scale is bigger shape */
            scale?: number
            /** the speed means how many times do the shape travel down-up/up-down in 5 seconds */
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

        interface GlasiumShapeState {
            shape: Exclude<GlasiumShape, "all">
            size: number
            brightness: number
            delay: number
            speedPerFiveSeconds: number
        }

        type GlasiumShapeAction =
            | { type: "SHAPE_CHANGE"; newShape: GlasiumShape }
            | {
                  type: "COLOR_OPTIONS_CHANGE"
                  newColorOptions: Omit<
                      GlasiumOptions,
                      "backgroundColor" | "textColor"
                  >
              }
            | { type: "SCALE_CHANGE"; newScale: number }
            | { type: "SPEED_CHANGE"; newSpeed: number }
    }
}
