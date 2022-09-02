import Lazyload from "./lazyload"
import Glasium, { COLOR } from "./glasium"
import { $, $$ } from "../ts/jquery"
import library from "../ts/libraries"
import magicDOM from "../ts/magic-dom"

export const navigation: Nav.Interface = {
    get initialized(): boolean {
        return !!this.component
    },

    block: {},

    setUnderlay(activate: boolean = false): void {
        if (this.underlay === undefined) return

        $(this.underlay).dataset("activated", activate ? "" : null)
    },

    setLoading(loading: boolean = true): void {
        if (this.container === undefined) return

        if (loading) this.container.append(magicDOM.createTree("div", "loading--cover"))
        else this.container.querySelector(".loading--cover")?.remove()
    },

    subWindowList: [],

    init(container: string, content: string): void {
        if (typeof window === "undefined" || this.initialized) return

        /** initialize container and content */
        let cont: HTMLElement | null = $$(container)
        if (cont === null) return

        this.container = cont

        /** initialize components */
        this.component = magicDOM.createElement("div", { classList: "nav" })

        this.block.left = magicDOM.createElement("div", {
            classList: "nav--left",
        })
        this.block.right = magicDOM.createElement("div", {
            classList: "nav--right",
        })

        this.tooltip = magicDOM.createTree(
            "div",
            "nav__tooltip",
            {},
            {
                t: { classList: "nav__tooltip__title" },
                d: { classList: "nav__tooltip__description" },
            }
        )

        this.underlay = magicDOM.createElement("div", {
            classList: "nav__underlay",
        })
        this.underlay.onclick = (): void => {
            for (let item of this.subWindowList) if (item.isShowing) item.hide(false)

            this.setUnderlay(false)
        }

        this.component.append(
            this.block.left,
            this.block.right,
            this.tooltip ?? "",
            this.underlay
        )

        /** append */
        this.container.insertBefore(this.component, this.container.firstChild)

        /** stylesheet */
        const style: HTMLStyleElement = magicDOM.createElement("style")

        style.textContent = `
        ${container} {
            position: absolute;
            inset: 0;

            margin-block-start: var(--nav-height);

            display: flex;
            flex-direction: column;

            place-items: center;

            width: auto;
            height: auto;
        }


        ${content} {
            width: 100%;
            height: 100%;
        }
        `

        this.container.append(style)
    },

    insert(
        { container }: Pick<Nav.Component, "container">,
        location: keyof Nav.Interface["block"],
        order?: number
    ): void {
        if (order) $(container).css({ order })

        this.block[location]?.append(container)
    },

    addComponent: {
        logo({
            logo = "favicon.png",
            title = "app",
            onlyActive = false,
        }: {
            logo?: string
            title?: string
            onlyActive?: boolean
        } = {}): Nav.Component {
            const container: HTMLDivElement & {
                i?: HTMLImageElement
                t?: HTMLDivElement
            } = magicDOM.createTree(
                "div",
                "nav__logo",
                {},
                {
                    i: new Lazyload(logo, { classList: "nav__logo__icon" }).component,
                    t: { classList: "nav__logo__title", children: title },
                }
            )

            const tooltip: Tooltip = new Tooltip(container)
            const clicker: Clicker = new Clicker(container, onlyActive)
            const subWindow: SubWindow = new SubWindow(container)

            navigation.insert({ container }, "left", 1)

            return {
                container,
                tooltip,
                clicker,
                subWindow,
            }
        },

        route(
            collection: Array<{
                href: string
                icon?: string
                tooltip?: {
                    title?: string
                    description?: string
                }
            }>,
            spa: boolean = false
        ): void {
            if (typeof window === "undefined" || navigation.component === undefined)
                return

            /** holder */
            const router: HTMLElement = magicDOM.createElement("div", {
                classList: "nav__component",
            })

            /** router background */
            Glasium.init(router, {
                count: 8,
                onMutation: {
                    rule(): boolean {
                        return document.body.dataset.theme === "dark"
                    },
                    false: { color: COLOR.WHITESMOKE },
                    true: { color: COLOR.DARK },
                    observing: document.body,
                    options: { attributeFilter: ["data-theme"] },
                },
            })

            /** route initialization */
            function createRoute({
                href,
                icon,
            }: {
                href: string
                icon?: string
            }): HTMLElement {
                if (spa) {
                    const anchor: HTMLElement | null = document.querySelector(
                        `[data-href='${href}']`
                    )

                    if (anchor === null) {
                        let message: string = `'navigation.addComponent.route()' : missing href - ${href}`
                        throw new Error(message)
                    }

                    anchor.classList.add("nav__link")
                    anchor.append(
                        magicDOM.toHTMLElement(`<i class="fa-solid fa-${icon}"></i>`)
                    )

                    return anchor
                }

                return magicDOM.createElement("div", {
                    classList: "nav__link",
                    attribute: { "data-href": href },
                    children: magicDOM.toHTMLElement(
                        `<i class="fa-solid fa-${icon}"></i>`
                    ),
                })
            }

            let navigating: boolean = false

            for (let item of collection) {
                /** make route */
                const route: HTMLElement = createRoute(item)

                /** route appending */
                router.append(route)

                /** events */
                $(route).on("click", (): void => {
                    indicate(route)

                    if (navigating || spa) return

                    navigating = true
                    navigation.setLoading(true)

                    new Promise<void>(
                        (resolve: (value: void | PromiseLike<void>) => void): void => {
                            setTimeout(resolve, 200)
                        }
                    ).then((): string => (window.location.pathname = item.href))
                })

                /** tooltip */
                new Tooltip(route).set(item.tooltip)
            }

            /** route indication */
            const indicator: HTMLElement = magicDOM.createElement("div", {
                classList: "nav__indicator",
            })

            navigation.component.append(indicator)

            function indicate(
                current: HTMLElement | null = $$(`a[data-href="${pathname()}"]`)
            ): void {
                if (current === null) return

                $("a[data-current]").dataset("current", null)
                $(current).dataset("current", "")

                const { left, width } = current.getBoundingClientRect()

                $(indicator).css({
                    left: `${left}px`,
                    width: `${width}px`,
                })
            }

            /** insert router */
            navigation.insert({ container: router }, "left", 2)

            /** window change state */
            new MutationObserver((): void => indicate()).observe(document.body, {
                childList: true,
                subtree: true,
            })
        },

        hamburger(): Nav.Component {
            const container: HTMLElement = magicDOM.createElement("div", {
                classList: "nav__hamburger",
                children: [
                    magicDOM.toHTMLElement(
                        `
                        <div class='nav__hamburger__box'>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        `
                    ),
                ],
            })

            navigation.insert({ container }, "right", 1)

            return new Component(container)
        },

        button({
            alwaysActive = false,
            text = "",
            icon = "code",
            image = undefined,
            color = "BLUE",
        }: {
            alwaysActive?: boolean
            text?: string
            icon?: string
            image?: string
            color?: Glasium.Color | keyof typeof COLOR
        } = {}): Nav.ButtonComponent {
            const container: HTMLSpanElement = magicDOM.createTree("span", [
                "nav__component",
                "nav__button",
            ])
            const tooltip: Tooltip = new Tooltip(container)
            const clicker: Clicker = new Clicker(container, alwaysActive)
            const subWindow: SubWindow = new SubWindow(container)

            /** background */
            Glasium.init(container, {
                count: 8,
                color: typeof color === "string" ? COLOR[color] : color,
            })

            /** icon */
            const iconNode: HTMLElement = magicDOM.createElement("i", {
                classList: ["fa-solid", `fa-${icon}`],
                attribute: image ? { style: `display: none` } : {},
            })

            container.append(iconNode)

            /** image */
            const imageNode: Lazyload = new Lazyload(image, {
                classList: "nav__button__image",
            })

            if (image === undefined) $(imageNode.component).css("display", "none")

            container.append(imageNode.component)

            /** text */
            const textNode: HTMLElement = magicDOM.createElement("div", {
                classList: "nav__button__text",
                children: text,
            })

            if (text === undefined || text === "") $(textNode).css("display", "none")

            container.append(textNode)

            /** insert */
            navigation.insert({ container }, "right", 3)

            return {
                container,
                tooltip,
                clicker,
                subWindow,

                get icon(): string {
                    return icon
                },

                get text(): string {
                    return text
                },

                get image(): string {
                    return image ? image : ""
                },

                get color(): Glasium.Color | keyof typeof COLOR {
                    return color
                },

                set icon(iconName: string) {
                    $(iconNode).css("display", null)
                    $(imageNode.component).css("display", "none")

                    iconNode.className = ""

                    iconNode.classList.add("fa-solid", `fa-${iconName}`)

                    icon = iconName
                },

                set text(textContent: string | null) {
                    if (textContent) {
                        $(textNode).css("display", null)

                        textNode.textContent = textContent

                        return
                    }

                    $(textNode).css("display", "")

                    text = textContent ? textContent : ""
                },

                set image(imageSrc: string) {
                    $(iconNode).css("display", "none")
                    $(imageNode.component).css("display", null)

                    imageNode.source = imageSrc

                    image = imageSrc
                },

                set color(colorName: Glasium.Color | keyof typeof COLOR) {
                    Glasium.change(container, {
                        color:
                            typeof colorName === "string" ? COLOR[colorName] : colorName,
                    })

                    color = colorName
                },
            }
        },

        account(): Nav.AccountComponent {
            const button: Nav.ButtonComponent = this.button({
                text: "guest",
                image: "guest.png",
                color: "RED",
            })

            const { container, tooltip, clicker, subWindow } = button

            clicker.onClick((): void => subWindow.toggle())

            navigation.insert({ container }, "right", 2)

            return {
                container,
                tooltip,
                clicker,
                subWindow,

                get avatar(): string {
                    return button.image
                },

                get username(): string {
                    return button.text
                },

                get color(): Glasium.Color | keyof typeof COLOR {
                    return button.color
                },

                set avatar(avatar: string) {
                    button.image = avatar
                },

                set username(username: string) {
                    button.text = username
                },

                set color(color: Glasium.Color | keyof typeof COLOR) {
                    button.color = color
                },
            }
        },
    },

    global: {},
}

class Tooltip {
    constructor(container: HTMLElement) {
        this.container = navigation.tooltip!
        /** as only when navigation is initialized do this be used */

        if (library.isMobile) return

        $(container)
            .on("pointerenter", (event: PointerEvent): void => this.show(event))
            .on("pointerleave", (): void => this.hide())
            .on("pointerdown", (): void => this.hide())
    }

    private title: string = ""
    private description: string = ""
    private flip: boolean = false

    private container: Nav.Tooler

    public set({
        title = "",
        description = "",
        flip = false,
    }: {
        title?: string
        description?: string
        flip?: boolean
    } = {}): void {
        this.title = title
        this.description = description
        this.flip = flip
    }

    public show({ target }: PointerEvent): void {
        if (
            navigation.underlay &&
            navigation.underlay.classList.contains("nav__underlay--active")
        )
            return

        if (navigation.component === undefined) return

        if (this.title === "") return

        this.container.t.textContent = this.title
        this.container.d.textContent = this.description

        const { innerWidth } = window
        const { left, right } = (target as HTMLElement).getBoundingClientRect()
        const { width } = this.container.getBoundingClientRect()

        $(this.container)
            .css({
                left: this.flip ? null : `${left}px`,
                right: this.flip ? `${innerWidth - right}px` : null,
                textAlign: this.flip || left + width >= innerWidth ? "right" : "left",
            })
            .addClass("nav__tooltip--active")

        $(navigation.component).addClass("nav--decorating")
    }

    public hide(): void {
        if (navigation.component === undefined) return

        $(this.container).removeClass("nav__tooltip--active")

        $(navigation.component).removeClass("nav--decorating")
    }
}

class Clicker {
    constructor(private container: HTMLElement, private onlyActive: boolean = false) {
        if (onlyActive) {
            $(container).dataset("activated", "")
            this.__activated = true
        }

        const clickBox: HTMLElement = magicDOM.createTree("div", "invisible")
        container.append(clickBox)

        $(clickBox).on("click", (): void => {
            if (onlyActive) {
                for (let f of this.clickHandlers) f(true)
            } else {
                let isActive: boolean = container.dataset.activated === ""

                for (let f of this.clickHandlers) f(!isActive)

                this.toggle(isActive)
            }
        })

        this.container.dataset.clicker = ""
    }

    private clickHandlers: Array<(isActive: boolean) => void> = []

    private __activated: boolean = false

    public get activated(): boolean {
        return this.__activated
    }

    public get toOnlyActive(): boolean {
        return this.onlyActive
    }

    public set toOnlyActive(onlyActive: boolean) {
        const dataset:
            | {
                  activated: string
                  deactivated: null
              }
            | {
                  activated?: never
                  deactivated?: never
              } = onlyActive ? { activated: "", deactivated: null } : {}

        $(this.container).dataset(dataset)

        this.onlyActive = onlyActive
    }

    public onClick(func: (isActive: boolean) => void): number {
        return this.clickHandlers.push(func)
    }

    public offClick(id: number): void {
        this.clickHandlers[id] = (): void => {}
    }

    public toggle(isActive: boolean = this.activated): void {
        this.__activated = !isActive

        this[this.__activated ? "show" : "hide"]()
    }

    public show(): void {
        if (this.clickHandlers.length === 0) return

        this.container.dataset.activated = ""
    }

    public hide(): void {
        delete this.container.dataset.activated
    }
}

class SubWindow {
    constructor(
        private container: HTMLElement,
        content: string | HTMLElement = "...loading..."
    ) {
        /** initialize component */
        this.content = content

        this.windowNode.append(this.contentNode, this.overlayNode)
        this.container.append(this.windowNode)

        navigation.subWindowList.push(this)

        /** observer */
        new ResizeObserver((): void => this.update()).observe(this.container)
        new ResizeObserver((): void => this.update()).observe(this.contentNode)
        $(window).on("resize", (): void => this.update())
    }

    /** props */
    private __id: string = library.randomString()
    private __isShowing: boolean = false

    private hideId: number = -1

    /** getters */
    public get id(): string {
        return this.__id
    }
    public get isShowing(): boolean {
        return this.__isShowing
    }

    /** handlers collection */
    private toggleHandlers: Array<(...args: any[]) => void> = []

    /** nodes */
    private windowNode: HTMLElement = magicDOM.createElement("div", {
        classList: ["nav__sub-window"],
        attribute: { "data-id": this.__id, "data-deactivated": "" },
    })

    private overlayNode: HTMLElement = magicDOM.createElement("div", {
        classList: "nav__sub-window__overlay",
        children: magicDOM.createTree("div", "loading--cover"),
    })

    private contentNode: HTMLElement = magicDOM.createElement("div", {
        classList: "nav__sub-window__content",
    })

    /** setters */
    public set loading(loading: boolean) {
        $(this.overlayNode).css("display", loading ? "block" : "none")
    }

    public set content(content: string | HTMLElement) {
        magicDOM.emptyNode(this.contentNode)

        this.contentNode.append(content)

        this.update()
    }

    /** public funcs */
    update(): void {
        window.requestAnimationFrame((): void => {
            if (navigation.container === undefined) return

            const { clientWidth } = navigation.container

            let height: number = this.isShowing ? this.contentNode.offsetHeight : 0
            $(this.windowNode).css("--height", `${height}px`)

            let rect: DOMRect = this.container.getBoundingClientRect()
            let width: number = this.contentNode.offsetWidth

            if (width - rect.right < 0) $(this.windowNode).dataset("align", "right")
            else if (rect.left + width < clientWidth)
                $(this.windowNode).dataset("align", "left")
            else {
                $(this.windowNode)
                    .dataset("align", "expanded")
                    .css({
                        "--width": `${clientWidth}px`,
                        "--left": rect.left,
                    })

                return
            }

            $(this.windowNode).css("--width", `${width}px`)
        })
    }

    show(): void {
        clearTimeout(this.hideId)

        for (let subWindow of navigation.subWindowList)
            if (subWindow.id !== this.id) subWindow.hide(false)

        navigation.setUnderlay(true)

        this.update()

        $(this.windowNode).dataset({
            activated: "",
            deactivated: null,
        })
        $(this.container).dataset("activated", "")

        this.__isShowing = true

        this.update()
    }

    hide(trusted: boolean = true): void {
        if (trusted) navigation.setUnderlay(false)

        $(this.windowNode).dataset("activated", null)
        $(this.container).dataset("activated", null)

        this.__isShowing = false

        this.update()

        this.hideId = setTimeout((): void => {
            $(this.windowNode).dataset("deactivated", "")
        }, 300)

        this.update()
    }

    toggle(): void {
        this[this.isShowing ? "hide" : "show"]()

        for (let f of this.toggleHandlers) f(this.isShowing)
    }

    onToggle(func: (...args: any[]) => void): void {
        this.toggleHandlers.push(func)
    }
}

export class Component {
    constructor(public container: HTMLElement) {}

    public tooltip: Tooltip = new Tooltip(this.container)
    public clicker: Clicker = new Clicker(this.container)
    public subWindow: SubWindow = new SubWindow(this.container)
}

export default navigation

declare global {
    namespace Nav {
        interface Interface {
            get initialized(): boolean
            container?: HTMLElement
            component?: HTMLElement
            block: {
                left?: HTMLElement
                right?: HTMLElement
            }
            tooltip?: Tooler
            underlay?: HTMLElement
            setUnderlay(activate?: boolean): void
            setLoading(loading?: boolean): void
            subWindowList: Array<SubWindow>
            init: (container: string, content: string) => void
            /** {@linkcode Component} */
            insert: (
                component: Pick<Component, "container">,
                location: keyof this["block"],
                order?: number
            ) => void
            /** {@linkcode Component} */
            addComponent: {
                logo: (props?: {
                    logo?: string
                    title?: string
                    onlyActive?: boolean
                }) => Component
                /**
                 * this uses `[data-href]` as the spa anchor
                 * ```html
                 * <element data-href=%href></element>
                 * ```
                 * `%href` should be primary and global most
                 * ```ts
                 * href = `/${path}`
                 * ```
                 */
                route(
                    collection: Array<{
                        href: string
                        icon?: string
                        tooltip?: {
                            title?: string
                            description?: string
                        }
                    }>,
                    spa?: boolean
                ): void
                hamburger: () => Component
                /** {@linkcode ButtonComponent} */
                button: (props?: {
                    alwaysActive?: boolean
                    text?: string
                    icon?: string
                    color?: Glasium.Color | keyof typeof COLOR
                    image?: string
                }) => ButtonComponent
                /** {@linkcode AccountComponent}*/
                account: () => AccountComponent
            }
            global: { [key: string | number | symbol]: any }
        }

        interface Tooler extends HTMLElement {
            t: HTMLElement
            d: HTMLElement
        }

        interface Component {
            container: HTMLElement
            tooltip: Tooltip
            clicker: Clicker
            subWindow: SubWindow
        }

        interface ButtonComponent extends Component {
            get icon(): string
            get text(): string
            get image(): string
            get color(): Glasium.Color | keyof typeof COLOR
            set icon(icon: string)
            set text(text: string | null)
            set image(image: string)
            set color(color: Glasium.Color | keyof typeof COLOR)
        }

        interface AccountComponent extends Component {
            get avatar(): string
            get username(): string
            get color(): Glasium.Color | keyof typeof COLOR
            set avatar(avatar: string)
            set username(username: string)
            set color(color: Glasium.Color | keyof typeof COLOR)
        }
    }
}

function pathname(): string {
    let path: string = window.location.pathname
        .split("/")[1]
        .split("?")
        .shift()!
        .split("#")
        .shift()!

    return `/${path}`
}
