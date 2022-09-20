import {
    Component,
    createRef,
    useState,
    useCallback,
    useContext,
    createContext,
    Context,
} from "react"
import { NextRouter, useRouter } from "next/router"
import Link from "next/link"

import styles from "@styles/components/navigation.module.scss"
import { useRenderEffect } from "@ts/libraries"
import Glasium, { COLOR } from "./glasium"

type PathIndicatorContextType = Context<(width: number, left: number) => void>

export const PathIndicatorContext: PathIndicatorContextType = createContext(
    (width: number, left: number): void => {}
)

export class Navigation extends Component<
    Fukumi.NavigationProps,
    Fukumi.NavigationState
> {
    private ref: Fukumi.NavigationRef = {
        container: createRef<HTMLDivElement>(),
    }

    private setPathIndicator(width: number, left: number): void {
        this.setState({
            pathIndicatorLeft: left,
            pathIndicatorWidth: width,
        })
    }

    public CONSTANT: Fukumi.NavigationConstant = Object.freeze({
        height: styles.height,
    })

    public state: Readonly<Fukumi.NavigationState> = {
        pathIndicatorWidth: 0,
        pathIndicatorLeft: 0,
    }

    public render(): JSX.Element {
        return (
            <PathIndicatorContext.Provider
                value={this.setPathIndicator.bind(this)}
            >
                <div
                    className={styles.container}
                    ref={this.ref.container}
                >
                    <div className={styles.expander} />
                    <div
                        className={styles.indicator}
                        style={{
                            width: `${this.state.pathIndicatorWidth}px`,
                            left: `${this.state.pathIndicatorLeft}px`,
                        }}
                    />

                    {this.props.children}
                </div>
            </PathIndicatorContext.Provider>
        )
    }
}

export function Anchor({
    href,
    icon,
    colorOptions = COLOR.whitesmoke,
    title,
    description,
}: Fukumi.NavigationAnchorProps): JSX.Element {
    const router: NextRouter = useRouter()
    const [activated, setActivated] = useState(false)
    const setPathIndicator: (width: number, left: number) => void =
        useContext(PathIndicatorContext)
    const ref: React.RefObject<HTMLAnchorElement> =
        createRef<HTMLAnchorElement>()

    const indicate: () => void = useCallback((): void => {
        if (!ref.current) return

        const { width, left } = ref.current.getBoundingClientRect()

        function activate(): void {
            setActivated(true)
            setPathIndicator(width, left)
        }

        if (href === "/") {
            if (window.location.pathname !== href) return setActivated(false)
            return activate()
        }

        switch (href[0]) {
            case "#":
                if (window.location.hash.startsWith(href)) activate()
                break

            case "/":
                if (window.location.pathname.startsWith(href)) activate()
                break

            default:
                setActivated(false)
                break
        }
    }, [href, setPathIndicator, ref])

    useRenderEffect((): void => indicate(), [href, router.asPath])

    return (
        <Link href={href}>
            <a
                data-activated={activated}
                className={styles.link}
                ref={ref}
            >
                <Glasium
                    colorOptions={colorOptions}
                    count={5}
                />
                <i className={icon} />
            </a>
        </Link>
    )
}

declare global {
    namespace Fukumi {
        interface NavigationProps {
            children: React.ReactNode[]
        }

        interface NavigationRef {
            container: React.RefObject<HTMLDivElement>
        }

        interface NavigationConstant {
            readonly height: string
        }

        interface NavigationState {
            pathIndicatorWidth: number
            pathIndicatorLeft: number
        }

        interface NavigationAnchorProps {
            href: `/${string}` | `#${string}`
            icon: string
            title?: string
            description?: string
            colorOptions?: Fukumi.GlasiumOptions
        }
    }
}
