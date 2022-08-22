import { $ } from "@ts/jquery"
import { libraries } from "../ts/libraries"
import magicDOM from "../ts/magic-dom"

// export class Glasium {
//     private static shape(
//         background: HTMLElement,
//         {
//             shape = "triangle",
//             count = 10,
//             color = COLOR.BLUE,
//             scale = 2,
//             speed = 2,
//         }: Glasium.Option
//     ): void {
//         for (let i: number = 0; i < count; ++i) {
//             /** insert shape */
//             const shapeType: Glasium.Shape =
//                 shape === "all" ? library.randomItem(SHAPES) : shape

//             const item: HTMLElement = magicDOM.createElement("div", {
//                 classList: `glasium__shape--${shapeType}`,
//             })

//             background.append(item)

//             /** css value */
//             let randomScale: number =
//                 library.randomBetween(0.4, 2, false) * scale
//             let randomBrightness: number = library.randomBetween(
//                 color.brightness[0],
//                 color.brightness[1],
//                 false,
//                 [0.97, 1.03]
//             )
//             let size: number = 26 * randomScale
//             let position: number = library.randomBetween(0, 100, false)
//             let speedPerFiveSeconds: number =
//                 (library.randomBetween(0.67, 1.35, false) * 5) / speed
//             let delay: number = library.randomBetween(
//                 -speedPerFiveSeconds / 2,
//                 speedPerFiveSeconds / 2,
//                 false
//             )

//             /** css */
//             $(item).css({
//                 "--size": `${size}px`,
//                 "--brightness": randomBrightness,
//                 left: `calc(${position}% - ${size}px / 2)`,
//                 animationDelay: `${delay}s`,
//                 animationDuration: `${speedPerFiveSeconds}s`,
//             })
//         }
//     }

//     private static background(
//         element: HTMLElement,
//         {
//             shape = "triangle",
//             color = COLOR.BLUE,
//             scale = 2,
//             speed = 2,
//             count = 10,
//             rotate = false,
//         }: Glasium.Option
//     ): void {
//         /** insert background */
//         const background: HTMLDivElement = magicDOM.createElement("div", {
//             classList: "glasium__background",
//         })

//         element.appendChild(background)

//         /** css for the background and element */
//         $(background).css({
//             "--background-color": color.background,
//             "--rotation": rotate ? "360deg" : "0deg",
//             "--shape-color": color.shape,
//             "--background-height": `${background.offsetHeight}px`,
//         })

//         element.style.color = color.invertContrast
//             ? "var(--color-light)"
//             : "var(--color-dark)"

//         /** watch size */
//         new ResizeObserver((): void => {
//             $(background).css(
//                 "--background-height",
//                 `${background.offsetHeight}px`
//             )
//         }).observe(background)

//         /** fill the background with shapes */
//         this.shape(background, { shape, scale, color, speed, count })
//     }

//     /**
//      * {@linkcode Glasium.Option}
//      *
//      * @param       element                     element
//      * @param       options.shape               shape inside the background
//      * @param       options.color               color for the background {@linkcode Glasium.Color}
//      * @param       options.scale               scale size (bigger number is bigger size)
//      * @param       options.speed               speed (how many iterations per 5 seconds)
//      * @param       options.count               shape count
//      * @param       options.rotate              rotation
//      * @param       options.onMutation          mutation change
//      */
//     static init(
//         element: HTMLElement,
//         {
//             shape = "triangle",
//             color = COLOR.BLUE,
//             scale = 2,
//             speed = 2,
//             count = 10,
//             rotate = false,
//             onMutation = undefined,
//         }: Glasium.Option = {}
//     ): void {
//         if (onMutation != undefined) {
//             new MutationObserver((): void => {
//                 Glasium.change(
//                     element,
//                     onMutation[onMutation.rule() ? "true" : "false"]
//                 )
//             }).observe(
//                 onMutation.observing,
//                 onMutation.options === undefined
//                     ? { attributes: true, childList: true }
//                     : onMutation.options
//             )

//             Glasium.init(element, {
//                 shape,
//                 color,
//                 scale,
//                 speed,
//                 count,
//                 rotate,
//                 ...onMutation[onMutation.rule() ? "true" : "false"],
//             })

//             return
//         }

//         /** remove current background */
//         let currentBackground: Element | null = element.querySelector(
//             ".glasium__background"
//         )

//         if (currentBackground) currentBackground.remove()

//         /** initialize class list */
//         const classList: string[] = [...element.classList]
//         element.className = ""
//         element.classList.add("glasium", ...classList)

//         /** initialize background */
//         this.background(element, { shape, color, scale, speed, count, rotate })
//     }

//     static change(
//         element: HTMLElement,
//         {
//             shape = "triangle",
//             color = COLOR.BLUE,
//             scale = 2,
//             speed = 2,
//             rotate = false,
//         }: Glasium.Option = {}
//     ): void {
//         const background: HTMLElement | null = element.querySelector(
//             ".glasium__background"
//         )

//         if (background === null) return

//         /** background css */
//         $(background).css({
//             "--background-color": color.background,
//             "--rotation": rotate ? "360deg" : "0deg",
//             "--shape-color": color.shape,
//             "--background-height": `${background.offsetHeight}px`,
//         })

//         element.style.color = color.invertContrast ? "black" : "white"

//         /** shape css */
//         $("*", background).each(function (): void {
//             /** change shape */
//             const shapeType: Glasium.Shape =
//                 shape === "all" ? library.randomItem(SHAPES) : shape

//             this.className = ""
//             this.classList.add(`glasium__shape--${shapeType}`)

//             /** css value */
//             let randomScale: number =
//                 library.randomBetween(0.4, 2, false) * scale
//             let randomBrightness: number = library.randomBetween(
//                 color.brightness[0],
//                 color.brightness[1],
//                 false,
//                 [0.98, 1.02]
//             )
//             let size: number = 26 * randomScale
//             let position: number = library.randomBetween(0, 100, false)
//             let speedPerFiveSeconds: number =
//                 (library.randomBetween(0.67, 1.35, false) * 5) / speed
//             let delay: number = library.randomBetween(
//                 -speedPerFiveSeconds / 2,
//                 speedPerFiveSeconds / 2,
//                 false
//             )

//             /** css */
//             $(this).css({
//                 "--size": `${size}px`,
//                 "--brightness": randomBrightness,
//                 left: `calc(${position}% - ${size}px / 2)`,
//                 animationDelay: `${delay}s`,
//                 animationDuration: `${speedPerFiveSeconds}s`,
//             })
//         })
//     }
// }

// export default Glasium

// export const BRIGHTNESS: {
//     DARK: Glasium.Color["brightness"]
//     LIGHT: Glasium.Color["brightness"]
//     OTHER: Glasium.Color["brightness"]
// } = {
//     DARK: [1.14, 1.3],
//     LIGHT: [0.94, 1.05],
//     OTHER: [0.9, 1.2],
// }

// export const COLOR: {
//     BLUE: Glasium.Color
//     RED: Glasium.Color
//     GREY: Glasium.Color
//     GREEN: Glasium.Color
//     PINK: Glasium.Color
//     DARKRED: Glasium.Color
//     ORANGE: Glasium.Color
//     NAVYBLUE: Glasium.Color
//     WHITESMOKE: Glasium.Color
//     LIGHTBLUE: Glasium.Color
//     DARK: Glasium.Color
//     YELLOW: Glasium.Color
//     PURPLE: Glasium.Color
// } = {
//     BLUE: {
//         background: "#44aadd",
//         shape: "#44aadd",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
//     RED: {
//         background: "#fb3852",
//         shape: "hsl(352, 85%, 50%)",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
//     GREY: {
//         background: "#485e74",
//         shape: "#485e74",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
//     GREEN: {
//         background: "#38e538",
//         shape: "#38e538",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
//     PINK: {
//         background: "#ff66aa",
//         shape: "#ff66aa",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
//     DARKRED: {
//         background: "#c52339",
//         shape: "#c52339",
//         invertContrast: false,
//         brightness: BRIGHTNESS.DARK,
//     },
//     ORANGE: {
//         background: "#ffa502",
//         shape: "#ffa502",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
//     NAVYBLUE: {
//         background: "#333d79",
//         shape: "#333d79",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
//     WHITESMOKE: {
//         background: "#f6f6f6",
//         shape: "#f6f6f6",
//         invertContrast: true,
//         brightness: BRIGHTNESS.LIGHT,
//     },
//     LIGHTBLUE: {
//         background: "#b9e8fd",
//         shape: "#b9e8fd",
//         invertContrast: true,
//         brightness: BRIGHTNESS.LIGHT,
//     },
//     DARK: {
//         background: "#1e1e1e",
//         shape: "#242424",
//         invertContrast: false,
//         brightness: BRIGHTNESS.DARK,
//     },
//     YELLOW: {
//         background: "#ffc414",
//         shape: "#fccc3de6",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
//     PURPLE: {
//         background: "rgb(95, 57, 155)",
//         shape: "rgb(95, 57, 155)",
//         invertContrast: false,
//         brightness: BRIGHTNESS.OTHER,
//     },
// }

// export const SHAPES: Glasium.Shape[] = [
//     "triangle",
//     "square",
//     "hexagon",
//     "circle",
//     "all",
// ]

// declare global {
//     namespace Glasium {
//         type Shape = "circle" | "triangle" | "square" | "hexagon" | "all"

//         interface Color {
//             background: string
//             shape: string
//             invertContrast: boolean
//             brightness: [number, number]
//         }

//         interface Option {
//             shape?: Shape
//             color?: Color
//             scale?: number
//             speed?: number
//             count?: number
//             rotate?: boolean
//             onMutation?: {
//                 true: {
//                     shape?: Shape
//                     color?: Color
//                     scale?: number
//                     speed?: number
//                     rotate?: boolean
//                 }
//                 false: {
//                     shape?: Shape
//                     color?: Color
//                     scale?: number
//                     speed?: number
//                     rotate?: boolean
//                 }
//                 rule(): boolean
//                 observing: HTMLElement
//                 options?: MutationObserverInit
//             }
//         }
//     }
// }
