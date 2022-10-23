import {
    Component,
    createRef,
    useState,
    useCallback,
    useContext,
    createContext,
    Context,
    useRef,
    CSSProperties,
} from "react"
import { NextRouter, useRouter } from "next/router"
import Image, { ImageProps } from "next/image"
import Link from "next/link"
import classNames from "classnames"

import styles from "@styles/components/navigation.module.scss"
import glasiumStyles from "@styles/components/glasium.module.scss"

import { useRenderEffect } from "@ts/hooks/use-render-effect"
import Glasium, { COLOR } from "./glasium"
import { clientSide } from "@ts/client-side"

const NavigationContext: Context<Fukumi.NavigationContextType> = createContext({
    setPathIndicator: (width: number, left: number): void => {},
    setTooltip: (props: Fukumi.NavigationTooltipProps): void => {},
    setUnderlay: (activate: boolean = false): void => {},
    addUnderlayClickHandler: (fn: (showing: boolean) => any): undefined => this,
    container: createRef<HTMLDivElement>(),
    router: { path: "/" },
})

function NavigationContextWrapper({
    setPathIndicator,
    setTooltip,
    setUnderlay,
    addUnderlayClickHandler,
    container,
    children,
}: Fukumi.NavigationContextWrapperProps): JSX.Element {
    const router: NextRouter = useRouter()

    const contextValue: Fukumi.NavigationContextType = {
        setPathIndicator,
        setTooltip,
        setUnderlay,
        addUnderlayClickHandler,
        container,
        router: {
            path: router.asPath,
            events: router.events,
        },
    }

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
    )
}

function NavigationLoading(): JSX.Element {
    const { router } = useContext(NavigationContext)
    const [loading, setLoading] = useState(false)

    useRenderEffect((): void | (() => void) => {
        function routeChangeStart(path: string): void {
            if (path === router.path) return setLoading(false)
            setLoading(true)
        }

        function routeChangeComplete(): void {
            setLoading(false)
        }

        router.events?.on("routeChangeStart", routeChangeStart)
        router.events?.on("routeChangeComplete", routeChangeComplete)

        return (): void => {
            router.events?.off("routeChangeStart", routeChangeStart)
            router.events?.off("routeChangeComplete", routeChangeComplete)
        }
    }, [router])

    return (
        <div
            className={styles.loading}
            data-loading={loading}
        >
            <span />
            <span />
            <span />
            <span />
        </div>
    )
}

export class Navigation extends Component<
    Fukumi.NavigationProps,
    Fukumi.NavigationState
> {
    private ref: Fukumi.NavigationRef = {
        container: createRef<HTMLDivElement>(),
        tooltip: createRef<HTMLDivElement>(),
    }

    private setPathIndicator(width: number, left: number): void {
        this.setState({ pathIndicator: { left, width } })
    }

    private setTooltip({
        title,
        description = "",
        activate = true,
        left = 0,
        width = 0,
    }: Fukumi.NavigationTooltipProps): void {
        if (clientSide.isMobile()) return

        if (!activate || !title)
            return this.setState(
                ({ tooltip }: Readonly<Fukumi.NavigationState>) => ({
                    tooltip: { ...tooltip, activate: false },
                })
            )

        if (!this.ref.tooltip.current || !this.ref.container.current) return

        this.setState(({ tooltip }: Readonly<Fukumi.NavigationState>) => ({
            tooltip: { ...tooltip, title, description, activate: false },
        }))

        const containerWidth: number = this.ref.container.current.clientWidth

        if (left > containerWidth / 2)
            return this.setState(
                ({ tooltip }: Readonly<Fukumi.NavigationState>) => ({
                    tooltip: {
                        ...tooltip,
                        side: "right",
                        align: "right",
                        position: containerWidth - left - width,
                        activate: true,
                    },
                })
            )

        this.setState(({ tooltip }: Readonly<Fukumi.NavigationState>) => ({
            tooltip: {
                ...tooltip,
                align: "left",
                side: "left",
                position: left,
                activate: true,
            },
        }))
    }

    private setUnderlay(activate: boolean = false): void {
        this.setState(({ underlay }) => ({
            underlay: { ...underlay, showing: activate },
        }))
    }

    private addUnderlayClickHandler(fn: (showing: boolean) => any): this {
        this.setState(({ underlay }) => ({
            underlay: {
                showing: underlay.showing,
                onClickHandlers: [...underlay.onClickHandlers, fn],
            },
        }))

        return this
    }

    public CONSTANT: Fukumi.NavigationConstant = Object.freeze({
        containerHeight: styles.containerHeight,
        loadingTransitionDelayInitial: styles.loadingTransitionDelayInitial,
        loadingTransitionDelay: styles.loadingTransitionDelay,
        loadingTransitionDuration: styles.loadingTransitionDuration,
    })

    public state: Readonly<Fukumi.NavigationState> = {
        underlay: {
            showing: false,
            onClickHandlers: [],
        },

        pathIndicator: {
            width: 0,
            left: 0,
        },

        tooltip: {
            activate: false,
            title: "",
            description: "",
            side: "left",
            align: "left",
            position: 0,
        },
    }

    public render(): JSX.Element {
        const containerStyle: CSSProperties = {
            "--color": this.props.color,
            "--route-color": this.props.route?.color,
            "--route-color-activated": this.props.route?.colorActive,
        } as CSSProperties

        return (
            <NavigationContextWrapper
                container={this.ref.container}
                setPathIndicator={this.setPathIndicator.bind(this)}
                setTooltip={this.setTooltip.bind(this)}
                setUnderlay={this.setUnderlay.bind(this)}
                addUnderlayClickHandler={this.addUnderlayClickHandler.bind(
                    this
                )}
            >
                <div
                    ref={this.ref.container}
                    className={styles.container}
                    style={containerStyle}
                    data-hide={this.props.hide}
                    data-underlay={
                        this.state.underlay.showing && !this.props.hide
                    }
                >
                    <span className={styles.route}>
                        <Glasium
                            colorOptions={
                                this.props.route?.colorOptions
                                ?? COLOR.whitesmoke
                            }
                            count={11}
                        />

                        {this.props.children.filter(
                            (child: JSX.Element): boolean =>
                                child.type === Anchor
                        )}
                    </span>

                    {this.props.children.filter(
                        (child: JSX.Element): boolean => child.type !== Anchor
                    )}

                    <span
                        ref={this.ref.tooltip}
                        className={styles.tooltip}
                        style={{
                            [this.state.tooltip
                                .side]: `${this.state.tooltip.position}px`,
                            textAlign: this.state.tooltip.align,
                            opacity: this.state.tooltip.activate ? "100%" : "0",
                        }}
                    >
                        <div className={styles.title}>
                            {this.state.tooltip.title}
                        </div>
                        <div className={styles.description}>
                            {this.state.tooltip.description}
                        </div>
                    </span>

                    <div
                        className={styles.indicator}
                        style={{
                            width: `${this.state.pathIndicator.width}px`,
                            left: `${this.state.pathIndicator.left}px`,
                        }}
                    />

                    <div className={styles.expander} />

                    <div
                        className={styles.underlay}
                        onClick={(): any => {
                            this.state.underlay.onClickHandlers?.forEach(
                                (fn: (showing: boolean) => any): void => {
                                    fn(this.state.underlay.showing)
                                }
                            )

                            this.setState(({ underlay }) => ({
                                underlay: { ...underlay, showing: false },
                            }))
                        }}
                    />
                </div>

                <NavigationLoading />
            </NavigationContextWrapper>
        )
    }
}

export function Anchor({
    href,
    icon,
    title,
    description,
}: Fukumi.NavigationAnchorProps): JSX.Element {
    const { setPathIndicator, setTooltip, router }
        = useContext(NavigationContext)
    const [activated, setActivated] = useState(false)
    const ref: React.RefObject<HTMLAnchorElement>
        = useRef<HTMLAnchorElement>(null)

    useRenderEffect((): void => {
        function activate(): void {
            if (!ref.current?.parentElement) return

            const { width, left } = ref.current.getBoundingClientRect()

            setPathIndicator(width, left)

            setActivated(true)
        }

        if (href === "/" && router.path !== href) return setActivated(false)

        if (router.path.startsWith(href)) return activate()

        return setActivated(false)
    }, [href, router.path])

    const onPointerEnter: () => void = useCallback((): void => {
        if (!ref.current || activated) return

        const { left, width } = ref.current.getBoundingClientRect()

        setTooltip({
            title,
            description,
            left,
            width,
        })
    }, [title, description, ref, activated, setTooltip])

    const onPointerLeave: () => void = useCallback(
        (): void => setTooltip({ activate: false }),
        [setTooltip]
    )

    return (
        <Link href={href}>
            <a
                data-activated={activated}
                className={styles.link}
                ref={ref}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
            >
                <i className={icon} />
            </a>
        </Link>
    )
}

export function Hamburger({
    onClick = (): void => {},
    title,
    description,
}: Fukumi.NavigationHamburgerProps = {}): JSX.Element {
    const { setUnderlay, setTooltip } = useContext(NavigationContext)
    const [activated, setActivated] = useState(false)
    const ref: React.RefObject<HTMLDivElement> = useRef(null)

    return (
        <div
            ref={ref}
            className={styles.hamburger}
            data-activated={activated}
            onClick={function (
                event: React.MouseEvent<HTMLDivElement, MouseEvent>
            ): void {
                setActivated((value: boolean): boolean => !value)
                onClick({
                    ...event,
                    activated: !activated,
                    setActivated: (
                        setter: boolean | ((value: boolean) => boolean)
                    ): void => {
                        if (typeof setter === "function")
                            return setActivated((value: boolean): boolean =>
                                setter(!value)
                            )

                        setActivated(!setter)
                    },
                    setUnderlay,
                })
            }}
            onPointerEnter={(): void => {
                if (!ref.current) return

                const { width, left } = ref.current.getBoundingClientRect()

                setTooltip({ title, description, width, left })
            }}
            onPointerLeave={function (): void {
                setTooltip({ activate: false })
            }}
        >
            <div />
            <div />
            <div />
        </div>
    )
}

export function Button({
    title,
    description,
    text,
    icon = "nfb nf-cod-code",
    imageProps,
    colorOptions = COLOR.blue,
    alwaysActive = false,
    onClick = (): void => {},
}: Fukumi.NavigationButtonProps): JSX.Element {
    const { setTooltip } = useContext(NavigationContext)
    const [activated, setActivated] = useState(alwaysActive)
    const ref: React.RefObject<HTMLButtonElement> = useRef(null)

    return (
        <button
            ref={ref}
            className={classNames({
                [glasiumStyles.button]: true,
                [styles.button]: true,
            })}
            data-activated={activated}
            onClick={function (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ): void {
                onClick({
                    ...event,
                    activated: !activated,
                    setActivated: function (
                        setter: boolean | ((value: boolean) => boolean)
                    ): void {
                        if (alwaysActive) return

                        if (typeof setter === "function")
                            return setActivated((value: boolean): boolean =>
                                setter(value)
                            )

                        setActivated(setter)
                    },
                })
            }}
            onPointerEnter={(): void => {
                if (!ref.current) return

                const { width, left } = ref.current.getBoundingClientRect()

                setTooltip({ title, description, width, left })
            }}
            onPointerLeave={function (): void {
                setTooltip({ activate: false })
            }}
        >
            <Glasium colorOptions={colorOptions} />
            {imageProps ? (
                <div className={styles.image}>
                    <Image
                        alt=""
                        {...imageProps}
                        layout="fill"
                    />
                </div>
            ) : (
                <i className={icon} />
            )}

            {text === undefined || <span className={styles.text}>{text}</span>}
        </button>
    )
}

export function Logo({
    alwaysActive = false,
    description,
    imageProps = { src: "/favicon.ico" },
    onClick = (): void => {},
    text,
    title,
}: Fukumi.NavigationLogoProps): JSX.Element {
    const { setTooltip } = useContext(NavigationContext)
    const [activated, setActivated] = useState(alwaysActive)
    const ref: React.RefObject<HTMLDivElement> = useRef(null)

    return (
        <div
            ref={ref}
            className={styles.logo}
            data-activated={activated}
            onClick={function (
                event: React.MouseEvent<HTMLDivElement, MouseEvent>
            ): void {
                onClick({
                    ...event,
                    activated: !activated,
                    setActivated: function (
                        setter: boolean | ((value: boolean) => boolean)
                    ): void {
                        if (alwaysActive) return

                        if (typeof setter === "function")
                            return setActivated((value: boolean): boolean =>
                                setter(value)
                            )

                        setActivated(setter)
                    },
                })
            }}
            onPointerEnter={(): void => {
                if (!ref.current) return

                const { width, left } = ref.current.getBoundingClientRect()

                setTooltip({ title, description, width, left })
            }}
            onPointerLeave={function (): void {
                setTooltip({ activate: false })
            }}
        >
            <div className={styles.image}>
                <Image
                    alt=""
                    {...imageProps}
                    layout="fill"
                />
            </div>
            <span className={styles.text}>{text ?? "logo"}</span>
        </div>
    )
}

export function Subwindow({
    title,
    description,
    text,
    icon = "nfb nf-cod-code",
    imageProps,
    colorOptions = COLOR.blue,
    alwaysActive = false,
    onClick = (): void => {},
    children,
    borderColor = "var(--osc-color-blue)",
}: Fukumi.NavigationSubwindowProps): JSX.Element {
    const { setTooltip, setUnderlay, addUnderlayClickHandler, container }
        = useContext(NavigationContext)
    const [activated, setActivated] = useState(alwaysActive)
    const [set, setSet] = useState(false)
    const [height, setHeight] = useState(0)
    const [style, setStyle] = useState<React.CSSProperties>({})
    const [align, setAlign] = useState<"left" | "right" | "full">("right")
    const button: React.RefObject<HTMLButtonElement> = useRef(null)
    const inside: React.RefObject<HTMLDivElement> = useRef(null)

    useRenderEffect((): any => {
        if (!(container.current && button.current && inside.current)) return

        if (!set) {
            addUnderlayClickHandler((): void => setActivated(false))
            setSet(true)
        }

        if (activated) {
            setUnderlay(true)
            setHeight(inside.current.clientHeight)
        } else {
            setUnderlay(false)
        }

        setStyle({})

        const rect: DOMRect = button.current.getBoundingClientRect()
        const width: number = inside.current.offsetWidth
        const { clientWidth } = container.current

        if (rect.right - width > 0) setAlign("right")
        else if (rect.left + width < clientWidth) setAlign("left")
        else {
            setAlign("full")
            setStyle({
                left: -rect.left,
                width: clientWidth,
            })
        }
    }, [container, activated, set, children, addUnderlayClickHandler, setUnderlay])

    return (
        <button
            ref={button}
            className={classNames({
                [glasiumStyles.button]: true,
                [styles.subwindow]: true,
            })}
            data-activated={activated}
        >
            <div
                className="_expander"
                onClick={function (
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>
                ): void {
                    onClick({
                        ...event,
                        activated: !activated,
                        setActivated: function (
                            setter: boolean | ((value: boolean) => boolean)
                        ): void {
                            if (alwaysActive) return

                            if (typeof setter === "function")
                                return setActivated((value: boolean): boolean =>
                                    setter(value)
                                )

                            setActivated(setter)
                        },
                    })
                }}
                onPointerEnter={(): void => {
                    if (!button.current) return

                    const { width, left }
                        = button.current.getBoundingClientRect()

                    setTooltip({ title, description, width, left })
                }}
                onPointerLeave={function (): void {
                    setTooltip({ activate: false })
                }}
            />
            <Glasium colorOptions={colorOptions} />
            {imageProps ? (
                <div className={styles.image}>
                    <Image
                        alt=""
                        {...imageProps}
                        layout="fill"
                    />
                </div>
            ) : (
                <i className={icon} />
            )}

            {text === undefined || <span className={styles.text}>{text}</span>}

            <div
                className={styles.content}
                style={{
                    ...style,
                    borderColor,
                    height: activated ? `${height}px` : 0,
                }}
                data-align={align}
            >
                <div
                    ref={inside}
                    className={styles.inside}
                >
                    {children}
                </div>
            </div>
        </button>
    )
}

const FukumiNav = {
    Navigation,
    Anchor,
    Hamburger,
    Button,
}

export default FukumiNav

declare global {
    namespace Fukumi {
        interface NavigationProps {
            children: JSX.Element[]
            hide?: boolean
            color?: string | `var(--${string})`
            route?: {
                colorOptions?: Fukumi.GlasiumOptions
                color?: string | `var(--${string})`
                colorActive?: string | `var(--${string})`
            }
        }

        interface NavigationRef {
            container: React.RefObject<HTMLDivElement>
            tooltip: React.RefObject<HTMLDivElement>
        }

        interface NavigationConstant {
            readonly containerHeight: string
            readonly loadingTransitionDelayInitial: string
            readonly loadingTransitionDelay: string
            readonly loadingTransitionDuration: string
        }

        interface NavigationState {
            underlay: {
                showing: boolean
                onClickHandlers: ((showing: boolean) => any)[]
            }

            pathIndicator: {
                width: number
                left: number
            }

            tooltip: {
                activate?: boolean
                title: string
                description?: string
                side: "left" | "right"
                position: number
                align: "left" | "right"
            }
        }

        interface NavigationContextType {
            setPathIndicator: (width: number, left: number) => void
            setTooltip: (props: NavigationTooltipProps) => void
            setUnderlay: (activate?: boolean) => void
            addUnderlayClickHandler: (fn: (showing: boolean) => any) => any
            container: React.RefObject<HTMLDivElement>
            router: {
                path: string
                events?: NextRouter["events"]
            }
        }

        interface NavigationContextWrapperProps
            extends Omit<Fukumi.NavigationContextType, "router"> {
            children: JSX.Element[]
        }

        interface NavigationTooltipProps {
            title?: string | undefined
            description?: string | undefined
            left?: number
            width?: number
            activate?: boolean
        }

        interface NavigationAnchorProps {
            href: `/${string}`
            icon: string
            title?: string
            description?: string
        }

        interface NavigationHamburgerClickEvent
            extends React.MouseEvent<HTMLDivElement, MouseEvent> {
            activated: boolean
            setActivated: React.Dispatch<
                React.SetStateAction<NavigationHamburgerClickEvent["activated"]>
            >
            setUnderlay: (activate?: boolean) => void
        }

        interface NavigationButtonClickEvent
            extends React.MouseEvent<HTMLButtonElement, MouseEvent> {
            activated: boolean
            setActivated: React.Dispatch<
                React.SetStateAction<NavigationButtonClickEvent["activated"]>
            >
        }

        interface NavigationSubwindowClickEvent
            extends React.MouseEvent<HTMLDivElement, MouseEvent> {
            activated: boolean
            setActivated: React.Dispatch<
                React.SetStateAction<NavigationSubwindowClickEvent["activated"]>
            >
        }

        interface NavigationHamburgerProps {
            title?: string
            description?: string
            onClick?: (event: NavigationHamburgerClickEvent) => any
        }

        interface NavigationButtonProps {
            title?: string
            description?: string
            text?: string
            icon?: string
            image?: string
            alwaysActive?: boolean
            imageProps?: ImageProps
            colorOptions?: GlasiumOptions
            onClick?: (event: NavigationButtonClickEvent) => any
        }

        interface NavigationLogoClickEvent
            extends React.MouseEvent<HTMLDivElement, MouseEvent> {
            activated: boolean
            setActivated: React.Dispatch<
                React.SetStateAction<NavigationLogoClickEvent["activated"]>
            >
        }

        interface NavigationLogoProps
            extends Omit<
                NavigationButtonProps,
                "icon" | "colorOptions" | "onClick"
            > {
            onClick?: (event: NavigationLogoClickEvent) => any
        }

        interface NavigationSubwindowProps
            extends Omit<NavigationButtonProps, "onClick"> {
            children: React.ReactNode | React.ReactNode[]
            borderColor?: React.CSSProperties["borderColor"]
            onClick?: (event: NavigationSubwindowClickEvent) => any
        }
    }
}
