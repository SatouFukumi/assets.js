import { $ } from "../ts/jquery"
import RecordAnimationFrame from "../ts/record-animation-frame"
import changeCase from "../ts/change-case"
import cursor from "../ts/cursor"
import { throttled } from "../ts/libraries"
import magicDOM from "../ts/magic-dom"
import cs from "@ts/client-side"

const OFFSET: number = 135

const LARGE_X_AXIS: number = 0.75
const LARGE_Y_AXIS: number = 0.77
const MOUSE_OFFSET_X: number = 13
const MOUSE_OFFSET_Y: number = 25

const THROTTLE: number = 55

const HIDE_DURATION: number = 200
const DEACTIVATE_DURATION: number = 300

declare global {
    namespace Tooltip {
        interface THTMLElement extends HTMLElement {
            tooltipAttached?: boolean
        }

        interface Interface {
            get initialized(): boolean
            glowing: boolean
            hideId?: number
            deactivateId?: number
            container?: HTMLElement
            content?: HTMLElement
            processor: {
                attribute: {
                    process(target: HTMLElement, key: string): undefined | string
                    attach(hook: Hook): void
                }
                dataset: {
                    process(target: HTMLElement, key: string): undefined | string
                    attach(hook: Hook): void
                }
            }
            process(target: HTMLElement, hook: Hook): undefined | string
            attach(target: THTMLElement, hook: Hook): void
            hooks: Array<Hook>
            init: () => void
            scan: () => void
            /**
             * @example
             * ```ts
             * navigation.addHook('attribute', 'title')
             * ```
             */
            addHook: (on: Hook["on"], key: Hook["key"], hookAssets?: AddHook) => void
            pointerenter(target: HTMLElement, hook: Hook): void
            pointerleave(hook: Hook): void
            show: (content: string | HTMLElement) => void
            hide: () => void
            move: RecordAnimationFrame
            __move: () => void
            updateSize: () => void
            update: (content: string | HTMLElement) => void
            glow: () => void
        }

        interface Hook extends Required<AddHook> {
            on: "attribute" | "dataset"
            key: string
        }

        interface AddHook {
            handler?: (assets: {
                target: HTMLElement
                value: undefined | string
                update: (content: string | HTMLElement) => void
            }) => undefined | string | HTMLElement
            follower?: () => void
            fit?: boolean
            priority?: number
        }
    }
}

export const tooltip: Tooltip.Interface = {
    get initialized(): boolean {
        return !!(this.container && this.content)
    },

    glowing: false,

    processor: {
        attribute: {
            process(target: HTMLElement, key: string): undefined | string {
                let attrValue: null | string = target.getAttribute(key)
                return attrValue ? attrValue : undefined
            },

            attach(hook: Tooltip.Hook): void {
                if (typeof window === "undefined") return

                const key: string = hook.key
                $(`[${key}]`).each(function (): void {
                    tooltip.attach(this, hook)
                })
            },
        },

        dataset: {
            process(target: HTMLElement, key: string): undefined | string {
                let datasetKey: string = changeCase.kebab.camel(key)
                return target.dataset[datasetKey]
            },

            attach(hook: Tooltip.Hook): void {
                if (typeof window === "undefined") return

                const key: string = changeCase.camel.kebab(hook.key)
                $(`[data-${key}]`).each(function (): void {
                    tooltip.attach(this, hook)
                })
            },
        },
    },

    process(target: HTMLElement, { on, key }: Tooltip.Hook): undefined | string {
        return this.processor[on].process(target, key)
    },

    attach(target: Tooltip.THTMLElement, hook: Tooltip.Hook): void {
        if (target.tooltipAttached || this.process(target, hook) === undefined) return

        /** key */
        let { key } = hook
        if (hook.on === "dataset") key = `data-${changeCase.camel.kebab(key)}`

        /** observer */
        const observer: MutationObserver = new MutationObserver((): void => {
            this.pointerenter(target, hook)
        })

        /** attach event */
        $(target)
            .on("pointerenter", (): void => {
                observer.observe(target, { attributeFilter: [key] })
                this.pointerenter(target, hook)
            })
            .on("pointerleave", (): void => {
                observer.disconnect()
                this.pointerleave(hook)
            })

        /** init */
        target.tooltipAttached = true
    },

    hooks: [
        {
            on: "attribute",
            key: "title",
            handler({
                target,
                value,
            }: {
                target: HTMLElement & { tipTitle?: string }
                value: undefined | string
            }): undefined | string {
                if (value === undefined) return target.tipTitle

                target.tipTitle = value
                target.removeAttribute("title")

                return value
            },
            follower(): void {},
            priority: 1,
            fit: false,
        },
    ],

    init(): void {
        if (typeof window === "undefined" || cs.isMobile() || this.initialized) return

        /** watch cursor */
        cursor.watch(true)
        this.move.start(1)

        /** initialize the tooltip component */
        this.container = magicDOM.createElement("div", { classList: "tooltip" })
        this.content = magicDOM.createElement("div", {
            classList: "tooltip__content",
        })
        this.container.append(this.content)
        document.body.insertBefore(this.container, document.body.firstChild)

        /** first initialization */
        this.hide()
        this.scan()

        /** observer */
        new ResizeObserver((): void => this.updateSize()).observe(this.content)
        new MutationObserver((): void => this.scan()).observe(document.body, {
            childList: true,
            subtree: true,
        })

        /** limit glowing effect */
        $(this.container).on("animationend", function (): void {
            $(this).dataset("glow", null)
            tooltip.glowing = false
        })
    },

    scan(): void {
        this.hooks.forEach((hook: Tooltip.Hook): void => {
            this.processor[hook.on].attach(hook)
        })
    },

    addHook(
        on: Tooltip.Hook["on"],
        key: Tooltip.Hook["key"],
        {
            handler = ({ value }: { value: undefined | string }): string | undefined =>
                value,
            follower = (): void => {},
            priority = 1,
            fit = false,
        }: Tooltip.AddHook = {}
    ): void {
        const hook: Tooltip.Hook = { on, key, handler, follower, priority, fit }

        this.hooks.push(hook)

        /** sort hook by priority */
        this.hooks.sort((a: Tooltip.Hook, b: Tooltip.Hook): number => {
            return b.priority - a.priority
        })

        /** attach */
        this.processor[on].attach(hook)
    },

    pointerenter(target: HTMLElement, hook: Tooltip.Hook): void {
        if (this.container === undefined) return

        /** content */
        const value: undefined | string = this.process(target, hook)
        const content: undefined | string | HTMLElement = hook.handler({
            target,
            value,
            update: (content_: string | HTMLElement): void => this.update(content_),
        })

        /** fit option */
        if (hook.fit) $(this.container).dataset("fit", "")

        /** display content */
        if (content) this.show(content)
    },

    pointerleave(hook: Tooltip.Hook): void {
        if (this.container === undefined) return

        hook.follower()
        this.hide()

        if (hook.fit) $(this.container).dataset("fit", null)
    },

    show(content: string | HTMLElement): void {
        if (this.container === undefined) return

        clearTimeout(this.hideId)
        clearTimeout(this.deactivateId)

        $(this.container).dataset({
            activated: "",
            deactivated: null,
        })

        this.update(content)

        this.move.start()
    },

    hide(): void {
        if (this.container === undefined) return

        const { container } = this

        this.hideId = setTimeout((): void => {
            $(container).dataset("activated", null)

            this.deactivateId = setTimeout((): void => {
                $(container).dataset("deactivated", "")

                this.move.stop()
            }, DEACTIVATE_DURATION)
        }, HIDE_DURATION)
    },

    move: new RecordAnimationFrame(
        throttled(function (): void {
            tooltip.__move()
        }, THROTTLE)
    ),

    __move(): void {
        if (this.container === undefined) return

        const { container } = this

        const { innerWidth, innerHeight } = window
        const { offsetWidth, offsetHeight } = container
        const { positionX, positionY } = cursor

        const isMoreOuterX: boolean = innerWidth * LARGE_X_AXIS < positionX
        const isMoreOuterY: boolean = innerHeight * LARGE_Y_AXIS < positionY
        const isLargerThanScreenX: boolean = innerWidth - offsetWidth - OFFSET < positionX
        const isLargerThanScreenY: boolean =
            innerWidth - offsetHeight - OFFSET < positionY

        const posX: number =
            isMoreOuterX || isLargerThanScreenX
                ? positionX - offsetWidth - MOUSE_OFFSET_X
                : positionX + MOUSE_OFFSET_X

        const posY: number =
            isMoreOuterY || isLargerThanScreenY
                ? positionY - offsetHeight - MOUSE_OFFSET_Y
                : positionY + MOUSE_OFFSET_Y

        $(container).css({
            "--position-x": posX,
            "--position-y": posY,
        })
    },

    updateSize(): void {
        if (this.container === undefined || this.content === undefined) return

        $(this.container).css({
            "--width": this.content.offsetWidth,
            "--height": this.content.offsetHeight,
        })
    },

    update(content: string | HTMLElement): void {
        if (this.content === undefined) return

        this.glow()

        magicDOM.emptyNode(this.content)
        this.content.append(content)
    },

    glow(): void {
        if (this.glowing || this.container === undefined) return

        $(this.container).dataset("glow", "")
    },
}

export default tooltip
