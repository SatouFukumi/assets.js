import {
    Component,
    createRef,
    useState,
    useCallback,
    useContext,
    createContext,
    Context,
} from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import styles from "@styles/components/navigation.module.scss"
import { useRenderEffect } from "@ts/libraries"
import Glasium, { COLOR } from "./glasium"

const NavigationContext: Context<Fukumi.NavigationContextType> = createContext({
    setPathIndicator: (width: number, left: number): void => {},
    setTooltip: (props: Fukumi.NavigationTooltipProps): void => {},
    routerPath: "/",
})

function NavigationContextWrapper({
    setPathIndicator,
    setTooltip,
    children,
}: Fukumi.NavigationContextWrapperProps): JSX.Element {
    const contextValue: Fukumi.NavigationContextType = {
        setPathIndicator,
        setTooltip,
        routerPath: useRouter().asPath,
    }

    return (
        <NavigationContext.Provider value={contextValue}>
            {children}
        </NavigationContext.Provider>
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
        this.setState({
            pathIndicator: {
                left: left,
                width: width,
            },
        })
    }

    private setTooltip({
        title,
        description = "",
        activate = true,
        left = 0,
        width = 0,
    }: Fukumi.NavigationTooltipProps): void {
        if (!activate || !title)
            return this.setState(
                ({ tooltip }: Readonly<Fukumi.NavigationState>) => ({
                    tooltip: {
                        ...tooltip,
                        activate: false,
                    },
                })
            )

        if (!this.ref.tooltip.current) return

        this.setState(({ tooltip }: Readonly<Fukumi.NavigationState>) => ({
            tooltip: {
                ...tooltip,
                title: title,
                description: description,
            },
        }))

        if (
            this.ref.tooltip.current.getBoundingClientRect().left +
                this.ref.tooltip.current.getBoundingClientRect().width >
            window.innerWidth
        )
            return this.setState(
                ({ tooltip }: Readonly<Fukumi.NavigationState>) => ({
                    tooltip: {
                        ...tooltip,
                        align: "right",
                        side: "right",
                        position: left + width,
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
        this.setState({ underlay: activate })
    }

    public CONSTANT: Fukumi.NavigationConstant = Object.freeze({
        height: styles.height,
    })

    public state: Readonly<Fukumi.NavigationState> = {
        underlay: false,

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
        return (
            <NavigationContextWrapper
                setPathIndicator={this.setPathIndicator.bind(this)}
                setTooltip={this.setTooltip.bind(this)}
            >
                <div
                    ref={this.ref.container}
                    className={styles.container}
                    data-navigation-tooltip={this.state.tooltip.activate}
                    data-hide={this.props.hide}
                    data-underlay={this.state.underlay && !this.props.hide}
                >
                    <span className={styles.route}>
                        <Glasium
                            colorOptions={
                                this.props.route?.colorOptions ??
                                COLOR.whitesmoke
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

                    <div
                        className={styles.underlay}
                        onClick={(): void => this.setUnderlay.bind(this)()}
                    />

                    <div className={styles.expander} />
                </div>
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
    const { setPathIndicator, setTooltip, routerPath } =
        useContext(NavigationContext)
    const [activated, setActivated] = useState(false)
    const ref: React.RefObject<HTMLAnchorElement> =
        createRef<HTMLAnchorElement>()

    const indicate: () => void = useCallback((): void => {
        function activate(): void {
            if (!ref.current?.parentElement) return

            const { width, left } = ref.current.getBoundingClientRect()

            setPathIndicator(
                width,
                left - ref.current.parentElement.getBoundingClientRect().left
            )

            setActivated(true)
        }

        if (href === "/" && routerPath !== href) return setActivated(false)

        if (routerPath.startsWith(href)) return activate()

        return setActivated(false)
    }, [href, setPathIndicator, ref, routerPath])

    useRenderEffect(indicate, [href, routerPath])

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

declare global {
    namespace Fukumi {
        interface NavigationProps {
            children: JSX.Element[]
            hide?: boolean
            route?: {
                colorOptions?: Fukumi.GlasiumOptions
            }
        }

        interface NavigationRef {
            container: React.RefObject<HTMLDivElement>
            tooltip: React.RefObject<HTMLDivElement>
        }

        interface NavigationConstant {
            readonly height: string
        }

        interface NavigationState {
            underlay: boolean

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
            routerPath: string
        }

        interface NavigationContextWrapperProps
            extends Omit<Fukumi.NavigationContextType, "routerPath"> {
            children: JSX.Element
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
    }
}
